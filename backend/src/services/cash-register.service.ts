
import prisma from "../lib/prisma.js";

export class CashRegisterServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "CashRegisterServiceError";
    this.statusCode = statusCode;
  }
}

// Abre um novo caixa com o saldo inicial informado.
export async function openCashRegister(openingBalance: number) {
  if (!Number.isFinite(openingBalance) || openingBalance < 0) {
    throw new CashRegisterServiceError(
      "O saldo inicial deve ser um valor válido e não negativo.",
    );
  }

  const openingBalanceCents = Math.round(openingBalance * 100);

  if (
    !Number.isSafeInteger(openingBalanceCents) ||
    openingBalanceCents > 999_999_999_999
  ) {
    throw new CashRegisterServiceError("O saldo inicial ultrapassa o limite permitido.");
  }

  return prisma.$transaction(async (tx) => {
    // Impede duas aberturas simultâneas de caixas.
    await tx.$queryRaw`SELECT id FROM "CashRegister" FOR UPDATE`;

    const openRegister = await tx.cashRegister.findFirst({
      where: { status: "OPEN" },
    });

    if (openRegister) {
      throw new CashRegisterServiceError(
        "Já existe um caixa aberto. Feche-o antes de abrir outro.",
        409,
      );
    }

    return tx.cashRegister.create({
      data: {
        status: "OPEN",
        openingBalance: openingBalanceCents / 100,
      },
    });
  });
}

// Lista os caixas mais recentes primeiro.
export async function getCashRegisters() {
  return prisma.cashRegister.findMany({
    include: {
      movements: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { openedAt: "desc" },
  });
}

// Consulta um caixa pelo ID.
export async function getCashRegisterById(id: number) {
  return prisma.cashRegister.findUnique({
    where: { id },
    include: {
      movements: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}


 // Fecha o caixa, calcula o saldo esperado e informa a diferença.
export async function closeCashRegister(id: number, closingBalance: number) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new CashRegisterServiceError("ID do caixa inválido.");
  }

  if (!Number.isFinite(closingBalance) || closingBalance < 0) {
    throw new CashRegisterServiceError(
      "O saldo de fechamento deve ser um valor válido e não negativo.",
    );
  }

  const closingBalanceCents = Math.round(closingBalance * 100);

  if (
    !Number.isSafeInteger(closingBalanceCents) ||
    closingBalanceCents > 999_999_999_999
  ) {
    throw new CashRegisterServiceError(
      "O saldo de fechamento ultrapassa o limite permitido.",
    );
  }

  return prisma.$transaction(
    async (tx) => {
      const registers = await tx.$queryRaw<{ id: number }[]>`
        SELECT id FROM "CashRegister" WHERE id = ${id} FOR UPDATE
      `;

      if (registers.length === 0) {
        throw new CashRegisterServiceError("Caixa não encontrado.", 404);
      }

      const register = await tx.cashRegister.findUnique({
        where: { id },
        include: { movements: true },
      });

      if (!register) {
        throw new CashRegisterServiceError("Caixa não encontrado.", 404);
      }

      if (register.status !== "OPEN") {
        throw new CashRegisterServiceError(
          "Este caixa já está fechado.",
          409,
        );
      }

      const openingCents = Math.round(
        register.openingBalance.toNumber() * 100,
      );

      let expectedCents = openingCents;

      for (const movement of register.movements) {
        const amountCents = Math.round(
          movement.amount.toNumber() * 100,
        );

        if (movement.type === "IN" || movement.type === "SALE") {
          expectedCents += amountCents;
        } else if (movement.type === "OUT") {
          expectedCents -= amountCents;
        }
      }

      if (expectedCents < 0) {
        throw new CashRegisterServiceError(
          "O saldo esperado do caixa não pode ser negativo.",
        );
      }

      const differenceCents = closingBalanceCents - expectedCents;

      const closedRegister = await tx.cashRegister.update({
        where: { id },
        data: {
          status: "CLOSED",
          closingBalance: closingBalanceCents / 100,
          closedAt: new Date(),
        },
      });

      return {
        ...closedRegister,
        expectedBalance: expectedCents / 100,
        difference: differenceCents / 100,
      };
    },
    { maxWait: 10000, timeout: 20000 },
  );
}

// Gera um resumo financeiro do caixa.
export async function getCashRegisterReport(id: number) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new CashRegisterServiceError("ID do caixa inválido.");
  }

  const register = await prisma.cashRegister.findUnique({
    where: { id },
    include: {
      movements: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!register) {
    throw new CashRegisterServiceError("Caixa não encontrado.", 404);
  }

  let totalInCents = 0;
  let totalOutCents = 0;
  let totalSalesCents = 0;

  for (const movement of register.movements) {
    const amountCents = Math.round(
      movement.amount.toNumber() * 100,
    );

    if (movement.type === "IN") {
      totalInCents += amountCents;
    }

    if (movement.type === "OUT") {
      totalOutCents += amountCents;
    }

    if (movement.type === "SALE") {
      totalSalesCents += amountCents;
    }
  }

  const openingBalanceCents = Math.round(
    register.openingBalance.toNumber() * 100,
  );

  const expectedBalanceCents =
    openingBalanceCents +
    totalInCents +
    totalSalesCents -
    totalOutCents;

  const closingBalanceCents = register.closingBalance
    ? Math.round(register.closingBalance.toNumber() * 100)
    : null;

  const differenceCents =
    closingBalanceCents !== null
      ? closingBalanceCents - expectedBalanceCents
      : null;

  return {
    cashRegister: {
      id: register.id,
      status: register.status,
      openedAt: register.openedAt,
      closedAt: register.closedAt,
    },

    balances: {
      openingBalance: openingBalanceCents / 100,
      expectedBalance: expectedBalanceCents / 100,
      closingBalance:
        closingBalanceCents !== null
          ? closingBalanceCents / 100
          : null,
      difference:
        differenceCents !== null
          ? differenceCents / 100
          : null,
    },

    totals: {
      entries: totalInCents / 100,
      sales: totalSalesCents / 100,
      withdrawals: totalOutCents / 100,
    },

    movements: register.movements,
  };
}