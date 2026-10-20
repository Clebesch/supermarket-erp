
import prisma from "../lib/prisma.js";

// Tipos de movimentação permitidos.
export type StockMovementType = "IN" | "OUT";

// Dados necessários para registrar uma movimentação.
interface CreateStockMovementData {
  productId: number;
  type: StockMovementType;
  quantity: number;
  reason?: string;
}

// Registra uma entrada ou saída de estoque.
export async function createStockMovement(
  data: CreateStockMovementData,
) {
  // Validações básicas.
  if (!Number.isInteger(data.productId) || data.productId <= 0) {
    throw new Error("ID do produto inválido.");
  }

  if (!Number.isInteger(data.quantity) || data.quantity <= 0) {
    throw new Error("A quantidade deve ser um inteiro positivo.");
  }

  if (data.type !== "IN" && data.type !== "OUT") {
    throw new Error("Tipo inválido. Utilize IN ou OUT.");
  }

  // A transação garante que o saldo e o histórico
  // sejam gravados juntos ou desfeitos em caso de erro.
  return prisma.$transaction(async (tx) => {
    // Bloqueia a linha do produto até o fim da transação,
    // evitando que duas movimentações leiam o mesmo saldo
    // e sobrescrevam uma à outra.
    const lockedProducts = await tx.$queryRaw<{ id: number }[]>`
      SELECT id
      FROM "Product"
      WHERE id = ${data.productId}
      FOR UPDATE
    `;

    if (lockedProducts.length === 0) {
      throw new Error("Produto não encontrado.");
    }

    const product = await tx.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    if (!product.active) {
      throw new Error("Não é possível movimentar um produto inativo.");
    }

    const previousStock = product.stock;

    const newStock =
      data.type === "IN"
        ? previousStock + data.quantity
        : previousStock - data.quantity;

    // Impede que o estoque fique negativo.
    if (newStock < 0) {
      throw new Error("Estoque insuficiente para realizar a saída.");
    }

    // Atualiza o produto dentro da transação.
    await tx.product.update({
      where: { id: data.productId },
      data: { stock: newStock },
    });

    // Registra o histórico com os saldos anterior e posterior.
    return tx.stockMovement.create({
      data: {
        type: data.type,
        quantity: data.quantity,
        previousStock,
        newStock,
        reason: data.reason?.trim() || null,
        productId: data.productId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            barcode: true,
            stock: true,
          },
        },
      },
    });
  });
}

export async function getStockMovementsByProduct(productId: number) {
  return prisma.stockMovement.findMany({
    where: {
      productId,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          barcode: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// Consulta o histórico de movimentações, da mais recente para a mais antiga.

interface GetStockMovementsFilters {
  productId?: number;
  type?: StockMovementType;
}

export async function getStockMovements(
  filters: GetStockMovementsFilters = {},
) {
  return prisma.stockMovement.findMany({
    where: {
      ...(filters.productId !== undefined && {
        productId: filters.productId,
      }),

      ...(filters.type !== undefined && {
        type: filters.type,
      }),
    },

    include: {
      product: {
        select: {
          id: true,
          name: true,
          barcode: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}