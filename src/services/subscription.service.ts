import Decimal from "decimal.js";
import { CreateSubscriptionInput } from "../schemas/subscription.schema";
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
}
export default new SubscriptionService();
