import { z } from "zod";

export const createStockMovementSchema = z.object({
  productId: z
    .number()
    .int()
    .positive("O produto é obrigatório."),

  type: z.enum(
    ["IN", "OUT", "ADJUSTMENT"],
    {
      message: "Tipo de movimentação inválido.",
    },
  ),

  quantity: z
    .number()
    .int()
    .positive("A quantidade deve ser maior que zero."),

  reason: z
    .string()
    .trim()
    .min(3, "O motivo deve ter pelo menos 3 caracteres.")
    .optional(),
});