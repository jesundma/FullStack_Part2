import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {

  //effects and states
  const [countries, setCountries] = useState([])
  const [filterString, setFilterString] = useState('')

  useEffect(( => {
    axios.
      get('https://studies.cs.helsinki.fi/restcountries/', {
        params:
      })
  }))

  return (
    <div>
      <h2>diipadaapa</h2>
    </div>
    )
}

export default App
