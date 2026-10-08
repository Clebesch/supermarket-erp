import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "O nome do produto deve ter pelo menos 2 caracteres."),

  barcode: z
    .string()
    .min(8, "O código de barras deve ter pelo menos 8 caracteres."),

  description: z
    .string()
    .optional(),

  costPrice: z
    .number()
    .nonnegative("O preço de custo não pode ser negativo."),

  salePrice: z
    .number()
    .nonnegative("O preço de venda não pode ser negativo."),

  stock: z
    .number()
    .int()
    .nonnegative("O estoque não pode ser negativo.")
    .optional(),

  minStock: z
    .number()
    .int()
    .nonnegative("O estoque mínimo não pode ser negativo.")
    .optional(),

  categoryId: z
    .number()
    .int()
    .positive("A categoria é obrigatória."),
});

export const updateProductSchema = createProductSchema.partial().extend({
  active: z.boolean().optional(),
});