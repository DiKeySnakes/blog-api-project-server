import jwt, { VerifyErrors, Jwt, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization; // || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  interface IJWTPayload {
    UserInfo: {
      username: string;
      roles: [string];
    };
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!,
    (
      err: VerifyErrors | null,
      decoded: string | Jwt | JwtPayload | undefined
    ) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      const payload = decoded as IJWTPayload;

      req.user = payload.UserInfo.username;
      req.roles = payload.UserInfo.roles;
      next();
    }
  );
};

export default verifyJWT;
