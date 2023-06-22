import express from "express";
import cors from "cors";
import { planetRouter } from "./src/routes/planets/planets.router.js";
import { allLaunches } from "./src/routes/launches/launches.router.js";
import morgan from "morgan";
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use("/launches",allLaunches);
app.use(planetRouter);
export default app;
