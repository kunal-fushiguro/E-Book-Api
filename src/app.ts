import e, { NextFunction, Request, Response } from "express";
import { ApiResponse } from "./utils/ApiResponse";
import cors from "cors";
import cookieParser from "cookie-parser";
import { routes } from "./routes";

const app = e();

app.use(cors({ origin: "*", credentials: true }));
app.use(e.json({ limit: "25kb" }));
app.use(e.urlencoded({ extended: true, limit: "25kb" }));
app.use(cookieParser());

// home route
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json(new ApiResponse(200, "Ok", true, {}));
});

// routes
app.use("/api/v1", routes);

// Global error handle
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  return ApiResponse.errorHandler(res, err);
});

export { app };
