const { orderBy } = require("lodash");

// Please implement your solution in this file

Array.prototype.contains = function (element) {
  let isNameContain;
  this.forEach((value) => {
    if (value.toUpperCase().includes(element.toUpperCase())) {
      isNameContain = true;
    }
  });
  return isNameContain;
};

const fetchMissions = () => {
  return fetch("https://api.spacexdata.com/v3/launches/past")
    .then((response) => {
      return response.json();
    })
    .then((data) => prepareData(data))
    .catch((err) => {
      document.getElementById("out").innerText = `Error: ${err.message}`;
    });
};

const isContainsText = (mission, name = "NASA") => {
  if (
    !mission ||
    !mission.rocket ||
    !mission.rocket.second_stage ||
    !mission.rocket.second_stage.payloads ||
    mission.rocket.second_stage.payloads.length === 0
  ) {
    return false;
  }

  const payloads = mission.rocket.second_stage.payloads;

  for (const payload of payloads) {
    if (payload.customers.contains(name)) {
      return true;
    }
  }

  return false;
};

const prepareData = (missions, year = 2018) => {
  if (!missions.length) {
    throw new Error(`No data found`);
  }
  const parsedArray = [];
  missions.forEach((mission) => {
    if (
      new Date(mission.launch_year).getUTCFullYear() == year &&
      isContainsText(mission)
    ) {
      const { flight_number, mission_name } = mission;
      const payloads_count = mission.rocket.second_stage.payloads.length;
      parsedArray.push({ flight_number, mission_name, payloads_count });
    }
  });

  return orderBy(
    parsedArray,
    ["payloads_count", "flight_number"],
    ["desc", "desc"]
  );
};

const renderData = (flights) => {
  document.getElementById("out").append(JSON.stringify(flights, null, 2));
};

module.exports = {
  prepareData,
  fetchMissions,
  renderData,
};
