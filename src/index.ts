import express from 'express';
import { testDbConnection } from './config/db';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins for simplicity; adjust as needed
    credentials: true, // Allow credentials if needed
}));

testDbConnection();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {    
    console.log(`Server is running on port ${PORT}`);
});