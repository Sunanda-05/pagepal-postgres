import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

const errorHandler: ErrorRequestHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Handle invalid JSON
  if (err instanceof SyntaxError && "body" in err) {
    console.log("Invalid JSON received");
    res.status(400).json({ error: "Invalid JSON format" });
    return Promise.resolve()
  }

  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal Server Error",
  });
  return Promise.resolve()
};

export default errorHandler;
