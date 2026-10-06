import prisma from "../lib/prisma.js";

export async function createProduct(data: {
  name: string;
  barcode: string;
  description?: string;
  costPrice: number;
  salePrice: number;
  stock?: number;
  minStock?: number;
  categoryId: number;
}) {
  return prisma.product.create({
    data: {
      name: data.name,
      barcode: data.barcode,
      description: data.description,
      costPrice: data.costPrice,
      salePrice: data.salePrice,
      stock: data.stock ?? 0,
      minStock: data.minStock ?? 0,
      categoryId: data.categoryId,
    },
    include: {
      category: true,
    },
  });
}

export async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });
}

export async function updateProduct(
  id: number,
  data: {
    name?: string;
    barcode?: string;
    description?: string;
    costPrice?: number;
    salePrice?: number;
    stock?: number;
    minStock?: number;
    active?: boolean;
    categoryId?: number;
  },
) {
  return prisma.product.update({
    where: {
      id,
    },
    data,
    include: {
      category: true,
    },
  });
}

export async function deleteProduct(id: number) {
  return prisma.product.delete({
    where: {
      id,
    },
  });
}