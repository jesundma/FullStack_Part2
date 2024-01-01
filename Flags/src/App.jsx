import { useEffect, useState } from 'react'
import axios from 'axios'

//const api_key_Weather = import.meta.env.WEATHER_KEY, api key in env but undefined when added to call as template literal
//console.log(api_key_Weather)

// component to present country data

const PresentData = ({ countries, filter, setCoordinates, setCapital, country, setCountry }) => {

  if (countries.length === 0) {
    return
  }

  const countryFilter = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  // effect to update capital coordinates and capital for weather report, when number of countries is greater than 1 coordinates and capital set back to null

  useEffect(() => {
    if (countryFilter.length === 1) {
      const resultCountry = countryFilter[0]
      setCoordinates(resultCountry.latlng)
      setCapital(resultCountry.capital)
    } else if (countryFilter.length > 1) {
      setCoordinates(null)
      setCapital(null)
    }
  }, [countryFilter, setCoordinates, setCapital])

  if (countryFilter.length > 10) {

    return <div>Too many matches, specify another filter</div>
    }
    if (countryFilter.length > 1) {
      return (
        <ul>
          {countryFilter.map((countrySelect, index) => (
            <li key={index}>
              {countrySelect.name.common} <button>show</button>
            </li>
          ))}
        </ul>
      )} else if (countryFilter.length === 1) {
      
        const resultCountry = countryFilter[0]
        const languages = Object.values(resultCountry.languages)

        return (
        <div>
          <p style={{ fontSize: 30, fontWeight: 'bold' }}>{resultCountry.name.official}</p>
          <p>
            Capital {resultCountry.capital}<br/>
            Area {resultCountry.area}
          </p>
          <p style={{ fontSize: 22, fontWeight: 'bold' }}>
            languages:
          </p>
          <ul>
            {languages.map((language)=> (
              <li>
                {language}
              </li>
            ))}
          </ul>
          <p>
            <img src={resultCountry.flags.png} alt="Flag" />
          </p>
        </div>
      )}
  }

//component to show weather data

const PresentWeather = ({ weather, capital }) => {
  if(weather) {
    
    let celsiusTemperature = (weather.main.temp - 273.15).toFixed(2)
    let windSpeed = weather.wind.speed.toFixed(2)

    return (
      <div>
        <p style={{ fontSize: 26, fontWeight: 'bold' }}>Weather in {capital} </p>
        <p>
          Temperature {celsiusTemperature} celcius
        </p>
        <p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Weather Icon" />
        </p>
        <p>
          Wind {windSpeed} m/s
        </p>
      </div>
    )
  } else {
    return <div></div>
  }
}

//6ed6cf961d8fb39be725f80e53f09adc api key


function App() {

  //effects and states
  const [countries, setCountries] = useState([])
  const [filterString, setFilterString] = useState('')
  const [coordinates, setCoordinates] = useState(null) // set capital coordinates when country is selected
  const [country, setCountry] = useState(null) // set country either by narrowing to one result or by selecting
  const [capital, setCapital] = useState(null) //set (lock) country capital when country selected
  const [weather, setWeather] = useState(null) // effect when country capital coordinates are set

  useEffect(() => {
    axios.get(`https://restcountries.com/v3.1/all`).then((response) => {
      setCountries(response.data)
      })
    }, []
  )
  useEffect(() => {
    if(coordinates) {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=6ed6cf961d8fb39be725f80e53f09adc`)
        .then((response) => {
          setWeather(response.data);
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error)
        })
      }
  }, [coordinates])

  const handleFilterChange = (event) => {
    setFilterString(event.target.value)
  }
  
  return (
    <div>
      <div>Find country: <input value={filterString} onChange= {handleFilterChange}/></div>
      <div><PresentData countries= {countries} filter= {filterString} setCoordinates= {setCoordinates} setCapital= {setCapital} country= {country} setCountry= {setCountry}/></div>
      {capital !== null ? <div><PresentWeather weather={weather} capital={capital} /></div> : <div></div>}</div>
    )
}

export default App
