import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres."),

  cpf: z
    .string()
    .trim()
    .min(11, "O CPF deve ter 11 caracteres.")
    .max(11, "O CPF deve ter 11 caracteres.")
    .regex(/^\d{11}$/, "O CPF deve conter apenas números.")
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

export const updateCustomerSchema =
  createCustomerSchema.partial().extend({
    active: z.boolean().optional(),
  });