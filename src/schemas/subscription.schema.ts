import * as z from "zod";
import { isNotPastDate } from "../utils/isNotPastDate";

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

type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;

export { createSubscriptionSchema, CreateSubscriptionInput };
