import { Response, Request } from "express";
import {
  createSubscriptionSchema,
  subscriptionIdSchema,
  updateSubscriptionSchema,
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

const updateSubscription = async (req: Request, res: Response) => {
  try {
    const paramsResult = subscriptionIdSchema.safeParse(req.params);
    const bodyResult = updateSubscriptionSchema.safeParse(req.body);

    if (!paramsResult.success) {
      const errors = paramsResult.error.issues.map((e) => e.message);

      console.warn("Update subscription failed", {
        route: `/subscriptions/${req.params.id}`,
        method: req.method,
        errors: errors,
      });
      return sendError(res, 400, "VALIDATION_ERROR", "Invalid input", errors);
    }

    if (!bodyResult.success) {
      const errors = bodyResult.error.issues.map((e) => e.message);

      console.warn("Update subscription failed", {
        route: `/subscriptions/${req.params.id}`,
        method: req.method,
        errors: errors,
      });
      return sendError(res, 400, "VALIDATION_ERROR", "Invalid input", errors);
    }

    if (Object.keys(req.body).length === 0) {
      console.warn("Empty body", {
        route: `/subscriptions/${req.params.id}`,
        method: req.method,
        errors: "The request body cannot be empty.",
      });
      return sendError(res, 400, "VALIDATION_ERROR", "Invalid input", [
        "The request body cannot be empty.",
      ]);
    }

    if (!req.userId) {
      return sendError(res, 401, "UNAUTHORIZED", "Unauthorized");
    }

    const subscription = await subscriptionService.updateSubscription(
      req.userId,
      paramsResult.data.id,
      bodyResult.data,
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

const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const result = subscriptionIdSchema.safeParse(req.params);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message);

      console.warn("Delete subscription failed", {
        route: `/subscriptions/${req.params.id}`,
        method: req.method,
        errors: errors,
      });
      return sendError(res, 400, "VALIDATION_ERROR", "Invalid input", errors);
    }

    if (!req.userId) {
      return sendError(res, 401, "UNAUTHORIZED", "Unauthorized");
    }

    const subscription = await subscriptionService.cancelSubscription(
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

const getMonthlySpend = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return sendError(res, 401, "UNAUTHORIZED", "Unauthorized");
    }

    const { totals } = await subscriptionService.getMonthlySpend(req.userId);

    return res.status(200).json({ totals });
  } catch (error) {
    console.error("Server failure", {
      route: "/subscriptions/monthly-spend",
      method: req.method,
      error,
    });
    return sendError(res, 500, "SERVER_ERROR", "Server error");
  }
};

export {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  cancelSubscription,
  getMonthlySpend,
};
