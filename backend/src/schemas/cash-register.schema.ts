
import { z } from "zod";

export const openCashRegisterSchema = z.object({
  openingBalance: z
    .number()
    .finite("O saldo inicial deve ser um número válido.")
    .min(0, "O saldo inicial não pode ser negativo.")
    .max(9_999_999_999.99, "O saldo inicial ultrapassa o limite permitido."),
});

export const closeCashRegisterSchema = z.object({
  closingBalance: z
    .number()
    .finite("O saldo de fechamento deve ser um número válido.")
    .min(0, "O saldo de fechamento não pode ser negativo.")
    .max(9_999_999_999.99, "O saldo de fechamento ultrapassa o limite permitido."),
});
