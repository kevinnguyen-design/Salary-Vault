const fs = require("fs");
const path = require("path");
const { cityComparison, remoteRoi } = require("../../backend/calculator");

function loadCities() {
  const fullPath = path.join(__dirname, "../../data/cities.json");
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store"
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const mode = payload.mode;
    const cities = loadCities();
    const byId = new Map(cities.map((city) => [city.id, city]));

    if (mode === "remote") {
      const sourceCity = byId.get(payload.sourceCityId);
      const targetCity = byId.get(payload.targetCityId);

      if (!sourceCity || !targetCity) {
        return json(400, { error: "Invalid city id(s)" });
      }

      const result = remoteRoi({
        salary: Number(payload.salary || 0),
        remoteSalary: Number(payload.remoteSalary || 0),
        commuteMonthly: Number(payload.commuteMonthly || sourceCity.avgCommuteCostMonthly),
        miscMonthly: Number(payload.miscMonthly || 300),
        sourceCity,
        targetCity
      });

      return json(200, { mode, result });
    }

    if (mode === "col") {
      const sourceCity = byId.get(payload.sourceCityId);
      const targetIds = Array.isArray(payload.targetCityIds) ? payload.targetCityIds : [];

      if (!sourceCity || targetIds.length === 0) {
        return json(400, { error: "Source city and target cities required" });
      }

      const comparisons = targetIds
        .map((id) => byId.get(id))
        .filter(Boolean)
        .slice(0, 3)
        .map((targetCity) => cityComparison(Number(payload.salary || 0), sourceCity, targetCity));

      return json(200, {
        mode,
        result: {
          sourceCityId: sourceCity.id,
          salary: Number(payload.salary || 0),
          cards: comparisons
        }
      });
    }

    return json(400, { error: "Unsupported mode" });
  } catch (error) {
    return json(500, {
      error: "Server error",
      detail: error.message
    });
  }
};
