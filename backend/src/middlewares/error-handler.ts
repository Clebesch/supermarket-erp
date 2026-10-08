import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client.js";

export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  console.error(error);

  if (
    error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return response.status(409).json({
        message: "Já existe um registro com esse valor.",
      });
    }

    if (error.code === "P2025") {
      return response.status(404).json({
        message: "Registro não encontrado.",
      });
    }
  }

  return response.status(500).json({
    message: "Erro interno do servidor.",
  });
}