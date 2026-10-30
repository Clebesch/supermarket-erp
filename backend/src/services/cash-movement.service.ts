
import prisma from "../lib/prisma.js";

export class CashMovementServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "CashMovementServiceError";
    this.statusCode = statusCode;
  }
}

interface CreateCashMovementData {
  type: "IN" | "OUT" | "SALE";
  amount: number;
  reason?: string;
}

export async function createCashMovement(
  cashRegisterId: number,
  data: CreateCashMovementData,
) {
  if (!Number.isSafeInteger(cashRegisterId) || cashRegisterId <= 0) {
    throw new CashMovementServiceError("ID do caixa inválido.");
  }

  if (!Number.isFinite(data.amount) || data.amount <= 0) {
    throw new CashMovementServiceError("O valor deve ser maior que zero.");
  }

  if (
    data.type !== "IN" && 
	data.type !== "OUT" &&
	data.type !== "SALE"
	) {
    throw new CashMovementServiceError(
	"O tipo deve ser IN, OUT ou SALE.",
	400
	);
  }

  const amountCents = Math.round(data.amount * 100);

  if (
    !Number.isSafeInteger(amountCents) ||
    amountCents <= 0 ||
    amountCents > 999_999_999_999
  ) {
    throw new CashMovementServiceError("O valor da movimentação é inválido.");
  }

  return prisma.$transaction(async (tx) => {
    // Bloqueia o caixa durante a operação para evitar movimentações
    // simultâneas com o fechamento.
    const registers = await tx.$queryRaw<{ id: number }[]>`
      SELECT id FROM "CashRegister" WHERE id = ${cashRegisterId} FOR UPDATE
    `;

    if (registers.length === 0) {
      throw new CashMovementServiceError("Caixa não encontrado.", 404);
    }

    const cashRegister = await tx.cashRegister.findUnique({
      where: { id: cashRegisterId },
    });

    if (!cashRegister) {
      throw new CashMovementServiceError("Caixa não encontrado.", 404);
    }

    if (cashRegister.status !== "OPEN") {
      throw new CashMovementServiceError(
        "Não é possível movimentar um caixa fechado.",
        409,
      );
    }

    return tx.cashMovement.create({
      data: {
        type: data.type,
        amount: amountCents / 100,
        reason: data.reason?.trim() || null,
        cashRegisterId,
      },
    });
  }, { maxWait: 10000, timeout: 20000 });
}

export async function getCashMovements(cashRegisterId: number) {
  if (!Number.isSafeInteger(cashRegisterId) || cashRegisterId <= 0) {
    throw new CashMovementServiceError("ID do caixa inválido.");
  }

  const cashRegister = await prisma.cashRegister.findUnique({
    where: { id: cashRegisterId },
    select: { id: true },
  });

  if (!cashRegister) {
    throw new CashMovementServiceError("Caixa não encontrado.", 404);
  }

  return prisma.cashMovement.findMany({
    where: { cashRegisterId },
    orderBy: { createdAt: "desc" },
  });
}
