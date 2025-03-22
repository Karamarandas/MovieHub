import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import moviesRouter from "./routes/moviesRouter.js";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth/", userRouter);
app.use("/api/movies/", moviesRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  return console.log(`Server running on port ${port}`);
});
