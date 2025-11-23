import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (req: Request, _: Response, next: NextFunction) => {
    // Log the incoming request
    logger.request(req);
    next();
};
