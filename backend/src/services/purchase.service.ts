import prisma from "../lib/prisma.js";

interface PurchaseItemData {
  productId: number;
  quantity: number;
  unitCost: number;
}

interface CreatePurchaseData {
  supplierId: number;
  items: PurchaseItemData[];
}

export async function createPurchase(data: CreatePurchaseData) {
  return prisma.$transaction(async (tx) => {
    // Verifica se o fornecedor existe.
    const supplier = await tx.supplier.findUnique({
      where: {
        id: data.supplierId,
      },
    });

    if (!supplier) {
      throw new Error("Fornecedor não encontrado.");
    }

    let total = 0;

    const itemsData = [];

    for (const item of data.items) {
      // Verifica se o produto existe.
      const product = await tx.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      if (!product) {
        throw new Error(
          `Produto ${item.productId} não encontrado.`,
        );
      }

      const subtotal = item.quantity * item.unitCost;

      total += subtotal;

      itemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitCost: item.unitCost,
        subtotal,
      });
    }

    // Cria a compra como PENDING.
    // O estoque ainda NÃO será alterado.
    const purchase = await tx.purchase.create({
      data: {
        supplierId: data.supplierId,
        status: "PENDING",
        total,
        items: {
          create: itemsData,
        },
      },
      include: {
        supplier: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return purchase;
  });
}

export async function getPurchases() {
  return prisma.purchase.findMany({
    include: {
      supplier: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getPurchaseById(id: number) {
  return prisma.purchase.findUnique({
    where: {
      id,
    },
    include: {
      supplier: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  
}

export async function receivePurchase(id: number) {
  return prisma.$transaction(
    async (tx) => {
      const purchase = await tx.purchase.findUnique({
        where: {
          id,
        },
        include: {
          items: true,
        },
      });

      if (!purchase) {
        throw new Error("Compra não encontrada.");
      }

      if (purchase.status === "RECEIVED") {
        throw new Error("A compra já foi recebida.");
      }

      for (const item of purchase.items) {
        const product = await tx.product.findUnique({
          where: {
            id: item.productId,
          },
        });

        if (!product) {
          throw new Error(
            `Produto ${item.productId} não encontrado.`,
          );
        }

        const previousStock = product.stock;
        const newStock = previousStock + item.quantity;

        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: newStock,
          },
        });

        await tx.stockMovement.create({
          data: {
            type: "IN",
            quantity: item.quantity,
            previousStock,
            newStock,
            reason: `Recebimento da compra #${purchase.id}`,
            productId: item.productId,
          },
        });
      }

      return tx.purchase.update({
        where: {
          id,
        },
        data: {
          status: "RECEIVED",
        },
        include: {
          supplier: true,
          items: {
            include: {
              product: true,
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