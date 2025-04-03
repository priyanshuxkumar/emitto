import { Prisma } from "@repo/db";
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { ZodError } from "zod";
import { HTTP_RESPONSE_CODE } from "../constants/constant";
import { ApiError } from "../utils/ApiError";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`Error occurred: ${req.method} ${req.path}`, err);

  if (err instanceof ApiError) {
    res
      .status(err.statusCode)
      .json({ success: err.success, message: err.message });
    return;
  } 
  else if (err instanceof Error) {
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ success: false, message: err.message });
    return;
  } 
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res
        .status(HTTP_RESPONSE_CODE.NOT_FOUND)
        .json({ success: false, message: "Data not found" });
      return;
    }
    res.status(HTTP_RESPONSE_CODE.SERVER_ERROR).json({
      success: false,
      message: "Database error",
    });
    return;
  } 
  else if (err instanceof ZodError) {
    res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({
      success: false,
      message: err?.issues[0]?.message || "Invalid input",
    });
    return;
  } 
  else if (err instanceof JsonWebTokenError) {
    res
      .status(HTTP_RESPONSE_CODE.UNAUTHORIZED)
      .json({ success: false, message: "Unauthorized access" });
    return;
  } 
  else {
    res
      .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
      .json({ success: false, message: "Something went wrong" });
  }
};
