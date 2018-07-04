const moment = require('moment-timezone');
const cityTimezones = require('city-timezones');

/*
 * City Schema example
 * 
 *  {
 *    "name": "Vancouver",
 *    "time": "11:50",
 *    "details": {
 *      "city": "Vancouver",
 *      "city_ascii": "Vancouver",
 *      "lat": 45.63030133,
 *      "lng": -122.6399925,
 *      "pop": 343796.5,
 *      "country": "United States of America",
 *      "iso2": "US",
 *      "iso3": "USA",
 *      "province": "Washington",
 *      "state_ansi": "WA",
 *      "timezone": "America/Los_Angeles"
 *    }
 *  }
 */
function cityHandler(req, res) {
  const { city } = req.params;
  console.log(`Handling request. City: ${city}`);

  const results = timeInLocation(city);
  const match = results[0] || null;

  return res.json({ match, results });
}

function timeInLocation(city) {
  const cityMatches = getCityData(city);

  return cityMatches.map(cityData => {
    const time = getTime(cityData);
    return time && {
      name: cityData.city,
      time,
      details: cityData,
    }
  }).filter(city => city != undefined);
}

function getCityData(city) {
  const cityLookup = cityTimezones.lookupViaCity(city);
  if (!cityLookup || cityLookup.length == 0) {
    return [];
  }

  // If there are multiple matches, sort by population, descending.
  cityLookup.sort((a, b) => b.pop - a.pop);
  return cityLookup;
}

function getTime({ timezone = '' } = {}) {
  // Make sure moment.js understands the timezone, otherwise it fails (almost)
  // silently but returns the UCT date and we end up with the wrong time.
  if (!moment.tz.zone(timezone)) {
    return undefined;
  }

  const now = (new Date()).toISOString();
  return moment.tz(now, timezone).format('HH:mm');
}

module.exports = {
  city: cityHandler,
};
