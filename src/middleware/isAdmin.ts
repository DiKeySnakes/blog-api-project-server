import { Request, Response, NextFunction } from 'express';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const roles = req.roles;
  if (!roles?.includes('Admin')) {
    return res.status(403).json({ message: 'Forbidden' });
  } else {
    next();
  }
};
export default isAdmin;
