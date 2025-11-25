import axios from 'axios';
import { useState, useEffect } from 'react';

const weatherApiKey = import.meta.env.VITE_WEATHER_KEY;
const baseURL = 'https://studies.cs.helsinki.fi/restcountries/api/';

function getWeatherURL(lat, lon) {
  return ('https://api.openweathermap.org/data/2.5/weather?' + 
          `lat=${lat}&`+ 
          `lon=${lon}&`+
          'units=metric&' +
          `appid=${weatherApiKey}`
  );
}

function getWeatherIcon(data) {
  return (`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
}

function Weather({ data }) {
  if (!data) {
    return (
      <div>
        No available
      </div>
    );
  }

  return(
    <div>
      <div>Temperature {data.main.temp} Celsius</div>
      <img src={ getWeatherIcon(data) } 
            alt={data.weather[0].description}></img>
      <div>Wind {data.wind.speed} m/s</div>
    </div>
  );
}

function CountryData({ country }) {
  const [weather, setWeather] = useState(null);

  const flagStyle = {
    borderStyle: 'solid',
    borderWidth: 'thin',
    borderColor: 'black',
  };

  useEffect(() => {
    axios.get(getWeatherURL(...country.capitalInfo.latlng))
          .then(response => {
            setWeather(response.data);
          })
          .catch(err => {
            setWeather(null);
          });
  }, []);

  const languages = Object.keys(country.languages).map(lang => {
    return (
      <li key={lang}>
        {country.languages[lang]}
      </li>
    );
  });

  return (
    <div>
      <h2>{country.name.official}</h2>
      <div>Common Name: {country.name.common}</div>
      <div>Capital: {country.capital}</div>
      <div>Area: {country.area}</div>
      <h2>Languages</h2>
      <ul>
        {languages}
      </ul>
      <img src={ country.flags.png } alt={country.flags.alt} style={ flagStyle }></img>
      <h2>Weather in {country.capital}</h2>
      <Weather data= { weather }/>
    </div>
  );
}

function CountryInfo({ country, prefix, show, onShowClick }) {
  let name = country.name.official;

  if (country.name.common.toLowerCase().startsWith(prefix)) {
    name = country.name.common;
  }

  return (
    <div key={country.name.official}>
      {show ? <CountryData country={ country } /> : name }
      <button onClick={ onShowClick }>{show ? 'close' : 'show'}</button>
    </div>
  );
}

function CountriesInfo({ countries, prefix, show, onShowClick }) {
  if (countries.length > 10) {
    return(
      <div>
        Too many matches, specify another filter
      </div>
    );
  } else if (countries.length > 1) {
    return (   
      countries.map((country, i) => {
                      return (
                        <CountryInfo 
                        key={country.name.common}
                        country={ country }
                        prefix={ prefix }
                        show={ show[i] } 
                        onShowClick={ () => onShowClick(i) }/>
                      )
                    })
    );
  } else if (countries.length > 0) {
    return (
      <div>
        <CountryData country={ countries[0] } />
      </div>
    );
  } else { 
    return(
      <div>
        No matches found.
      </div>
    );
  }
}

function SearchBox({value, onValueChange}) {
  function handleValueChange(event) {
    let input = event.target.value;
    onValueChange(input.replace(/\s+/g, ' ').trimStart());
  }

  return(
    <div>
      <label>find countries: </label>
      <input value={ value } onChange={ handleValueChange }></input>
    </div>
  );
}

function App() {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [showArray, setShowArray] = useState(Array(10).fill(false));

  useEffect(() => {
    axios
    .get(baseURL + 'all')
    .then(response => {
      setCountries(response.data);
    })
    .catch(error => {
      console.log(error);
    });
  }, []);
  
  function handleQueryChage(query) {
    setQuery(query);
    setShowArray(Array(10).fill(false));
  }

  function handleShowClick(index) {
    let newArray = [...showArray];
    newArray[index] = !showArray[index];
    setShowArray(newArray);
  }

  const prefix = query.toLowerCase();

  const results = countries.filter(country => {
    if (prefix === '') {
        return false;
    }
    
    let commonName = country.name.common.toLowerCase();
    let officialName = country.name.official.toLowerCase();

    if (commonName.startsWith(prefix) || officialName.startsWith(prefix)) {
      return true
    }

    return false;
  });

  return (
    <div>
      <SearchBox value={ query } onValueChange={ handleQueryChage }/>
      <CountriesInfo countries={ results } 
                     prefix={ prefix }
                     show={ showArray }
                     onShowClick={ handleShowClick }/>
    </div>
  );
}

export default App
