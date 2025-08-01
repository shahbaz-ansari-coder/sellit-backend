import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import createUsersTable from './database/createTable.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

createUsersTable(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
