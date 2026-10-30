
import { Request, Response, NextFunction } from "express";
import {
  openCashRegister,
  getCashRegisters,
  getCashRegisterById,
  closeCashRegister,
  CashRegisterServiceError,
  getCashRegisterReport,
} from "../services/cash-register.service.js";

export async function openCashRegisterController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const cashRegister = await openCashRegister(
      request.body.openingBalance,
    );

    return response.status(201).json(cashRegister);
  } catch (error) {
    if (error instanceof CashRegisterServiceError) {
      return response.status(error.statusCode).json({
        message: error.message,
      });
    }

    return next(error);
  }
}

export async function getCashRegistersController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const cashRegisters = await getCashRegisters();
    return response.json(cashRegisters);
  } catch (error) {
    return next(error);
  }
}

export async function getCashRegisterByIdController(
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

    const id = Number(idParam);

    if (!Number.isSafeInteger(id)) {
      return response.status(400).json({
        message: "O ID do caixa é inválido.",
      });
    }

    const cashRegister = await getCashRegisterById(id);

    if (!cashRegister) {
      return response.status(404).json({
        message: "Caixa não encontrado.",
      });
    }

    return response.json(cashRegister);
  } catch (error) {
    return next(error);
  }
}

export async function closeCashRegisterController(
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

    const id = Number(idParam);

    if (!Number.isSafeInteger(id)) {
      return response.status(400).json({
        message: "O ID do caixa é inválido.",
      });
    }

    const cashRegister = await closeCashRegister(
      id,
      request.body.closingBalance,
    );

    return response.json(cashRegister);
  } catch (error) {
    if (error instanceof CashRegisterServiceError) {
      return response.status(error.statusCode).json({
        message: error.message,
      });
    }

    return next(error);
  }
}

// Retorna o relatório financeiro do caixa.
export async function getCashRegisterReportController(
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

    const id = Number(idParam);

    if (!Number.isSafeInteger(id)) {
      return response.status(400).json({
        message: "O ID do caixa é inválido.",
      });
    }

    const report = await getCashRegisterReport(id);

    return response.json(report);
  } catch (error) {
    if (error instanceof CashRegisterServiceError) {
      return response.status(error.statusCode).json({
        message: error.message,
      });
    }

    return next(error);
  }
}