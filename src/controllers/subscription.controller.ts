import { Response, Request } from "express";
import {
  createSubscriptionSchema,
  subscriptionIdSchema,
} from "../schemas/subscription.schema";
import subscriptionService from "../services/subscription.service";
import { UnauthorizedError } from "../errors/auth.errors";
import { sendError } from "../utils/sendError";

const createSubscription = async (req: Request, res: Response) => {
  try {
    const result = createSubscriptionSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message);

      console.warn("Create subscription validation failed", {
        route: "/subscriptions",
        method: req.method,
        errors: result.error.issues.map((e) => e.message),
      });
      return sendError(res, 400, "VALIDATION_ERROR", "Invalid input", errors);
    }

    if (!req.userId) {
      return sendError(res, 401, "UNAUTHORIZED", "Unauthorized");
    }

    const subscription = await subscriptionService.createSubscription(
      req.userId,
      result.data,
    );

    return res.status(201).json(subscription);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return sendError(res, 401, "UNAUTHORIZED", error.message);
    }

    console.error("Create subscription failed", {
      route: "/subscriptions",
      method: req.method,
      error,
    });

    return sendError(res, 500, "SERVER_ERROR", "Server error");
  }
};

const getSubscriptions = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return sendError(res, 401, "UNAUTHORIZED", "Unauthorized");
    }

    const subscriptions = await subscriptionService.getSubscriptions(
      req.userId,
    );
    return res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Get subscriptions failed", {
      route: "/subscriptions",
      method: req.method,
      error,
    });
    return sendError(res, 500, "SERVER_ERROR", "Server error");
  }
};

const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    const result = subscriptionIdSchema.safeParse(req.params);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message);

      console.warn("Get subscription failed", {
        route: `/subscriptions/${req.params.id}`,
        method: req.method,
        errors: result.error.issues.map((e) => e.message),
      });
      return sendError(res, 400, "VALIDATION_ERROR", "Invalid input", errors);
    }

    if (!req.userId) {
      return sendError(res, 401, "UNAUTHORIZED", "Unauthorized");
    }

    const subscription = await subscriptionService.getSubscriptionById(
      req.userId,
      result.data.id,
    );

    if (!subscription) {
      return sendError(res, 404, "NOT_FOUND", "Subscription not found");
    }

    return res.status(200).json(subscription);
  } catch (error) {
    console.error("Server failure", {
      route: `/subscriptions/${req.params.id}`,
      method: req.method,
      error,
    });
    return sendError(res, 500, "SERVER_ERROR", "Server error");
  }
};

export { createSubscription, getSubscriptions, getSubscriptionById };
