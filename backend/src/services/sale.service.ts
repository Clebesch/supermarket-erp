import prisma from "../lib/prisma.js";

// Erro específico para problemas conhecidos do processo de venda.
export class SaleServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "SaleServiceError";
    this.statusCode = statusCode;
  }
}

// Estrutura de cada produto enviado para a venda.
interface SaleItemData {
  productId: number;
  quantity: number;
}

// Dados necessários para criar uma venda.
// O cliente é opcional.
interface CreateSaleData {
  customerId?: number;
  items: SaleItemData[];
}

// Registra uma venda e atualiza o estoque em uma única transação.
export async function createSale(data: CreateSaleData) {
  if (!data.items.length) {
    throw new SaleServiceError(
      "A venda deve possuir pelo menos um item.",
    );
  }

  // Não permitimos repetir o mesmo produto na lista de itens.
  const productIds = data.items.map((item) => item.productId);
  const uniqueProductIds = [...new Set(productIds)];

  if (uniqueProductIds.length !== productIds.length) {
    throw new SaleServiceError(
      "Não repita o mesmo produto nos itens da venda.",
    );
  }

  // Validações básicas para proteger o serviço.
  for (const item of data.items) {
    if (!Number.isInteger(item.productId) || item.productId <= 0) {
      throw new SaleServiceError("ID de produto inválido.");
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new SaleServiceError(
        "A quantidade deve ser um inteiro positivo.",
      );
    }
  }

  return prisma.$transaction(
    async (tx) => {
      // Se foi informado um cliente, verificamos se ele existe e está ativo.
      if (data.customerId !== undefined) {
        const customer = await tx.customer.findUnique({
          where: { id: data.customerId },
        });

        if (!customer) {
          throw new SaleServiceError("Cliente não encontrado.", 404);
        }

        if (!customer.active) {
          throw new SaleServiceError(
            "Não é possível vender para um cliente inativo.",
          );
        }
      }

      // Bloqueamos os produtos em ordem crescente de ID.
      // Isso reduz o risco de conflitos entre vendas simultâneas.
      const sortedProductIds = [...uniqueProductIds].sort(
        (a, b) => a - b,
      );

      for (const productId of sortedProductIds) {
        const lockedProducts = await tx.$queryRaw<{ id: number }[]>`
          SELECT id
          FROM "Product"
          WHERE id = ${productId}
          FOR UPDATE
        `;

        if (lockedProducts.length === 0) {
          throw new SaleServiceError(
            `Produto ${productId} não encontrado.`,
            404,
          );
        }
      }

      // Lemos os produtos depois de obter os bloqueios.
      const products = await tx.product.findMany({
        where: {
          id: { in: sortedProductIds },
        },
      });

      const productsById = new Map(
        products.map((product) => [product.id, product]),
      );

      // Calculamos os valores usando os preços cadastrados no banco.
      // Os cálculos em centavos evitam imprecisões comuns de decimais.
      let totalCents = 0;

      const itemsToCreate: {
        productId: number;
        quantity: number;
        unitPrice: number;
        subtotal: number;
      }[] = [];

      const stockUpdates: {
        productId: number;
        quantity: number;
        previousStock: number;
        newStock: number;
      }[] = [];

      for (const item of data.items) {
        const product = productsById.get(item.productId);

        if (!product) {
          throw new SaleServiceError(
            `Produto ${item.productId} não encontrado.`,
            404,
          );
        }

        if (!product.active) {
          throw new SaleServiceError(
            `O produto "${product.name}" está inativo.`,
          );
        }

        if (product.stock < item.quantity) {
          throw new SaleServiceError(
            `Estoque insuficiente para "${product.name}". Disponível: ${product.stock}; solicitado: ${item.quantity}.`,
            409,
          );
        }

        const unitPriceCents = Math.round(
          product.salePrice.toNumber() * 100,
        );

        const subtotalCents = unitPriceCents * item.quantity;

        totalCents += subtotalCents;

        itemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: unitPriceCents / 100,
          subtotal: subtotalCents / 100,
        });

        stockUpdates.push({
          productId: product.id,
          quantity: item.quantity,
          previousStock: product.stock,
          newStock: product.stock - item.quantity,
        });
      }

      // O total deve caber no campo Decimal(10, 2).
      if (
        !Number.isSafeInteger(totalCents) ||
        totalCents > 9_999_999_999
      ) {
        throw new SaleServiceError(
          "O total da venda ultrapassa o limite permitido.",
        );
      }
	  
	  // Localizamos e bloqueamos o caixa aberto.
      // O movimento da venda será registrado no mesmo processo da venda.
      const openCashRegisters = await tx.$queryRaw<{ id: number }[]>`
        SELECT id
        FROM "CashRegister"
        WHERE status = 'OPEN'
        ORDER BY id
        LIMIT 1
        FOR UPDATE
      `;

      if (openCashRegisters.length === 0) {
        throw new SaleServiceError(
          "Não existe um caixa aberto para registrar a venda.",
          409,
        );
      }

      const cashRegisterId = openCashRegisters[0].id;

      // Criamos a venda e seus itens dentro da transação.
      const sale = await tx.sale.create({
        data: {
          customerId: data.customerId,
          status: "COMPLETED",
          total: totalCents / 100,
          items: {
            create: itemsToCreate,
          },
        },
      });

      // Baixamos o estoque e registramos cada saída.
      for (const movement of stockUpdates) {
        await tx.product.update({
          where: { id: movement.productId },
          data: {
            stock: movement.newStock,
          },
        });

        await tx.stockMovement.create({
          data: {
            type: "OUT",
            quantity: movement.quantity,
            previousStock: movement.previousStock,
            newStock: movement.newStock,
            reason: `Venda #${sale.id}`,
            productId: movement.productId,
          },
        });
	  }
	  // Registramos o recebimento da venda no caixa.
      await tx.cashMovement.create({
        data: {
           type: "SALE",
           amount: totalCents / 100,
           reason: `Venda #${sale.id}`,
           cashRegisterId,
        },
      });

      // Consultamos novamente para devolver os dados atualizados.
      return tx.sale.findUnique({
        where: { id: sale.id },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  barcode: true,
                },
              },
            },
          },
        },
      });
    },
    {
      maxWait: 10000,
      timeout: 20000,
    },
  );
}

// Lista as vendas da mais recente para a mais antiga.
export async function getSales() {
  return prisma.sale.findMany({
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              barcode: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// Busca uma venda pelo ID.
export async function getSaleById(id: number) {
  return prisma.sale.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              barcode: true,
            },
          },
        },
      },
    },
  });
}