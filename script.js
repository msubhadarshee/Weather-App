//__________________________________________________________________________________________________________

//making object of weatherapi to store key-value pairs , in this object used to store weather info.
const weatherApi = {
  key: "8014ebaa2043b4d926d1f69feb56e6fa", // Authorization key
  baseUrl: "https://api.openweathermap.org/data/2.5/weather", //URL to fetch data
};
//__________________________________________________________________________________________________________

let locationButton = document.getElementById("location-button");
locationButton.addEventListener("click", () => {
  if ("geolocation" in navigator) {
    // Request the user's location permission
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getCityNameByCoordinates(latitude, longitude);
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported.");
  }
});

function getCityNameByCoordinates(latitude, longitude) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApi.key}&units=metric`
  )
    .then((weather) => {
      if (!weather.ok) {
        throw new Error(`Weather API Error: ${weather.status}`);
      }
      return weather.json();
    })
    .then((weatherData) => {
      const city = weatherData.name; // Extract the city name from the weather data
      getWeatherByCity(city); // Fetch weather data based on the city name
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

function getWeatherByCity(city) {
  fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
    .then((weather) => {
      if (!weather.ok) {
        throw new Error(`Weather API Error: ${weather.status}`);
      }
      return weather.json();
    })
    .then(getWeatherReport(city))
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

//_______________________________________________________________________________________________________________
//This part handles user interactions , it basically listens to 2 events , searchbutton and enterKey
let searchButton = document.getElementById("search-button");
let searchInputBox = document.getElementById("input-box");

searchButton.addEventListener("click", () => {
  const city = searchInputBox.value.trim(); //value gets the required value , trim used for removing white spaces.
  if (city) {
    getWeatherReport(city);
  } else {
    swal("Empty Input", "Please enter a city name", "error"); //swal-dialogue box with an error message
  }
});

searchInputBox.addEventListener("keypress", (event) => {
  if (event.keyCode == 13) {
    const city = searchInputBox.value.trim();
    if (city) {
      //gets the city from input box
      getWeatherReport(city);
    } else {
      swal("Empty Input", "Please enter a city name", "error");
    }
  }
});
//__________________________________________________________________________________________________________

//get waether report
try {
  function getWeatherReport(city) {
    fetch(
      `${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`
    ) // fetch method fetching the data from  base url
      .then((weather) => {
        return weather.json(); // return data from api in JSON format
      })
      .then(showWeaterReport); // calling showWeatherReport function}
  }
} catch (err) {
  console.log("Error Occured!", err);
}
//___________________________________________________________________________________________________________________

//show weather report
function showWeaterReport(weather) {
  let city_code = weather.cod;
  if (city_code === "400") {
    swal("Empty Input", "Please enter a city name", "error");
    reset();
  } else if (city_code === "404") {
    swal("Invalid", "Please Enter a Valid City", "warning");
    reset();
  } else {
    let op = document.getElementById("weather-body");
    op.style.display = "block";
    let todayDate = new Date();
    let parent = document.getElementById("parent");
    let weather_body = document.getElementById("weather-body");
    const flagApiUrl = `https://flagcdn.com/144x108/${weather.sys.country.toLowerCase()}.png`;

    weather_body.innerHTML = `
    <div class="location-deatils">
        <div class="city" id="city">
        ${weather.name} , <img src="${flagApiUrl}" style="width: 20px; height: auto;">  ${weather.sys.country}
         
        </div>
        <div class="date" id="date"> ${dateManage(todayDate)}</div>
    </div>
    <div class="weather-status">
        <div class="temp" id="temp">${Math.round(
          weather.main.temp
        )}&deg;C </div>
        <div class="weather" id="weather"> ${
          weather.weather[0].main
        } <i class="${getIconClass(weather.weather[0].main)}"></i>  </div>
        <div class="min-max" id="min-max">${Math.floor(
          weather.main.temp_min
        )}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max) </div>
        <div id="updated_on">Updated as of ${getTime(todayDate)}</div>
    </div>
    <hr style="border: 1px solid black; color: black;">
    <div class="day-details">
        <div class="basic">Feels like ${
          weather.main.feels_like
        }&deg;C | Humidity ${weather.main.humidity}%  <br> Pressure ${
      weather.main.pressure
    } mb | Wind ${weather.wind.speed} KMPH</div>
    </div>
    `;
    parent.append(weather_body);
    changeBg(weather.weather[0].main);
    reset();
  }
}
//_________________________________________________________________________________________________________________

//making a function for the  last update current time
function getTime(todayDate) {
  let hour = addZero(todayDate.getHours());
  let minute = addZero(todayDate.getMinutes());
  return `${hour}:${minute}`;
}

//date manage for return  current date
function dateManage(dateArg) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let year = dateArg.getFullYear();
  let month = months[dateArg.getMonth()];
  let date = dateArg.getDate();
  let day = days[dateArg.getDay()];
  // console.log(year+" "+date+" "+day+" "+month);
  return `${date} ${month} (${day}) , ${year}`;
}
//__________________________________________________________________________________________________________

// function for the dynamic background change  according to weather status
function changeBg(status) {
  if (status === "Clouds") {
    document.body.style.backgroundImage = "url(img/clouds.jpg)";
  } else if (status === "Rain") {
    document.body.style.backgroundImage = "url(img/rainy.jpg)";
  } else if (status === "Clear") {
    document.body.style.backgroundImage = "url(img/clear.jpg)";
  } else if (status === "Snow") {
    document.body.style.backgroundImage = "url(img/snow.jpg)";
  } else if (status === "Sunny") {
    document.body.style.backgroundImage = "url(img/sunny.jpg)";
  } else if (status === "Thunderstorm") {
    document.body.style.backgroundImage = "url(img/thunderstorm.jpg)";
  } else if (status === "Drizzle") {
    document.body.style.backgroundImage = "url(img/drizzle.jpg)";
  } else if (status === "Mist") {
    document.body.style.backgroundImage = "url(img/mist.jpg)";
  } else if (status === "Haze") {
    document.body.style.backgroundImage = "url(img/haze.jpg)";
  } else if (status === "Fog") {
    document.body.style.backgroundImage = "url(img/fog.jpg)";
  } else if (status === "Smoke") {
    document.body.style.backgroundImage = "url(img/smoke.jpg)";
  } else {
    document.body.style.backgroundImage = "url(img/bg9.jpg)";
  }
}
//__________________________________________________________________________________________________________

//making a function for the classname of icon
function getIconClass(classarg) {
  if (classarg === "Rain") {
    return "fas fa-cloud-showers-heavy";
  } else if (classarg === "Clouds") {
    return "fas fa-cloud cloud-icon";
  } else if (classarg === "Clear") {
    return "fas fa-cloud-sun";
  } else if (classarg === "Snow") {
    return "fas fa-snowman";
  } else if (classarg === "Sunny") {
    return "fas fa-sun";
  } else if (classarg === "Mist") {
    return "fas fa-smog";
  } else if (classarg === "Thunderstorm") {
    return "fas fa-thunderstorm";
  } else if (classarg === "Fog") {
    return "fa-regular fa-snowflake";
  } else if (classarg === "Drizzle") {
    return "fa-solid fa-droplet-degree";
  } else {
    return "fas fa-sun";
  }
}
//__________________________________________________________________________________________________________

function reset() {
  let input = document.getElementById("input-box");
  input.value = "";
}
//__________________________________________________________________________________________________________

// funtion to add zero if hour and minute less than 10
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
//__________________________________________________________________________________________________________
