const input = document.querySelector("#input");
const button = document.querySelector("#btn");
const errorMsg = document.querySelector("#error");
const cityCard = document.querySelector("#cityCard");
const city = document.querySelector("#city");
const temperature = document.querySelector("#temperature");
const weatherState = document.querySelector("#weather");
const feelsLike = document.querySelector("#feelsLike");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#windSpeed");

function findWeatherCode(weatherCode) {
    let state;
    switch (weatherCode) {
        case 0:
            state = "Açık";
            break;
        case 1:
        case 2:
        case 3:
            state = "Bulutlu";
            break;
        case 45:
        case 48:
            state = "Sisli";
            break;
        case 51:
        case 53:
        case 55:
            state = "Çisenti";
            break;
        case 61:
        case 63:
        case 65:
            state = "Yağmurlu";
            break;
        case 71:
        case 73:
        case 75:
            state = "Karlı";
            break;
        case 80:
        case 81:
        case 82:
            state = "Sağanak";
            break;
        case 95:
            state = "Fırtına";
            break;
        default:
            state = "Bilinmiyor";
            break;
    }
    return state;
}

async function weatherInfo(latitude, longitude) {
    cityCard.style.display = "none";
    errorMsg.textContent = "Yükleniyor...";
    errorMsg.style.color = "green";
    try {
        const responseWeather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature`)
        if (!responseWeather.ok) {
            throw new Error("Veri alinamadi");
        }
        const weather = await responseWeather.json();
        const current = weather.current;
        const current_units = weather.current_units;
        temperature.textContent = `${current.temperature_2m}${current_units.temperature_2m}`; //Sicaklik
        feelsLike.textContent = `Hissedilen: ${current.apparent_temperature}${current_units.apparent_temperature}`; //Hissedilen Sicaklik
        humidity.textContent = `Nem: ${current.relative_humidity_2m}${current_units.relative_humidity_2m}`; //Nem
        windSpeed.textContent = `Rüzgar: ${current.wind_speed_10m} ${current_units.wind_speed_10m}`; //Ruzgar Hizi
        const weatherCode = current.weather_code;

        weatherState.textContent = findWeatherCode(weatherCode);

        cityCard.style.display = "block";
        errorMsg.textContent = "";
    } catch (error) {
        errorMsg.textContent = error.message;
    }
}

async function findCoordinate(url) {
    try {
        const responseCoordinate = await fetch(url);
        if (!responseCoordinate.ok) {
            throw new Error();
        }

        const coordinate = await responseCoordinate.json();
        if (!coordinate.results || coordinate.results.length === 0) {
            throw new Error();
        }

        const result = coordinate.results[0];
        const latitude = result.latitude;
        const longitude = result.longitude;
        city.textContent = result.name;

        await weatherInfo(latitude, longitude);

    } catch (error) {
        errorMsg.style.color = "red";
        errorMsg.textContent = "Şehir bulunamadı.";
        setTimeout(() => {
            errorMsg.textContent = "";
        }, 2000);
        cityCard.style.display = "none";
    }
}

function searchCity() {
    const cityName = input.value.trim();
    if (cityName === "") {
        errorMsg.style.color = "red";
        errorMsg.textContent = "Lütfen şehir giriniz!";
        cityCard.style.display = "none";
    }
    else {
        findCoordinate(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`)
    }
}

button.addEventListener("click", searchCity);

input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        searchCity();
    }
})

