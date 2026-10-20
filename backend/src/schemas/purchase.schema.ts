import { z } from "zod";

const purchaseItemSchema = z.object({
  productId: z
    .number()
    .int()
    .positive("O produto é obrigatório."),

  quantity: z
    .number()
    .int()
    .positive("A quantidade deve ser maior que zero."),

  unitCost: z
    .number()
    .nonnegative("O custo unitário não pode ser negativo."),
});

export const createPurchaseSchema = z.object({
  supplierId: z
    .number()
    .int()
    .positive("O fornecedor é obrigatório."),

  items: z
    .array(purchaseItemSchema)
    .min(1, "A compra deve possuir pelo menos um item."),
});

export const updatePurchaseSchema = z.object({
  status: z.enum(["PENDING", "RECEIVED"], {
    message: "Status da compra inválido.",
  }),
});