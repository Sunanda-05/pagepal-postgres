import type { Author, User } from "../generated";

declare global {
  namespace Express {
    interface Request {
      user?: User & { author?: Author | null };
    }
  }
}

export {};
