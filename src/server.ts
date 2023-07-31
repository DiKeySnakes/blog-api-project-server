import dotenv from 'dotenv';

dotenv.config();

import 'express-async-errors';
import express, { Express, Request, Response } from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import errorHandler from 'strong-error-handler';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';

import mongoose from 'mongoose';

const app: Express = express();

// Set up rate limiter: maximum of twenty requests per minute
import RateLimit from 'express-rate-limit';
const limiter = RateLimit({
  windowMs: 1 * 10 * 1000, // 10 seconds
  max: 10,
});
// Apply rate limiter to all requests
app.use(limiter);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI!);
  app.listen(process.env.PORT, () => {
    console.log('Connected to MongoDB');
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
}

app.use(morgan('dev'));

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'script-src': ["'self'", 'code.jquery.com', 'cdn.jsdelivr.net'],
    },
  })
);

app.use(compression()); // Compress all routes

// 404 page
app.use((req: Request, res: Response) => {
  res.status(404).json({ msg: 'Page Not Found' });
});

app.use(
  errorHandler({
    debug: app.get('env') === 'development',
    log: true,
  })
);
