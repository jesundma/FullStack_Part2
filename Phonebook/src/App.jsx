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

//infomessages for addition and error on deletion, style depending setMessageType state

const Notification = ({ message, type }) => {
  const addMessageStyle = {
    color: type === 'success' ? 'green' : 'red',
    fontSize: 20,
    backgroundColor: 'lightgrey',
    border: type === 'success' ? '2px solid green' : '2px solid red',
    padding: '10 px'
  }

  if (!message) {
    return null
  }

  return (
    <div style = {addMessageStyle}>
      <p>
      {message}
      </p>
    </div>
  )
}

// component for mounting data and refresh

const fetchData = (setPersons) => {
  axios
    .get('http://localhost:3000/persons')
    .then(response => {
      setPersons(response.data);
    })
}

// deleting and adding names

const AddName = (persons, setPersons, newName, newNumber, setNewName, setDeleteSuccessful, setNewNumber, setAddSuccessful) => (event) => {
  event.preventDefault()
  const personObject = {
    name: newName, 
    number: newNumber,
  }
  
  const indexForPerson = persons.findIndex((p) => p.name === personObject.name);

    if (indexForPerson !== -1) {
      try {
        if(window.confirm(`${newName} is already added to phonebook, replace the old number with new one?`)) {
          axios
            .put(`http://localhost:3000/persons/${persons[indexForPerson].id}`, {
            name: newName,  
            number: newNumber
            })
            fetchData(setPersons)
        }
      } catch {
        setDeleteSuccessful(false)
        console.log(deleteSuccessful)
      }
      setAddSuccessful(true)
    } else {
      axios
        .post('http://localhost:3000/persons', personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setAddSuccessful(true)
        })
    }
  setNewNumber('')

}

const DeleteName = (id, name, statePersons, setDeleteSuccessful) => {
   
  if (window.confirm(`${name} delete`)) {
    axios
      .delete(`http://localhost:3000/persons/${id}`)
      .then(response => {
      fetchData(statePersons)
    })
      .catch(error => {
        setDeleteSuccessful(false)  
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
  const [deleteSuccessful, setDeleteSuccessful] = useState(true)
  const [messageType, setMessageType] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

// refresh data

  useEffect(() => {
    fetchData(setPersons)
  }, [])

// info message on add for 2 seconds

  useEffect(() => {
    if (addSuccessful) {
      setMessageType('success')
      setNotificationMessage(`Add ${newName}`)
  
      const timerForInfo = setTimeout(() => {
        setMessageType(null)
        setNotificationMessage(null)
        setAddSuccessful(false)
        setNewName('')
      }, 2000)
  
      return () => {
        clearTimeout(timerForInfo)
      }
    }
  }, [addSuccessful, newName])

// info message for error in deletion for 2 secongs

  useEffect(() => {
  if (deleteSuccessful === false) {
    setMessageType('error')
    setNotificationMessage(`Delete not ok`)

    const timerForInfo = setTimeout(() => {
      setMessageType(null)
      setNotificationMessage(null)
      setDeleteSuccessful(true)
    }, 2000)

    return () => {
      clearTimeout(timerForInfo)
    }
  }
}, [deleteSuccessful])

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
      <div>
      <Notification message={notificationMessage} type={messageType ? 'success' : 'error'} />
      <br />
      </div>
      <div>Filter shown with: <input value={showAll} onChange= {handleFilterChange}/></div>
      <h3>Add a new</h3>
      <Form
        newName={newName}
        newNumber={newNumber}
        handleNameAddition={handleNameAddition}
        handleNumberAddition={handleNumberAddition}
        handleFilterChange={handleFilterChange}
        addName={AddName(persons, setPersons, newName, newNumber, setDeleteSuccessful, setNewName, setNewNumber, setAddSuccessful)}
      />
      <h2>Numbers</h2>
        <PresentData persons = {persons} filter= {showAll} statePersons = {setPersons}/>
    </div>
  )

}

export default App