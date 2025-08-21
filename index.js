import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import teamRouter from './routes/teamRouter.js';
import adsRouter from './routes/userAdsRouter.js';
import manageAdsRouter from './routes/manageAdsRouter.js';
import createUsersTable from './database/createTable.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/team', teamRouter);
app.use('/api/users', userRouter);

app.use('/api/ads', adsRouter);
app.use('/api/users', userRouter);
app.use('/api/manage-ads', manageAdsRouter);

createUsersTable(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
