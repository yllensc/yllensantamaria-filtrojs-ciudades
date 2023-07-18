import { weatherBox, weatherDetails } from "./selectors.js";

const APIKey = "3c1e3dc8702f8cf9ead56d845c4431c9";

export async function getWeather(city) {
  try {
     
    let response = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
      )
    ).json();
    const nameCity = document.querySelector(".cityName");
    const image = document.querySelector(".weather-box img");
    const temperature = document.querySelector(".weather-box .temperature");
    const description = document.querySelector(".weather-box .description");
    const humidity = document.querySelector(".weather-details .humidity span");
    const wind = document.querySelector(".weather-details .wind span");
    image.src = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
    console.log(response.weather[0].main);
    switch (response.weather[0].main) {
      case "Clear":
        weatherBox.style.background =
          "linear-gradient(60deg, #00bd56 10%, #f9fd50 100%)";
        break;
      case "Rain":
        weatherBox.style.background =
          "linear-gradient(60deg, #335d6e 10%, #99bdda 100%)";
        break;
      case "Snow":
        weatherBox.style.background =
          "linear-gradient(60deg, #dbeef0 10%, #577475 100%)";
        break;
      case "Clouds":
        weatherBox.style.background =
          "linear-gradient(60deg, #5f6080 10%, #81919e 100%)";
        break;
      case "Haze":
        weatherBox.style.background =
          "linear-gradient(60deg, #bcbccf 10%, #613d68 100%)";
        break;
      case "Mist":
        weatherBox.style.background =
          "linear-gradient(60deg, #bcbccfce 10%, #1a9a9e80 100%)";
        break;
      case "broken":
        weatherBox.style.background =
          "linear-gradient(60deg, #bcbccfce 10%, #1a9a9e80 100%)";
        break;
      default:
        weatherBox.style.background =
          "linear-gradient(60deg, #bcbccfce 10%, #1a9a9e80 100%)";
    }
    nameCity.innerHTML = `${city}`;
    temperature.innerHTML = `${parseInt(response.main.temp)}<span>°C</span>`;
    description.innerHTML = `${response.weather[0].description}`;
    humidity.innerHTML = `${response.main.humidity}%`;
    wind.innerHTML = `${parseInt(response.wind.speed)} Km/h`;

    weatherBox.style.display = "block";
    weatherDetails.style.display = "block";
    weatherBox.classList.add("fadeIn");
    weatherDetails.classList.add("fadeIn");
  } catch (error) {
    const divError = document.createElement("div");
    divError.textContent = error;
    weatherBox.appendChild(divError);
  }
}
