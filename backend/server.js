import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import urlRoutes from './routes/url.js';
dotenv.config();

const app = express();

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/", urlRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});