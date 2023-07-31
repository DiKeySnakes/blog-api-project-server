import dotenv from 'dotenv';

dotenv.config();

import 'express-async-errors';
import express from 'express';
import errorHandler from 'strong-error-handler';

const app = express();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';

import mongoose from 'mongoose';

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI!);
  app.listen(process.env.PORT, () => {
    console.log('Connected to MongoDB');
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
}

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

// 404 page
app.use((req, res) => {
  res.status(404).json({ msg: 'Page Not Found' });
});

app.use(
  errorHandler({
    debug: app.get('env') === 'development',
    log: true,
  })
);
