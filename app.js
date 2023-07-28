const welcomeMessage = $("#welcome");
const weatherData = $("#weather-data");
const errorMessage = $("#error");
const searchBar = $("#search-bar");
const searchButton = $("#search-button");
const tabs = $(".tabs");
const tabGroup = $(".tab-group");

const temperature = $("#temperature");
const unit = $("#unit");
const weatherIcon = $("#icon");
const condition = $("#condition");
const cityName = $("#city-name");
const humidity = $("#humidity");
const windSpeed = $("#wind");
const precipitation = $("#precip");

const forecastContainer = $("#forecast");
const forecastData = $(".forecast-data");
const forecastCity = $("#forecast-city-name");
const forecastDay = $(".forecast-day");
const forecastDate = $(".forecast-date");
const maxTemp = $(".forecast-max-temp");
const minTemp = $(".forecast-min-temp");
const forecastIcon = $(".forecast-icon");
const forecastPrecip = $(".forecast-precip");

let jsonData;

const commonConditions = {
    Cloudy: "bi-clouds-fill",
    Overcast: "bi-clouds-fill",
    Mist: "bi-cloud-drizzle",
    "Patchy rain possible": "bi-cloud-drizzle",
    "Patchy snow possible": "bi-cloud-snow",
    "Patchy sleet possible": "bi-cloud-sleet",
    "Patchy freezing drizzle possible": "bi-cloud-drizzle",
    "Thundery outbreaks possible": "bi-cloud-lightning",
    "Blowing snow": "bi-cloud-snow",
    Blizzard: "bi-cloud-snow-fill",
    Fog: "bi-cloud-fog",
    "Freezing fog": "bi-cloud-fog-fill",
    "Patchy light drizzle": "bi-cloud-drizzle",
    "Light drizzle": "bi-cloud-drizzle",
    "Freezing drizzle": "bi-cloud-drizzle-fill",
    "Heavy freezing drizzle": "bi-cloud-drizzle-fill",
    "Patchy light rain": "bi-cloud-rain",
    "Light rain": "bi-cloud-rain",
    "Moderate rain at times": "bi-cloud-rain",
    "Moderate rain": "bi-cloud-rain-fill",
    "Heavy rain at times": "bi-cloud-rain-heavy",
    "Heavy rain": "bi-cloud-rain-heavy-fill",
    "Light freezing rain": "bi-cloud-snow",
    "Moderate or heavy freezing rain": "bi-cloud-snow-fill",
    "Light sleet": "bi-cloud-snow",
    "Moderate or heavy sleet": "bi-cloud-snow-fill",
    "Patchy light snow": "bi-snow",
    "Light snow": "bi-snow",
    "Patchy moderate snow": "bi-snow",
    "Moderate snow": "bi-snow2",
    "Patchy heavy snow": "bi-snow2",
    "Heavy snow": "bi-snow2",
    "Ice pellets": "bi-cloud-hail",
    "Light rain shower": "bi-cloud-rain",
    "Moderate or heavy rain shower": "bi-cloud-rain-fill",
    "Torrential rain shower": "bi-cloud-rain-fill",
    "Light sleet showers": "bi-cloud-snow",
    "Moderate or heavy sleet showers": "bi-cloud-snow-fill",
    "Light snow showers": "bi-cloud-snow",
    "Moderate or heavy snow showers": "bi-cloud-snow-fill",
    "Light showers of ice pellets": "bi-cloud-hail",
    "Moderate or heavy showers of ice pellets": "bi-cloud-hail-fill",
    "Patchy light rain with thunder": "bi-cloud-lightning-rain",
    "Moderate or heavy rain with thunder": "bi-cloud-lightning-rain-fill",
    "Patchy light snow with thunder": "bi-cloud-lightning-rain",
    "Moderate or heavy snow with thunder": "bi-cloud-lightning-rain-fill",
};

const conditionsList = {
    day: {
        Sunny: "bi-sun-fill",
        "Partly cloudy": "bi-cloud-sun-fill",
        ...commonConditions,
    },
    night: {
        Clear: "bi-moon-stars",
        "Partly cloudy": "bi-cloud-moon-fill",
        ...commonConditions,
    },
};


const callWeatherApi = async (query) => {

    const response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=8e55e19e30cf401c9c953943233005&q=${query}&days=3&aqi=no&alerts=no`
    );
    return response.json();

}

const displayWeatherData = (jsonData) => {

    temperature.text(jsonData.current.temp_f.toFixed(0));
    condition.text(jsonData.current.condition.text);
    cityName.text(`${jsonData.location.name}, ${jsonData.location.region}`);
    humidity.text(`${jsonData.current.humidity}%`);
    windSpeed.text(`${jsonData.current.wind_mph} mph`);
    precipitation.text(`${jsonData.current.precip_in} in`);

    const iconClass = conditionsList[jsonData.current.is_day ? "day" : "night"][jsonData.current.condition.text];
    weatherIcon.removeClass().addClass(iconClass);

};


const displayForecastData = (jsonData) => {

    forecastCity.text(`${jsonData.location.name}, ${jsonData.location.region}`);

    jsonData.forecast.forecastday.forEach((forecast, i) => {
        const dateObj = new Date(forecast.date);
        const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "short" });
        const date = dateObj.getUTCDate().toString();
        forecastDay.eq(i).text(dayOfWeek);
        forecastDate.eq(i).text(date);
        maxTemp.eq(i).text(`${forecast.day.maxtemp_f.toFixed(0)}°F`);
        minTemp.eq(i).text(`${forecast.day.mintemp_f.toFixed(0)}°F`);

        const iconClass = conditionsList.day[forecast.day.condition.text];
        forecastIcon.eq(i).removeClass().addClass(iconClass);
        forecastPrecip.eq(i).text(`${forecast.day.daily_chance_of_rain}%`);
    });

};

const displayData = (isForecastTab) => {

    if (isForecastTab) {
        displayForecastData(jsonData);
        forecastContainer.slideDown();
        weatherData.hide();
    } else {
        displayWeatherData(jsonData);
        weatherData.slideDown();
        forecastContainer.hide();
    }
    errorMessage.hide();

};

const handleWeatherError = () => {

    weatherData.hide();
    forecastContainer.hide();
    errorMessage.slideDown();
    tabs.removeClass("tab-active");

};


const searchWeather = async (e) => {

    e.preventDefault();
    const query = searchBar.val();

    if (!query) return;

    try {
        jsonData = await callWeatherApi(query);
        console.log(jsonData);
        const activeTabIndex = tabs.index($(".tab-active"));
        if (activeTabIndex === 1) {
            tabs.eq(0).click();
        }
        displayData(false);
    } catch (e) {
        handleWeatherError();
    }

    tabGroup.css("display", "flex");
    welcomeMessage.hide('slow');

};


const getForecast = async (e) => {

    const query = searchBar.val();

    if (!query) return;

    try {
        jsonData = await callWeatherApi(query);
        displayData(true);
    } catch (e) {
        handleWeatherError();
    }

};


tabs.on("click", function () {

    const isForecastTab = $(this).index() === 1;
    tabs.removeClass("tab-active").eq(isForecastTab ? 1 : 0).addClass("tab-active");
    displayData(isForecastTab);

});


searchButton.on('click', searchWeather);
searchBar.on('keydown', (e) => {
    if (e.which === 13) searchWeather(e);
});

tabs.eq(0).on("click", searchWeather);
tabs.eq(1).on("click", getForecast);
