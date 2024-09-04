import e, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { ApiResponse } from "./utils/ApiResponse";

const app = e();

// home route

app.get("/", (req: Request, res: Response) => {
  const error = createHttpError(500, "something went wrong");
  return ApiResponse.errorHandler(res, error);
});

// Global error handle
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, _next: NextFunction) => {
  return ApiResponse.errorHandler(res, err);
});

export { app };
