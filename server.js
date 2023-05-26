import mongoose from 'mongoose';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';

const privateKey = fs.readFileSync('./certificates/server.key', 'utf8');
const certificate = fs.readFileSync('./certificates/server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
import app from './app.js';

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

dbConnect().catch((err) => {
  console.log(err);
  process.exit(1);
});

async function dbConnect() {
  mongoose.set('strictQuery', false);
  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  console.log('DB connection successful!');
}

const port = process.env.PORT || 3000;
const server = https.createServer(credentials, app);
const listener = server.listen(port, () => {
  console.log(`App running on port ${listener.address().port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated!');
  });
});
