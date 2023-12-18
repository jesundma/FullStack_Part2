import { useState, useEffect } from 'react'
//serverCommunication is for all correspondance between front-end and server
import serverCommunication from './components/serverCommunication'

// component for UI filtering functionality
const Filter = ({ filterString, handleFilterChange }) => {
  return (
    <div>
      Filter shown with: <input value={filterString} onChange={handleFilterChange} />
    </div>
  )
}

// component to conditionally present notification for failed delete
const FailedDeleteNotification = ( {deleteSuccessful} ) => {
  const addMessageStyle = {
    color: 'red',
    fontSize: 20,
    backgroundColor: 'lightgrey',
    border: '2px solid red',
    padding: '10 px'
  }

  return deleteSuccessful !== null ? (
    <p style = {addMessageStyle}>
      {deleteSuccessful}
    </p>
  ) : null
}

// component to conditinally present notification for successful additon of person

const SuccessfulAdditionNotifation = ( {addSuccessful} ) => {
  const addMessageStyle = {
    color: 'green',
    fontSize: 20,
    backgroundColor: 'lightgrey',
    border: '2px solid green',
    padding: '10 px'
  }

  return addSuccessful !== null ? (
    <p style = {addMessageStyle}>
      {addSuccessful}
    </p>
  ) : null
}

// component for UI adding person
const PersonForm = ({ addPerson, newName, handleNameAddition, newNumber, handleNumberAddition }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameAddition} />
        <br />
        number: <input value={newNumber} onChange={handleNumberAddition} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

// component for presenting persons in UI
const PresentPersons = ({ persons, filterString, setPersons, setDeleteSuccessful }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterString.toLowerCase())
  )
  
  return (
    <ul>
      {filteredPersons.map((person) => (
        <li key={person.id}>
          {person.name} {person.number} <button onClick={() => serverCommunication.deletePerson(person.id, person.name, setPersons, setDeleteSuccessful)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}


const App = () => {

//states and effects

  const [persons, setPersons] = useState(null)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterString, setFilter] = useState('')
  const [deleteSuccessful, setDeleteSuccessful] = useState(null)
  const [addSuccessful, setAddSuccessful] = useState(null)

  useEffect(() => {
    serverCommunication.fetchData(setPersons)
  }, [])

  if (!persons) { 
    return null 
  }

  //handles
  const handleNameAddition = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberAddition = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleAddPerson = (event) => {
    event.preventDefault();
    serverCommunication.addPerson(newName, newNumber, persons, setPersons, setNewName, setNewNumber, addSuccessful, setAddSuccessful);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <FailedDeleteNotification deleteSuccessful={deleteSuccessful} />
      <SuccessfulAdditionNotifation addSuccessful={addSuccessful} />
      <Filter filterString={filterString} handleFilterChange={handleFilterChange} />
      <PersonForm
        addPerson={handleAddPerson}
        newName={newName}
        handleNameAddition={handleNameAddition}
        newNumber={newNumber}
        handleNumberAddition={handleNumberAddition}
        addSuccessful={addSuccessful}
        setAddSuccessful={setAddSuccessful}
      />
      <h2>Numbers</h2>
      <PresentPersons persons={persons} filterString={filterString} setPersons={setPersons} setDeleteSuccessful={setDeleteSuccessful} />
    </div>
  )
}

export default App