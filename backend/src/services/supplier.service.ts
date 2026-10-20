import prisma from "../lib/prisma.js";

export async function createSupplier(data: {
  name: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  return prisma.supplier.create({
    data: {
      name: data.name,
      cnpj: data.cnpj,
      email: data.email,
      phone: data.phone,
      address: data.address,
    },
  });
}

export async function getSuppliers() {
  return prisma.supplier.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function getSupplierById(id: number) {
  return prisma.supplier.findUnique({
    where: { id },
  });
}

export async function updateSupplier(
  id: number,
  data: {
    name?: string;
    cnpj?: string;
    email?: string;
    phone?: string;
    address?: string;
    active?: boolean;
  },
) {
  return prisma.supplier.update({
    where: { id },
    data,
  });
}

export async function deleteSupplier(id: number) {
  return prisma.supplier.delete({
    where: { id },
  });
}