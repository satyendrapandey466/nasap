import express from "express";
import {
  launchController,
  addNewLaunchController,abortLaunch
} from "./launches.controller.js";
const allLaunches = express.Router();
allLaunches.get("/", launchController);
allLaunches.post("/", addNewLaunchController);
allLaunches.delete("/:id",abortLaunch);
export { allLaunches }; 
