import Decimal from "decimal.js";
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
    const decimalAmount = new Decimal(subscriptionData.amount);

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        name: subscriptionData.name,
        amount: decimalAmount,
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
}
export default new SubscriptionService();
