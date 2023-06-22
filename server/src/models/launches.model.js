import { launchesModel } from "./launches.mongo.js";
import { planetModel } from "./planets.mongo.js";
import axios from "axios";
const SPACE_X_API_LINK = "https://api.spacexdata.com/v5/launches/query";
// const launches = new Map();
const DEFAULT_FLIGHT_NUMBER = 1;
// let currentFlightNumber = 1;
// const launch = {
//   flightNumber: 1,
//   mission: "Appolo XI",
//   rocket: "PSLV -III",
//   launchDate: new Date("January 23, 2030 "),
//   target: "Kepler-442 b",
//   customers: ["ISRO"],
//   upcoming: true,
//   success: true,
// };
// postNewLaunch(launch);
async function getAllLaunches(skip,limit) {
  const launchesData= await launchesModel.find({}, "-_id -__v").sort({flightNumber:1}).skip(skip).limit(limit);
  console.log(`${skip}and ${limit}`);
  return launchesData
}
async function getLatestFlightNumber() {
  const latestFlighNumber = await launchesModel.findOne().sort("-flightNumber");
  if (!latestFlighNumber) return DEFAULT_FLIGHT_NUMBER;
  return latestFlighNumber.flightNumber;
}
// launches.set(launch.flightNumber, launch);
// function getAllLaunches() {
//   return Array.from(launches.values());
// }
async function isAvailableLaunchID(launchID) {
  const isValidLaunchID = await launchesModel.findOne({
    flightNumber: launchID,
  });
  if (!isValidLaunchID) return false;
  else return true;
  return launches.has(launchID);
}
async function abortMissionwithID(id) {
  const abortedMission = await launchesModel.updateOne(
    { flightNumber: id },
    {
      upcoming: false,
      success: false,
    }
  );
  return abortedMission;
  // const missionToBeAborted = launches.get(id);
  // missionToBeAborted.upcoming = false;
  // missionToBeAborted.success = false;
  // return missionToBeAborted;
}
async function fetchLaunchesData() {
  console.log(`Downloading Launches Data from ${SPACE_X_API_LINK}`);
  const LaunchesData = await axios.post(SPACE_X_API_LINK, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  // console.log(LaunchesData);
  const launchesDocs = LaunchesData.data.docs;
  for (const launchesDoc of launchesDocs) {
    const payloadsData = launchesDoc["payloads"];
    const customers = payloadsData.flatMap((payload) => {
      return payload["customers"];
    });
    const launchData = {
      flightNumber: launchesDoc["flight_number"],
      mission: launchesDoc["name"],
      rocket: launchesDoc["rocket"]["name"],
      launchDate: launchesDoc["date_local"],
      customers,
      upcoming: launchesDoc["upcoming"],
      success: launchesDoc["success"],
    };
    postNewLaunch(launchData);
    // console.log(launchData);
  }
  // console.log(launchesDocs
}
async function loadLaunchesData() {
  if (
    await findLaunch({
      flightNumber: 1,
      rocket: "Falcon 1",
      mission: "FalconSat",
    })
  ) {
    console.log(`Launches Data is already Loaded`);
  } else {
    fetchLaunchesData();
  }
}
async function postNewLaunch(launch) {
  await launchesModel.updateOne({ flightNumber: launch.flightNumber }, launch, {
    upsert: true,
  });
}
async function findLaunch(filter) {
  const obtainedLaunch = await launchesModel.findOne(filter);
  console.log(obtainedLaunch);
  return obtainedLaunch;
}
async function addNewLaunch(launch) {
  let currentFlightNumber = await getLatestFlightNumber();
  currentFlightNumber++;
  const addinglaunch = {
    ...launch,
    flightNumber: currentFlightNumber,
    customers: ["ISRO"],
    upcoming: true,
    success: true,
  };
  const destinationPlanet = await planetModel.findOneAndUpdate({
    keplerName: launch.target,
  });
  if (!destinationPlanet) {
    throw new Error("Target Planet is not habitable Planet");
  }
  // launches.set(currentFlightNumber, addinglaunch);
  await postNewLaunch(addinglaunch);
}

export {
  addNewLaunch,
  getAllLaunches,
  isAvailableLaunchID,
  abortMissionwithID,
  loadLaunchesData,
};
