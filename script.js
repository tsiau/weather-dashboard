document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "d628931054def83e2edcf24143664d6c"; // API key
    const cityForm = document.getElementById("city-form");
    const cityInput = document.getElementById("city-input");
    const weatherInfo = document.getElementById("weather-info");
    const searchHistory = document.getElementById("search-history");
    const searchHistoryKey = "searchHistory";

    async function getWeatherData(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching weather data: ", error);
            return null;
        }
    }

    function displayWeather(data) {
        const cityName = data.name;
        const date = new Date(data.dt * 1000);
        const icon = data.weather[0].icon;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        const weatherHTML = `
            <h2>${cityName}</h2>
            <p>Date: ${date.toDateString()}</p>
            <img src="https://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
            <p>Temperature: ${Math.round(temperature - 273.15)}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        `;

        weatherInfo.innerHTML = weatherHTML;
        updateBackgroundImage(data.weather[0].main.toLowerCase());
    }

    cityForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            const weatherData = await getWeatherData(city);
            if (weatherData) {
                displayWeather(weatherData);
                let history = JSON.parse(localStorage.getItem(searchHistoryKey)) || [];
                history.push(city);
                localStorage.setItem(searchHistoryKey, JSON.stringify(history));
                displaySearchHistory();
            }
        }
    });

    function displaySearchHistory() {
        const history = JSON.parse(localStorage.getItem(searchHistoryKey)) || [];
        const historyListHTML = `
            <h3>Search History</h3>
            <ul>
                ${history.map(city => `<li><a href="#" class="search-history-item">${city}</a></li>`).join('')}
            </ul>
        `;

        searchHistory.innerHTML = historyListHTML;

        const searchHistoryItems = document.querySelectorAll(".search-history-item");
        searchHistoryItems.forEach(item => {
            item.addEventListener("click", async () => {
                const selectedCity = item.textContent;
                const weatherData = await getWeatherData(selectedCity);
                if (weatherData) {
                    displayWeather(weatherData);
                }
            });
        });
    }

    function updateBackgroundImage(weatherCondition) {
        const backgroundImageUrls = {
            clear: 'url("image/clear-sky.jpg")',
            rain: 'url("image/rainy.jpg")',
            clouds: 'url("image/cloudy.jpg")',
        };

        const backgroundImage = backgroundImageUrls[weatherCondition] || '';

        document.body.style.backgroundImage = backgroundImage;
    }

    // Initial display of search history
    displaySearchHistory();
});
