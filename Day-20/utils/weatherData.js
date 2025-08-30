const request = require("request")

const openWeatherMap = {
    BASE_URL: "https://api.openweathermap.org/data/2.5/weather?q=",
    SECRET_KEY: "bfb7763c4f933375bf1088f0a3d53c2f",
}

const openAqi = {
    BASE_URL: "https://api.openweathermap.org/data/2.5/weather?q=",
    SECRET_KEY: "bfb7763c4f933375bf1088f0a3d53c2f",
}


const fetchData = (address, callback) => {
    const weatherUrl = openWeatherMap.BASE_URL + encodeURIComponent(address) + "&appid=" + openWeatherMap.SECRET_KEY;

    request({ url: weatherUrl, json: true }, (weatherError, weatherData) => {
        if (weatherError) {
            console.error('Error fetching weather data:', weatherError);
            return callback(true, "Unable to fetch weather data. Please try again.");
        }

        // Extract coordinates from weather data
        const { lat, lon } = weatherData.coord;

        // Fetch AQI data based on coordinates
        const aqiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${openAqi.SECRET_KEY}`;

        request({ url: aqiUrl, json: true }, (aqiError, aqiData) => {
            if (aqiError) {
                console.error('Error fetching AQI data:', aqiError);
                return callback(true, "Unable to fetch AQI data. Please try again.");
            }

            // Combine weather and AQI data
            const combinedData = {
                weather: weatherData,
                aqi: aqiData,
            };

            callback(false, combinedData);
        });
    });
};

const weatherData = (address, callback) => {
    const url = openWeatherMap.BASE_URL + encodeURIComponent(address) + "&appid=" + openWeatherMap.SECRET_KEY

    console.log(url)

    request({ url, json: true }, (error, data) => {
        if (error) {
            callback(true, "unable to fetch please try again" + error)
        }
        callback(false, data.body);
    })
}

module.exports = weatherData;
