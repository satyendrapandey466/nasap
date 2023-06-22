import http from "http";
import mongoose from "mongoose";
import { loadhabitablePlanets } from "./src/models/planets.models.js";
import { loadLaunchesData } from "./src/models/launches.model.js";
// import app from './app';
import app from "./app.js";
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
mongoose.connection.on("open",()=>{
  console.log("Connection Established")
})
mongoose.connection.on("error",(err)=>{
  console.log(`Connection Failed with error ${err}`)
})
const MONGO_URL = "mongodb+srv://nasaAPI:EkvIQ3ux6grBu1NV@nasaapi.9vhk4v9.mongodb.net/?retryWrites=true&w=majority"
async function loadData(){
  await mongoose.connect(MONGO_URL);
  await loadhabitablePlanets();
  await loadLaunchesData();
  server.listen(PORT, () => {
    console.log(`Listening on the port number ${PORT}`);
  });
}
loadData();


