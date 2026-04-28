import { Prisma } from "@prisma/client";
import {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
} from "../schemas/subscription.schema";
import { prisma } from "../prisma";

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
        amount: String(amount.toFixed(2)),
      })),
    };
  }
}
export default new SubscriptionService();
