
import { z } from "zod";

export const createCashMovementSchema = z.object({
  type: z.enum(["IN", "OUT", "SALE"], {
    message: "O tipo deve ser IN (entrada), OUT (saída) ou SALE (venda).",
  }),

  amount: z
    .number()
    .finite("O valor deve ser um número válido.")
    .positive("O valor deve ser maior que zero.")
    .max(9_999_999_999.99, "O valor ultrapassa o limite permitido."),

  reason: z
    .string()
    .trim()
    .max(255, "O motivo deve ter no máximo 255 caracteres.")
    .optional(),
});
