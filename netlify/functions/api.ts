import express from "express";
import serverless from "serverless-http";
import apiRouter from "../../src/apiRouter.js";

const app = express();
app.use(express.json());

// Support the API router mounted at both standard and nested levels depending on how netlify routes it
app.use("/api", apiRouter);
app.use("/.netlify/functions/api", apiRouter);

export const handler = serverless(app);
