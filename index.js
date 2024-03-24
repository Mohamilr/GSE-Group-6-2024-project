const locationName = document.getElementById("location");
// landing page
const temperatureValue = document.querySelector(".temperature-value");
const temperatureOverview = document.querySelector(".temperature-overview");
const forecastWindSpeed = document.querySelector(".forecast-wind-speed");
const time = document.querySelector(".time");

const weatherOverview = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "partly cloudy",
  3: "overcast",
  45: "Fog",
  48: "depositing rime fog",
  51: "Drizzle: Light",
  53: "Drizzle: moderate",
  55: "Drizzle: dense intensity",
  56: "Freezing Drizzle: Light",
  57: "Freezing Drizzle: dense intensity",
  61: "Rain: Slight",
  63: "Rain: moderate",
  65: "Rain: heavy intensity",
  66: "Freezing Rain: Light",
  67: "Freezing Rain: heavy intensity",
  71: "Snow fall: Slight",
  73: "Snow fall: moderate",
  75: "Snow fall: heavy intensity",
  77: "Snow grains",
  80: "Rain showers: Slight",
  81: "Rain showers: moderate",
  82: "Rain showers: violent",
  85: "Snow showers: slight",
  86: "Snow showers: heavy",
  96: "Thunderstorm: slight hail",
};

let latitude, longitude;

const renderLandingPageData = (currentData) => {
  temperatureValue.innerHTML = currentData?.temperature_2m;
  temperatureOverview.innerHTML = weatherOverview[currentData?.weather_code];
  forecastWindSpeed.innerHTML += `${currentData?.wind_speed_10m} m/s`;
  time.innerHTML = dateFormat(currentData?.time);
};

const getWeather = async (latitude, longitude) => {
  console.log({ latitude, longitude });
  try {
    if (latitude === undefined && longitude === undefined) {
      latitude = 8.486160975936386;
      longitude = 4.674529351470396;
    }

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&forecast_days=1`
    );
    const data = await response.json();
    console.log({ data });

    renderLandingPageData(data?.current);
  } catch (e) {
    console.error(e);
  }
};

// Get weather data on page load
getWeather();

async function getLatitudeAndLongitude() {
  try {
    const response = await fetch(
      `https://google-maps-geocoding.p.rapidapi.com/geocode/json?language=en&address=${"unilorin"}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "google-maps-geocoding.p.rapidapi.com",
          "x-rapidapi-key":
            "feb5a7b223msh76b7a43e38446bfp1eb31ajsne300800cf916",
        },
      }
    );

    const data = await response.json();
    if (data.length < 1) {
      return console.log("not found");
    }

    console.log({ data });
    // lat = data.results[0].geometry.location.lat,
    // lng = data.results[0].geometry.location.lng
    // console.log('lat', lat);
    // console.log('lng', lng)
  } catch (e) {
    console.error(e);
  }
}

// getLatitudeAndLongitude();

// input.addEventListener('input', debounce(getLatitudeAndLongitude, 1000));

// // debounce
// function debounce(func, wait) {
//     let timeout;
//     return function(...args) {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => {
//         func.apply(this, args);
//       }, wait);
//     };
//   }

function dateFormat(dateIsoString) {
  const date = new Date(dateIsoString);
  let hour = date.getUTCHours();
  let minute = date.getUTCMinutes();

  let time;
  if (hour <= 12) {
    time = `${hour + 1}:${minute} am`;
  } else {
    time = `${hour + 1}:${minute} pm`;
  }

  return time;
}
