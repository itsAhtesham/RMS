import express, { Express, Request, Response } from "express";
import rms from "./routes/rmsRoutes";
import user from "./routes/userRoutes";
import { auth } from "./middlewares/auth";

const app: Express = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", function (req: Request, res: Response) {
  res.status(200).send(`Welcome to RMS assignment`);
});

app.use("/api/user", user);
app.use(auth);
app.use("/api/rms", rms);

app.listen(3000, () => {
  console.log("Server listening at http://localhost:3000");
});