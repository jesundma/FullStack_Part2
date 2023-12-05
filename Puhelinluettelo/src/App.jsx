import { useState, useEffect } from 'react'
import axios from 'axios'


// Form for adding and deleting persons

const Form = ({ newName, newNumber, handleNameAddition, handleNumberAddition, addName }) => {
  return (
    <form onSubmit={addName}>
      <div>Name: <input value={newName} onChange={handleNameAddition} /></div>
      <div>Number: <input value={newNumber} onChange={handleNumberAddition} /></div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  )
}

//infomessages

const AddedNotification = ({ message }) => {
  const addMessageStyle = {
    color: 'green',
    fontSize: 16
  }

  if (!message) {
    return null
  }

  return (
    <div style = {addMessageStyle}>
      {message}
    </div>
  )
}

// component for mounting data and refresh

const fetchData = (setPersons) => {
  axios
    .get('http://localhost:3000/api/persons')
    .then(response => {
      setPersons(response.data);
    })
}

// deleting and adding names

const AddName = (persons, setPersons, newName, newNumber, setNewName, setNewNumber, setAddSuccessful) => (event) => {
  event.preventDefault()
  const personObject = {
    name: newName, 
    number: newNumber,
  }
  
  const indexForPerson = persons.findIndex((p) => p.name === personObject.name);

    if (indexForPerson !== -1) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with new one?`)) {
        axios
          .put(`http://localhost:3001/persons/${persons[indexForPerson].id}`, {
          name: newName,  
          number: newNumber
          })
          fetchData(setPersons)
      }
      setAddSuccessful(true)
    } else {
      axios
        .post('http://localhost:3001/persons', personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setAddSuccessful(true)
        })
    }
  setNewNumber('')

}

const DeleteName = (id, name, statePersons) => {
  
  if (window.confirm(`${name} delete`)) {
    axios
      .delete(`http://localhost:3001/persons/${id}`)
      .then(response => {
        fetchData(statePersons)
      })
  }

}

// filters and presenting data

const FilterData = (persons, filter) => {
  
  return persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

}

const PresentData = ({persons, filter, statePersons}) => {

  try {

  const personsFiltered = FilterData(persons, filter)

  return (
    <ul>
        {personsFiltered.map(personsFiltered => 
          <li key={personsFiltered.id}>
          {personsFiltered.name} {personsFiltered.number} <button onClick={() => DeleteName(personsFiltered.id, personsFiltered.name, statePersons)}>Delete</button>
          </li>
        )}
      </ul>
  )}
  catch(err) {
    return
  }
}

const App = () => {

  // Effects and states

  const [persons, setPersons] = useState()
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState('')
  const [addSuccessful, setAddSuccessful] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState(null)

// refresh data

  useEffect(() => {
    fetchData(setPersons)
  }, [])

// info message on add for 2 seconds

  useEffect(() => {
    if (addSuccessful) {
      setNotificationMessage(`${newName} add here`)
  
      const timerForInfo = setTimeout(() => {
        setNotificationMessage(null)
        setAddSuccessful(false)
        setNewName('')
      }, 2000)
  
      return () => {
        clearTimeout(timerForInfo)
      }
    }
  }, [addSuccessful, newName])

  // Event handlers

  const handleNameAddition = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberAddition = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setShowAll(event.target.value)
  }

  // Web page

  return (
    <div>
      <h2>Phonebook</h2>
      <AddedNotification message={notificationMessage} />
      <div>Filter shown with: <input value={showAll} onChange= {handleFilterChange}/></div>
      <h3>Add a new</h3>
      <Form
        newName={newName}
        newNumber={newNumber}
        handleNameAddition={handleNameAddition}
        handleNumberAddition={handleNumberAddition}
        handleFilterChange={handleFilterChange}
        addName={AddName(persons, setPersons, newName, newNumber, setNewName, setNewNumber, setAddSuccessful)}
      />
      <h2>Numbers</h2>
        <PresentData persons = {persons} filter= {showAll} statePersons = {setPersons}/>
    </div>
  )

}

export default App