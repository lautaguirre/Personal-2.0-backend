import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { ProtectedRequest } from "../types/express";
import User from "../models/user";

export const auth = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req?.header("Authorization")?.replace("Bearer ", "") ?? "";
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "");
    const user = await User.findOne({
      _id: typeof decoded === "string" ? decoded : decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error("Invalid user");
    }

    req.body.token = token;
    req.body.user = user;

    next();
  } catch (e) {
    res.status(401).send({ error: "Please Authenticate" });
  }
};

export const isAdmin = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.role !== "admin") {
      throw new Error();
    }

    next();
  } catch (e) {
    res.status(401).send({ error: "Access denied" });
  }
};
