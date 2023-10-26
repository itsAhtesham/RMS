import * as express from "express";
export {};
declare global {
  namespace Express {
    interface Request {
      id?: number;
      role?: string;
      sessionID: string;
    }
  }
}
