import { Request, Response } from "express";

import {
  createPurchase,
  getPurchases,
  getPurchaseById,
  receivePurchase,
} from "../services/purchase.service.js";

export async function createPurchaseController(
  request: Request,
  response: Response,
) {
  try {
    const purchase = await createPurchase(request.body);

    return response.status(201).json(purchase);
  } catch (error) {
    throw error;
  }
}

export async function getPurchasesController(
  request: Request,
  response: Response,
) {
  try {
    const purchases = await getPurchases();

    return response.json(purchases);
  } catch (error) {
    throw error;
  }
}

export async function getPurchaseByIdController(
  request: Request,
  response: Response,
) {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      return response.status(400).json({
        message: "ID da compra inválido.",
      });
    }

    const purchase = await getPurchaseById(id);

    if (!purchase) {
      return response.status(404).json({
        message: "Compra não encontrada.",
      });
    }

    return response.json(purchase);
  } catch (error) {
    throw error;
  }
}

export async function receivePurchaseController(
  request: Request,
  response: Response,
) {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      return response.status(400).json({
        message: "ID da compra inválido.",
      });
    }

    const purchase = await receivePurchase(id);

    return response.json(purchase);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Compra não encontrada." ||
        error.message === "A compra já foi recebida."
      ) {
        return response.status(400).json({
          message: error.message,
        });
      }
    }

    throw error;
  }
}