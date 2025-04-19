import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv"

import helmetConfig from "./config/helmentConfig";
import corsConfig from "./config/corsConfig";
import rateLimitHandler from "./middlewares/rateLimitHandler";
import errorHandler from "./middlewares/errorHandler";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";
import collectionRoutes from "./routes/collectionRoutes";
import tagRoutes from "./routes/tagRoutes";
import adminApplicationRoutes from "./routes/adminApplicationRoutes";
import authorApplicationRoutes from "./routes/authorApplicationRoutes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(cookieParser());
app.use(morgan("common"));
dotenv.config();

app.use(helmetConfig);
app.use(rateLimitHandler);
// app.use(csrfMiddleware);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/books", bookRoutes);
app.use("/collection", collectionRoutes);
app.use("/tag", tagRoutes);
app.use("/admin", adminApplicationRoutes);
app.use("/author", authorApplicationRoutes);


app.use(errorHandler);
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
