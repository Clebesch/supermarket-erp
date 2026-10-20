import prisma from "../lib/prisma.js";

export async function createCustomer(data: {
  name: string;
  cpf?: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  return prisma.customer.create({
    data: {
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      phone: data.phone,
      address: data.address,
    },
  });
}

export async function getCustomers() {
  return prisma.customer.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function getCustomerById(id: number) {
  return prisma.customer.findUnique({
    where: {
      id,
    },
  });
}

export async function updateCustomer(
  id: number,
  data: {
    name?: string;
    cpf?: string;
    email?: string;
    phone?: string;
    address?: string;
    active?: boolean;
  },
) {
  return prisma.customer.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteCustomer(id: number) {
  return prisma.customer.delete({
    where: {
      id,
    },
  });
}