const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const searchForm = document.querySelector(".search-form");
// landing page
const searchFormContainer = document.querySelector(
  ".landing-page-search-form-container"
);
const mainLandingPage = document.querySelector(".main-landing-page");
const pageIntro = document.querySelector(".page-intro");
const temperatureValue = document.querySelector(".temperature-value");
const temperatureOverview = document.querySelector(".temperature-overview");
const forecastWindSpeed = document.querySelector(".forecast-wind-speed");
const time = document.querySelector(".time");
const LandingPageWeatherInfo = document.querySelector(
  ".weather-info-landing-page"
);

// search page
const mainSearchPage = document.querySelector(".main-search-page");
const locationName = document.querySelector(".location");
const date = document.querySelector(".date");
const weatherResultInfo = document.querySelector(".weather-info-search-page");
const locationWeatherCondition = document.querySelector(
  ".location-weather-condition"
);
const currentTemperature = document.querySelector(".current-temperature-value");
const locationDataContainer = document.querySelector(
  ".location-data-container"
);
const currentTemperatureContainer = document.querySelector(
  ".current-temperature-container"
);
//
let searchValue = "";

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

const getLatitudeAndLongitude = async (location) => {
  try {
    const response = await fetch(
      `https://google-maps-geocoding.p.rapidapi.com/geocode/json?language=en&address=${location}`,
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
    console.log({ data });
    if (data.results?.length < 1) {
      errorMessage = "Kindly enter a more precise location.";
      return "Kindly enter a more precise location.";
    }

    getWeather(
      data?.results[0]?.geometry?.location?.lat,
      data?.results[0]?.geometry?.location?.lng
    );
    return "";
  } catch (e) {
    console.error(e);
  }
};

searchButton.addEventListener("click", async (e) => {
  e.preventDefault();

  if (navigator.onLine) {
    if (searchInput?.value?.length > 0) {
      const returnValue = await getLatitudeAndLongitude(searchInput?.value);

      if (returnValue?.length > 0) {
        alert(returnValue);
        //   return (searchFormContainer.innerHTML += `<p class="location-search-error">${returnValue}</p>`);
      } else {
        // searchValue = searchInput?.value;
        // mainLandingPage.style.padding = "65px 90px 64px";
        mainLandingPage.classList.add("main-search-page");

        pageIntro.style.display = "none";
        LandingPageWeatherInfo.style.display = "none";

        //
        weatherResultInfo.style.display = "flex";
        locationDataContainer.style.display = "block";
        currentTemperatureContainer.style.display = "block";
      }
    }
  } else {
    alert("Kindly connect to the internet.");
  }
});

// show landing page values
const renderLandingPageData = (currentData) => {
  temperatureValue.innerHTML = currentData?.temperature_2m;
  temperatureOverview.innerHTML = weatherOverview[currentData?.weather_code];
  forecastWindSpeed.innerHTML = `Wind speed : ${currentData?.wind_speed_10m} m/s`;
  time.innerHTML = formatTime(new Date().toISOString());
};

// combine and splice data
const combineWeatherData = (data) => {
  const combinedData = data?.time?.map((time, index) => ({
    time,
    temperature_2m: data?.temperature_2m[index],
    weather_code: data?.weather_code[index],
  }));

  const dataCopy = [...combinedData];

  const start = dataCopy.splice(new Date().getHours());

  const EightHoursDataFromNow = [...start, ...dataCopy]?.slice(0, 8);

  return EightHoursDataFromNow;
};

// show search result
const renderSearchPageResult = (data) => {
  const combinedData = combineWeatherData(data);

  console.log({ combinedData });
  locationName.innerHTML = searchInput?.value;
  date.innerHTML = formatDate(new Date());
  locationWeatherCondition.innerHTML =
    weatherOverview[combinedData[0]?.weather_code];
  currentTemperature.innerHTML = combinedData[0]?.temperature_2m;

  weatherResultInfo.innerHTML = "";

  combinedData?.forEach((data) => {
    weatherResultInfo.innerHTML += `
    <div class="weather-info">
    <span class="time">${formatTime(data?.time)}</span>
    <img src="./assets/svg/logo.svg" alt="temperature" />
    <span class="time-current-temperature">${
      data?.temperature_2m
    }<sup>o</sup></span>
  </div>
    `;
  });
};

const getWeather = async (latitude, longitude) => {
  try {
    if (latitude === undefined && longitude === undefined) {
      latitude = 8.486160975936386;
      longitude = 4.674529351470396;
    }

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&forecast_days=1`
    );
    const data = await response.json();

    if (searchInput?.value?.length > 0) {
      renderSearchPageResult(data?.hourly);
    } else {
      renderLandingPageData(data?.current);
    }
  } catch (e) {
    console.error(e);
  }
};

// Get weather data on page load
getWeather();

// getLatitudeAndLongitude();

// format time to show am or pm
function formatTime(dateIsoString) {
  const date = new Date(dateIsoString);
  let hour = date.getHours();
  let minute = date.getMinutes();

  let time;

  if (minute === 0) {
    minute = ``;
  }
  if (minute < 9 && minute > 0) {
    minute = `:0${minute}`;
  }
  if (minute > 9) {
    minute = `:${minute}`;
  }

  if (hour <= 12) {
    time = `${hour}${minute}AM`;
  } else {
    hour -= 12;
    time = `${hour}${minute}PM`;
  }

  return time;
}

// format date
function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
