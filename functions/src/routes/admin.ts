import express, { Response, Request } from "express";
import { auth, isAdmin } from "../middleware/auth";
import User from "../models/user";

const router = express.Router();

// Admin Create User
router.post("/users", [auth, isAdmin], async (req: Request, res: Response) => {
  const user = new User(req.body);

  try {
    await user.save();

    const token = await user.generateAuthToken();

    return res.status(201).send({ user, token });
  } catch (e) {
    return res.status(500).send({ error: "Error creating user" });
  }
});

export const adminRouter = router;
