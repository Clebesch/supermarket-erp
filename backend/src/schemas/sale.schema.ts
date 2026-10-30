import { z } from "zod";

// Valida cada item da venda.
const saleItemSchema = z.object({
  productId: z
    .number()
    .int()
    .positive("O produto deve ter um ID válido."),

  quantity: z
    .number()
    .int()
    .positive("A quantidade deve ser um inteiro positivo."),
});

// Valida a lista e impede que o mesmo produto seja repetido.
const saleItemsSchema = z
  .array(saleItemSchema)
  .min(1, "A venda deve possuir pelo menos um item.")
  .superRefine((items, context) => {
    const productIds = new Set<number>();

    items.forEach((item, index) => {
      if (productIds.has(item.productId)) {
        context.addIssue({
          code: "custom",
          path: [index, "productId"],
          message: "Não repita o mesmo produto nos itens da venda.",
        });
      }

      productIds.add(item.productId);
    });
  });

// Valida os dados recebidos para criar uma venda.
export const createSaleSchema = z.object({
  customerId: z
    .number()
    .int()
    .positive("O cliente deve ter um ID válido.")
    .optional(),

  items: saleItemsSchema,
});