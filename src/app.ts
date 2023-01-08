import path from 'path';
import express from 'express';
import mongoose, { Error } from 'mongoose';
import { MongoClient } from 'mongodb';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import router from './routes/users';
import user from './models/user';
import { Request, Response, NextFunction } from 'express';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth'
import { requestLogger, errorLogger } from './middlewares/logger';

require('dotenv').config();

console.log(process.env.NODE_ENV);

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

mongoose
.connect('mongodb://localhost:27017/mestodb')
.then(() => console.log('DB ok'))
.catch((err) => console.log('DB error', err))

app.use(requestLogger);

app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);
app.use('/users', usersRouter)
app.use('/cards', cardsRouter)

app.use(errorLogger)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: 'На сервере произошла ошибка' });
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
    console.log(BASE_PATH);
})