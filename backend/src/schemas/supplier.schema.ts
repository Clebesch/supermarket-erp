import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres."),

  cnpj: z
    .string()
    .trim()
    .min(14, "O CNPJ deve ter 14 caracteres.")
    .max(14, "O CNPJ deve ter 14 caracteres.")
    .regex(/^\d{14}$/, "O CNPJ deve conter apenas números.")
    .optional(),

  email: z
    .string()
    .trim()
    .email("E-mail inválido.")
    .optional(),

  phone: z
    .string()
    .trim()
    .min(8, "O telefone deve ter pelo menos 8 caracteres.")
    .optional(),

  address: z
    .string()
    .trim()
    .optional(),
});

export const updateSupplierSchema =
  createSupplierSchema.partial().extend({
    active: z.boolean().optional(),
  });