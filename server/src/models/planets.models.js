import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { planetModel } from "./planets.mongo.js";
const __filname = fileURLToPath(import.meta.url);
const __dirname = __filname;
// const habitablePlanet = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}
function loadhabitablePlanets() {
  const promise = new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (isHabitablePlanet(data)) addPlanet(data);
      })
      .on("error", (err) => {
        reject(err);
      })
      .on("end", async() => {
        const habitablePlanetLength = (await getAllHabitablePlanets()).length;
        console.log(
          `${habitablePlanetLength} habitable planets are available`
        );
        resolve();
      });
  });
  return promise;
}
async function addPlanet(planet) {
  try {
    await planetModel.updateOne(
      { keplerName: planet.kepler_name },
      {
        keplerName: planet.kepler_name,
      },
      { upsert: true }
    );
  } catch (error) {
    console.error(`Planets could not be added ${error}`);
  }
}
async function getAllHabitablePlanets() {
  return await planetModel.find({});
  // return habitablePlanet;
}
export { loadhabitablePlanets, getAllHabitablePlanets };
