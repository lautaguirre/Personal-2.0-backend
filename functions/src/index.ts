import functions from "firebase-functions";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import usersRouter from "./routes/users";
import { adminRouter } from "./routes/admin";
import informationRouter from "./routes/information";

// Connect to DB
require("./db/mongoose");

const app = express();

// Express config
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Cors
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,PATCH,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers,Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization,x-access-token"
  );
  next();
});

// Routes
app.use("/users", usersRouter);
app.use("/admin", adminRouter);
app.use("/information", informationRouter);

export const api = functions.https.onRequest(app);
