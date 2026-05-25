import express from "express";
import { checkRole, verifyToken } from "../middleware/authMiddleware.js";
import sendResponse from "../utils/apiResponse.js";

const router = express.Router();

router.post(
  "/raise-question",
  verifyToken,
  checkRole("USER", "RESOLVER", "ADMIN"),
  (req, res, next) => {
    if (typeof req.app.locals.raiseQuestionHandler === "function") {
      return req.app.locals.raiseQuestionHandler(req, res, next);
    }

    return sendResponse(res, 200, true, "Question access authorized", {
      user: req.user,
    });
  }
);

router.post(
  "/resolve",
  verifyToken,
  checkRole("RESOLVER", "ADMIN"),
  (req, res, next) => {
    if (typeof req.app.locals.resolveHandler === "function") {
      return req.app.locals.resolveHandler(req, res, next);
    }

    return sendResponse(res, 200, true, "Resolve access authorized", {
      user: req.user,
    });
  }
);

router.post(
  "/admin/approve",
  verifyToken,
  checkRole("ADMIN"),
  (req, res, next) => {
    if (typeof req.app.locals.adminApproveHandler === "function") {
      return req.app.locals.adminApproveHandler(req, res, next);
    }

    return sendResponse(res, 200, true, "Admin approval access authorized", {
      user: req.user,
    });
  }
);

export default router;
