const apiKey = "105998a52b86441612d8bdd2a88fbd96";

const locationEl = document.querySelector("#location");
const searchButtonEl = document.querySelector("#search");
const forecastDayDivEl = document.querySelector("#forecast-day");


const displayWeatherForecast = (weatherData) => {
    
    return `<li class="forecast-value">
    <h3>(${weatherData.dt_txt.split(" ")[0]})</h3>
    <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="">
    <h4>Temp: ${(weatherData.main.temp - 273.15).toFixed(2)}°C</h4>
    <h4>Wind: ${weatherData.wind.speed} MPH</h4>
    <h4>Humidity: ${weatherData.main.humidity} %</h4>
    </li>`;
};

const getCurrentWeather = (locationName, lat, lon) => {
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        fetch(apiURL)
            .then(response => response.json())
            .then(data => {
                var dailyForecastDays = [];
                var fiveDayForecast = data.list.filter(forecast=> {
                    var forecastDays = new Date(forecast.dt_txt).getDay();
                    if (!dailyForecastDays.includes(forecastDays)) {
                        return dailyForecastDays.push(forecastDays);
                    }
                });
                fiveDayForecast.forEach(weatherData => {
                    forecastDayDivEl.insertAdjacentHTML("beforeend", displayWeatherForecast(weatherData));
                }); 

            })
            .catch((error) => {
                console.log("There has been an error!");
            });
};
const onClickSearch = () => {
    const locationName = locationEl.value.trim();

        if (!locationName) return;

        const apiURL = `https://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${apiKey}`;

        fetch(apiURL)
            .then(response => response.json())
            .then(data => {

                if (!data.length) return alert (`There are no coordinates for ${locationName}`);
                const {name, lat, lon} = data[0];
                getCurrentWeather(name, lat, lon);
            })
            .catch((error) => {
                console.log("There has been an error!");
            });
};




searchButtonEl.addEventListener('click', onClickSearch);


