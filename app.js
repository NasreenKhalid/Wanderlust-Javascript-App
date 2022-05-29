const venue = document.getElementById("venue");
const submitBtn = document.querySelector("#btn");
const weatherinfo = document.querySelector(".weather-info");
const venueinfo = document.querySelector(".venue-info");
const errorDiv = document.querySelector(".error");
const API_KEY = "c3ced497d87fe48e4beb953b02da8b21";
const clientId = "GVGPRMLDJEQWI40B2AWXSRMU34T3SNZ3YT42KLWG0JNPTDXE";
const clientSecret = "GOLVUO32TKPHUETFGQXWS2ECG0YKBVYV4VU3G2EIMKUZ3C3C";

submitBtn.addEventListener("click", function getDetails(e) {
  e.preventDefault();

  if (venue.value) {
    const fetchData = async () => {
      try {
        const [respOne, respTwo] = await Promise.all([
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${venue.value}&appid=${API_KEY}`
          ),
          fetch(
            `https://api.foursquare.com/v2/venues/search?client_id=${clientId}&client_secret=${clientSecret}&v=20190425&near=${venue.value}&intent=browse&radius=10000&query=${venue.value}&limit=10`
          ),
        ]);
        const weatherData = await respOne.json();
        const venueData = await respTwo.json();
        console.log(weatherData, "todoOne");
        console.log(venueData, "todoTwo");
        console.log(weatherData.cod);
        if (weatherData.cod == "404") {
          errorDiv.style.display = "block";
          errorDiv.innerHTML += `City not found`;

          setTimeout(() => {
            errorDiv.style.display = "none";
          }, 2000);
        }
        showResults(weatherData, venueData);
      } catch (err) {
        throw err;
      }
    };

    fetchData();
  }

  venue.value = "";
});

function showResults(weatherData, venueData) {
  weatherinfo.innerHTML = `
        <h2>City: ${weatherData.name}</h2> <h2>Country: ${
    weatherData.sys.country
  }</h2>
        <h2>Temp Min: ${(weatherData.main.temp_min - 273.15).toFixed(2)}C</h2>
        <h2>Temp Max: ${(weatherData.main.temp_max - 273.15).toFixed(2)}C</h2>
        <h2>Weather: ${weatherData.weather[0].main}</h2>
        <h2>${new Date().toISOString().slice(0, 10)}</h2>
        
        `;
  console.log(venueData.response.venues);
  venueData.response.venues.forEach((elem) => {
    venueinfo.innerHTML += `
         <div class="card">
         <h2>${elem.name}</h2>
         <h3>Address: ${elem.location.address}</h3>
         <h3>Category: ${elem.categories[0].name}</h3>
    
    
         </div>
         `;
  });
}
