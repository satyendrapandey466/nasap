import {getAllHabitablePlanets} from "../../models/planets.models.js";
async function getAllPlanets(req, res) {
  return res.status(200).json(await getAllHabitablePlanets());
}
export { getAllPlanets };
