import Decimal from "decimal.js";
import { CreateSubscriptionInput } from "../controllers/subscription-controller";
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
}
export default new SubscriptionService();
