import { Prisma } from "@prisma/client";
import {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
} from "../schemas/subscription.schema";
import { prisma } from "../prisma";
import { formatMoney } from "../utils/formatMoney";

class SubscriptionService {
  async createSubscription(
    userId: string,
    subscriptionData: CreateSubscriptionInput,
  ) {
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        name: subscriptionData.name,
        amount: new Prisma.Decimal(subscriptionData.amount),
        currency: subscriptionData.currency,
        billingCycle: subscriptionData.billingCycle,
        nextBillingDate: subscriptionData.nextBillingDate,
      },
    });

    return subscription;
  }

  async getSubscriptions(userId: string) {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId,
        NOT: {
          status: "CANCELLED",
        },
      },
      orderBy: {
        nextBillingDate: "asc",
      },
    });

    return subscriptions;
  }

  async getSubscriptionById(userId: string, id: string) {
    const subscription = await prisma.subscription.findFirst({
      where: {
        id,
        userId,
      },
    });

    return subscription;
  }

  async updateSubscription(
    userId: string,
    id: string,
    subscriptionData: UpdateSubscriptionInput,
  ) {
    const exists = await prisma.subscription.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!exists) {
      return null;
    }

    const subscription = await prisma.subscription.update({
      where: {
        id,
      },
      data: subscriptionData,
    });

    return subscription;
  }

  async cancelSubscription(userId: string, id: string) {
    const exists = await prisma.subscription.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!exists) {
      return null;
    }

    const subscription = await prisma.subscription.update({
      where: {
        id,
      },
      data: {
        status: "CANCELLED",
      },
    });

    return subscription;
  }

  async getMonthlySpend(userId: string) {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId,
        status: "ACTIVE",
      },
      select: {
        billingCycle: true,
        amount: true,
        currency: true,
      },
    });

    const map = new Map<string, Prisma.Decimal>();

    for (const subscription of subscriptions) {
      const monthlyAmount =
        subscription.billingCycle === "YEARLY"
          ? subscription.amount.div(12)
          : subscription.amount;

      const current = map.get(subscription.currency) ?? new Prisma.Decimal(0);

      map.set(subscription.currency, current.plus(monthlyAmount));
    }

    return {
      totals: Array.from(map, ([currency, amount]) => ({
        currency,
        amount: formatMoney(amount),
      })),
    };
  }

  async getUpcomingRenewals(userId: string) {
    const UPCOMING_RENEWALS_DAYS = 7;

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);
    endDate.setDate(endDate.getDate() + UPCOMING_RENEWALS_DAYS);

    const renewals = await prisma.subscription.findMany({
      where: {
        userId,
        status: "ACTIVE",
        nextBillingDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        name: true,
        amount: true,
        currency: true,
        nextBillingDate: true,
        billingCycle: true,
      },
      orderBy: {
        nextBillingDate: "asc",
      },
    });

    const formattedRenewals = renewals.map((renewal) => ({
      ...renewal,
      amount: formatMoney(renewal.amount),
    }));

    return { renewals: formattedRenewals };
  }
}
export default new SubscriptionService();
