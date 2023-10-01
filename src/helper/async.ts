import { Request, Response, NextFunction } from 'express';

export type AsyncRoute = (req: Request, res: Response) => Promise<any>;
export type ExpressRoute = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

/**
 * Transform an async route to a express route
 * @param middleware
 * @returns
 */
export function wrapAsyncRoute(fn: AsyncRoute): ExpressRoute {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).then(
      (returnValue: any) => {
        if (res.headersSent) {
          next();
        }
        res.json(returnValue);
      },
      (err) => {
        const errStr = err.toString();

        next(errStr);
      },
    );
  };
}
