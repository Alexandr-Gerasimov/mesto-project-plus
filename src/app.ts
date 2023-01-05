import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import router from './routes/users';
import user from './models/user';
import { Request, Response } from 'express';

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '63b6f4a2c3e0bb0a2e5132f4' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

mongoose
.connect('mongodb://localhost:27017/mestodb')
.then(() => console.log('DB ok'))
.catch((err) => console.log('DB error', err))



app.use('/users', usersRouter)

app.use('/cards', cardsRouter)



app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
    console.log(BASE_PATH);
})