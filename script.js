

// Function to fetch and display country info
async function getCountryInfo() {
  const name = document.getElementById("name").value.trim();
  
  if (!name) {
    alert("Field is empty"); // Error handling, empty field
    return;
  }

  const url = `https://restcountries.com/v3.1/name/${name}?fields=name,flags,population,borders`; // Fetch data by parameter name

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    // Display country-info
    if (json && json.length > 0) {
      const country = json[0];
      document.getElementById("country-info").innerHTML = `
        <h3>Country: ${country.name.common}</h3>
        <img src="${country.flags.png}" width="100">
        <p>Population: ${country.population.toLocaleString()}</p>
      `;

      // Log the borders for debugging
      console.log("Borders:", country.borders);

      // Fetch and display bordering countries if any
      if (country.borders && country.borders.length > 0) {
        fetchBorderingCountries(country.borders);
      } else {
        document.getElementById("bordering-countries").innerHTML = "<p>No bordering countries found.</p>";
      }
      
    } else {
      alert("Country was not found");
    }
  } catch (error) {
    console.error(error.message);
    alert("Error fetching data.");
    return;
  }
}

//Fetch all neighbouring countreies method
async function fetchBorderingCountries(borders) {
  if (!borders || borders.length === 0) { //No countries
    console.error("No borders data available.");
    document.getElementById("bordering-countries").innerHTML = "<p>No bordering countries found.</p>";
    return;
  }

  try {
    // Promise.all to fetch data for country's borders iterably
    const borderingCountries = await Promise.all(
      borders.map(async (border) => {
        const url = `https://restcountries.com/v3.1/alpha/${border}`;
        console.log(`All fetch border country...: ${border}`); // Debug fetch border ccuntry..

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch data for country`);
        }

        const data = await response.json();
        return data[0];
      })
    );

    // Display the bordering countries
    const borderingCountriesSection = document.getElementById("bordering-countries");
    borderingCountriesSection.innerHTML = "<h3>Bordering Countries:</h3>";
    //Iterate through JSON array
    borderingCountries.forEach(country => {
      borderingCountriesSection.innerHTML += `
        <p>
          <strong>Country:</strong> ${country.name.common}
          <img src="${country.flags.svg}" width="50">
        </p>`;
    });
  } catch (error) {
    console.error("Error fetching the bordering countries:", error);
    document.getElementById("bordering-countries").innerHTML = "<p>Error fetching data for the bordering countries.</p>";
  }
}

// Attach the onclick event to the submit button
document.getElementById("submit").onclick = getCountryInfo;
