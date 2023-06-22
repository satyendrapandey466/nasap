const API_URL = "http://localhost:8000/";
async function httpGetPlanets() {
  // TODO: Once API is ready.
  const planets = await fetch(`${API_URL}planets`);
  return await planets.json();
  // Load planets and return as JSON.
}

async function httpGetLaunches() {

  const launches = await fetch(`${API_URL}launches`);
  const fetchedLaunches = await launches.json();
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });

}

async function httpSubmitLaunch(launch) {
  try {
    const addNewLaunch = await fetch(`${API_URL}launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
    return addNewLaunch;
  } catch (error) {
    console.log(error);
    return {
      ok: false
    }
  }
  

}

async function httpAbortLaunch(id) {
  try {
    const abortedLaunch = await fetch(`${API_URL}launches/${id}`,{
      method:"delete"
    });
    return abortedLaunch
  } catch (error) {
    console.log(error)
    return {
      ok: false
    }
  }
  
  

}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
