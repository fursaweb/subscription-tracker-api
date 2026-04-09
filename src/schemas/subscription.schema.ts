import * as z from "zod";
import { isNotPastDate } from "../utils/isNotPastDate";

const currency = ["UAH", "USD", "EUR"] as const;
const billingCycle = ["MONTHLY", "YEARLY"] as const;
const status = ["ACTIVE", "PAUSED", "CANCELLED"] as const;

const createSubscriptionSchema = z.object({
  name: z.string().trim().nonempty("Name is required").max(100),
  amount: z.number().gt(0, "Amount must be greater than 0"),
  currency: z.enum(currency),
  billingCycle: z.enum(billingCycle),
  nextBillingDate: z.coerce.date().refine((date) => isNotPastDate(date), {
    message: "Next billing date cannot be in the past",
  }),
});

const updateSubscriptionSchema = z.object({
  name: z.string().trim().nonempty("Name is required").max(100).optional(),
  amount: z.number().gt(0, "Amount must be greater than 0").optional(),
  currency: z.enum(currency).optional(),
  billingCycle: z.enum(billingCycle).optional(),
  status: z.enum(status).optional(),
  nextBillingDate: z.coerce
    .date()
    .refine((date) => isNotPastDate(date), {
      message: "Next billing date cannot be in the past",
    })
    .optional(),
});

const subscriptionIdSchema = z.object({ id: z.cuid() });

type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;

export {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  subscriptionIdSchema,
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
};
