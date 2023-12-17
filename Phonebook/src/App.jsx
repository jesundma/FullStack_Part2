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
const FailedDeleteNotification = ( {deleteSuccessful, setDeleteSuccessful} ) => {
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

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterString, setFilter] = useState('')
  const [deleteSuccessful, setDeleteSuccessful] = useState(null)
  const [addSuccessful, setAddSuccessful] = useState(null)

  useEffect(() => {
    serverCommunication.fetchData(setPersons)
  }, [])

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
    serverCommunication.addPerson(newName, newNumber, persons, setPersons, setNewName, setNewNumber);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <FailedDeleteNotification deleteSuccessful={deleteSuccessful} />
      <Filter filterString={filterString} handleFilterChange={handleFilterChange} />
      <PersonForm
        addPerson={handleAddPerson}
        newName={newName}
        handleNameAddition={handleNameAddition}
        newNumber={newNumber}
        handleNumberAddition={handleNumberAddition}
      />
      <h2>Numbers</h2>
      <PresentPersons persons={persons} filterString={filterString} setPersons={setPersons} setDeleteSuccessful={setDeleteSuccessful} />
    </div>
  )
}

export default App