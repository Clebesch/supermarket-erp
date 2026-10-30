
import { Request, Response, NextFunction } from "express";
import {
  createCashMovement,
  getCashMovements,
  CashMovementServiceError,
} from "../services/cash-movement.service.js";

export async function createCashMovementController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const idParam = request.params.id;

    if (
      typeof idParam !== "string" ||
      !/^[1-9]\d*$/.test(idParam)
    ) {
      return response.status(400).json({
        message: "O ID do caixa deve ser um inteiro positivo.",
      });
    }

    const cashRegisterId = Number(idParam);

    if (!Number.isSafeInteger(cashRegisterId)) {
      return response.status(400).json({
        message: "O ID do caixa é inválido.",
      });
    }

    const movement = await createCashMovement(cashRegisterId, {
      type: request.body.type,
      amount: request.body.amount,
      reason: request.body.reason,
    });

    return response.status(201).json(movement);
  } catch (error) {
    if (error instanceof CashMovementServiceError) {
      return response.status(error.statusCode).json({
        message: error.message,
      });
    }

    return next(error);
  }
}

export async function getCashMovementsController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const idParam = request.params.id;

    if (
      typeof idParam !== "string" ||
      !/^[1-9]\d*$/.test(idParam)
    ) {
      return response.status(400).json({
        message: "O ID do caixa deve ser um inteiro positivo.",
      });
    }

    const cashRegisterId = Number(idParam);

    if (!Number.isSafeInteger(cashRegisterId)) {
      return response.status(400).json({
        message: "O ID do caixa é inválido.",
      });
    }

    const movements = await getCashMovements(cashRegisterId);
    return response.json(movements);
  } catch (error) {
    if (error instanceof CashMovementServiceError) {
      return response.status(error.statusCode).json({
        message: error.message,
      });
    }

    return next(error);
  }
}
