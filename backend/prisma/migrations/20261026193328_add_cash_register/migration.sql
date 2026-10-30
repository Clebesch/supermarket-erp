-- CreateTable
CREATE TABLE "CashRegister" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "openingBalance" DECIMAL(10,2) NOT NULL,
    "closingBalance" DECIMAL(10,2),
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "CashRegister_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashMovement" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cashRegisterId" INTEGER NOT NULL,

    CONSTRAINT "CashMovement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CashMovement" ADD CONSTRAINT "CashMovement_cashRegisterId_fkey" FOREIGN KEY ("cashRegisterId") REFERENCES "CashRegister"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
