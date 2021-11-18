// Please run your solution from this file

const { renderData, fetchMissions } = require("./solution");

fetchMissions().then((data) => renderData(data));
