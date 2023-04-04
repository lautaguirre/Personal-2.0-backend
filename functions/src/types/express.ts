import { Request } from "express";

export type ProtectedRequest = Request<{ user: User; token: string }>;
