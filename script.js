

// A function to fetch and display the country info
async function getCountryInfo() {
const name = document.getElementById("name");
  
if (!name) {
alert("Field is empty"); // Error handling, empty field
return; // Terminate the program here sinc there is nothing in the field.
  }

  const url = `https://restcountries.com/v3.1/name/${name}?fields=name,flags,population,borders`; // Fetch data by parameter name

try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }

    const info = await res.json();

    // If the country's info is available, display the revelant fields.
    if (info && info.length > 0) {
      const country = info[0];
      document.getElementById("country-info").innerHTML = `
        <h3>Country: ${country.name.common}</h3>
        <img src="${country.flags.png}" width="100">
        <p>Population: ${country.population.toLocaleString()}</p>`;

      if (country.borders && country.borders.length > 0) {
        getBorderingCountries(country.borders);
      } 
        
else {
        document.getElementById("bordering-countries").innerHTML = "<p>No bordering countries available.</p>";}

      
    }
    else {
  alert("This requested country was not found");}
    
  } 
    catch (error) {
  alert("Fetching this country's info presents an error");
  return; // Since there is an error fetching the country's info, terminate the programme
  }
}

// This function takes the relevant country and fetches the relevant bordering country information.
async function getBorderingCountries(borders) {
  if ( borders.length === 0 || !borders) { //No bordering country was found, hence length === 0
    console.error("No bordering countries were found.");
    document.getElementById("bordering-countries").innerHTML = "<p>No bordering countries were found.</p>";
    return; // If no array of borders is empty, terminate the program immediately. Else if it is found, try/catch.
  }

  try {
    // Promise.all to fetch data for country's borders that is iterable and returns it as once promise/ in this context a map.
    const borderingCountries = await Promise.all(
      borders.map(async (border) => {
    const url = `https://restcountries.com/v3.1/alpha/${border}`;
      console.log(`Fetching the information on the bordering country called...${border}`); // Debug fetch border ccuntry..

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Fetching the neigbouring countries' info presents an error`);
        }
      const data = await res.json();
        return data[0];
      })
    );

    //Since the bordering countries were found, you must display the relevant information.
    const sectionBorderingCountriesInfo = document.getElementById("bordering-countries");
    sectionBorderingCountriesInfo.innerHTML = "<h3>Bordering Countries:</h3>";
    //Iterate through JSON array
    sectionBorderingCountriesInfo.forEach(country => {
    sectionBorderingCountriesInfo.innerHTML += `
        <p>
        <strong>Country:</strong> ${country.name.common}
        <img src="${country.flags.png}" width="50">
        </p>`;
    });
} 
catch (error) {
    console.error("There is an error in fetching the bordering countries' info :", error);
    document.getElementById("bordering-countries").innerHTML = "<p>There is an error in fetching the bordering countries' info.</p>";}
}

// Prompt the click button so that if can go through getCountryInfo > getBorderingCountriesInfo
document.getElementById("submit").onclick = getCountryInfo;
