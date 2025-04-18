import { Response, Request, NextFunction } from "express";
import { User } from "../../generated"; //!
import { AsyncLocalStorage } from "node:async_hooks";

interface RequestContextStore {
  user?: User;
  ip?: string;
  userAgent?: string;
}

export const asyncLocalStorage = new AsyncLocalStorage<RequestContextStore>();
export function setUserContext(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as any).user as User | undefined;
  asyncLocalStorage.run(
    {
      user: user,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    },
    () => next()
  );
}

export function getCurrentUser() {
  return asyncLocalStorage.getStore();
}
