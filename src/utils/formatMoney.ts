import { Prisma } from "@prisma/client";

export const formatMoney = (amount: Prisma.Decimal) => {
  return String(amount.toFixed(2));
};
