import { Response, Request } from "express";
import * as z from "zod";
import { isNotPastDate } from "../helpers";
import subscriptionService from "../services/subscription-service";
import { UnauthorizedError } from "../errors/auth-errors";

const currency = ["UAH", "USD", "EUR"] as const;
const billingCycle = ["MONTHLY", "YEARLY"] as const;

const createSubscriptionSchema = z.object({
  name: z.string().trim().nonempty("Name is required").max(100),
  amount: z.number().gt(0, "Amount must be greater than 0"),
  currency: z.enum(currency),
  billingCycle: z.enum(billingCycle),
  nextBillingDate: z.coerce.date().refine((date) => isNotPastDate(date), {
    message: "Next billing date cannot be in the past",
  }),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;

const createSubscription = async (req: Request, res: Response) => {
  try {
    const result = createSubscriptionSchema.safeParse(req.body);

    if (!result.success) {
      console.warn("Create subscription validation failed", {
        route: "/subscriptions",
        method: req.method,
        errors: result.error.issues.map((e) => e.message),
      });
      return res
        .status(400)
        .json({ error: result.error.issues.map((e) => e.message) });
    }

    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const subscription = await subscriptionService.createSubscription(
      req.userId,
      result.data,
    );

    return res.status(201).json(subscription);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ error: error.message });
    }

    console.error("Create subscription failed", {
      route: "/subscriptions",
      method: req.method,
      error,
    });

    return res.status(500).json({ error: "Server error" });
  }
};

export { createSubscription };
