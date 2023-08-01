export {};

declare global {
  namespace Express {
    export interface Request {
      idUser?: string;
      email?: string;
      username?: string;
      user?: string;
      roles?: [string];
      // extra variables you want to use in req object
    }
  }
}
