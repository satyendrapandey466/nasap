import {
  getAllLaunches,
  addNewLaunch,
  abortMissionwithID,
  isAvailableLaunchID,
} from "../../models/launches.model.js";
import { getPagination } from "../../services/query.js";
async function launchController(req, res) {
  const {skip,limit} = getPagination(req.query);
  console.log(`${skip}and ${limit}`);
  return res.status(200).json(await getAllLaunches(skip,limit));
}
async function addNewLaunchController(req, res) {
  let launch = req.body;
  if (!launch.launchDate || !launch.mission || !launch.rocket || !launch.target)
    return res.status(400).json({
      error: "Required field missing",
    });
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate))
    return res.status(400).json({
      error: "Invalid Date Entered",
    });
  await addNewLaunch(launch);
  return res.status(201).json(launch);
}
async function abortLaunch(req, res) {
  const launchID = +req.params.id;
  if (!(await isAvailableLaunchID(launchID))) {
    return res.status(404).json({
      error: "Launch Doesn't Exist",
    });
  } else {
    const abortedMission = await abortMissionwithID(launchID);
    if (!abortedMission) {
      return res.status(400).json({ error: "Abort Failed" });
    }
    return res.status(200).json({ ok: true });
  }
}
export { launchController, addNewLaunchController, abortLaunch };
