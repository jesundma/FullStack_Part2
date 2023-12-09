import { useEffect, useState } from 'react'
import axios from 'axios'

const FilterData = (countries, filter) => {
  return countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
}

const PresentData = ({countries, filter, stateCountries}) => {

  try {

    const countriesFiltered = FilterData(countries, filter)

  if(countriesFiltered.length > 1) {
    if(countriesFiltered.length > 10) {
      return <div>Too many matches, specify another filter</div>
    } 
    return (
      <ul>
          {countriesFiltered.map(countriesFiltered => 
            <li key={countriesFiltered.id}>
            {countriesFiltered.name.common}
            </li>
          )}
        </ul>
    )} else {
      const result = countriesFiltered[0]
      return (
        <div>
          {result.name.official}
          <p>
            Capital {result.capital}
          </p>
          <p>
            Area {result.area}
          </p>
          <p>
          <img src={result.flags.png}/>
          </p>
        </div>
      )
    }
  }
  
  catch(err) {
    return []
  }
}

function App() {

  //effects and states
  const [countries, setCountries] = useState([])
  const [filterString, setFilterString] = useState('')

  useEffect(() => {
    axios.get(`https://restcountries.com/v3.1/all`).then((response) => {
      setCountries(response.data)
      })
    }, []
  )

  const handleFilterChange = (event) => {
    setFilterString(event.target.value)
  }
  
  return (
    <div>
      <h2>diipadaapa</h2>
      <div>Find country: <input value={filterString} onChange= {handleFilterChange}/></div>
      <PresentData countries = {countries} filter= {filterString} stateCountries = {setCountries}/>
    </div>
    )
}

export default App
