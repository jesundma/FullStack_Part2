import axios from 'axios'

// function for mounting and refreshing data 
const fetchData = (setPersons) => {
  axios
    .get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data);
    })
}

// function for verifying that person not already added, to add person, and new number for existing person 
const addPerson = (newName, newNumber, persons, setPersons, setNewName, setNewNumber, addSuccessful, setAddSuccessful) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    const arrayIndex = persons.findIndex(person => person.name.toLowerCase() === newName.toLowerCase())

    if (arrayIndex !== -1) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const changeNewNumber = { ...persons[arrayIndex], number: newNumber }
        axios
          .put(`http://localhost:3001/persons/${changeNewNumber.id}`, changeNewNumber)
          .then(response => {
            setPersons(persons.map(person => person.id !== changeNewNumber.id ? person : response.data))
            fetchData(setPersons)
            setAddSuccessful(`Added ${newName}`)
            setTimeout(() => {
              setAddSuccessful(null);
            }, 3000)
          })
      }
    } else {
      axios
        .post('http://localhost:3001/persons', personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setAddSuccessful(`Added ${newName}`)
          setTimeout(() => {
            setAddSuccessful(null);
          }, 3000)

        })
    }
  
    setNewName('')
    setNewNumber('')
  }

  // function to delete person with Delete- button
  
  const deletePerson = (id, name, statePersons, setDeleteSuccessful) => {
   
    if (window.confirm(`Delete ${name}`)) {
      axios
        .delete(`http://localhost:3001/persons/${id}`)
        .then(response => {
        fetchData(statePersons)
      })
        .catch(error => {
          setDeleteSuccessful(`Information of ${name} has already been removed from the server!`)
          setTimeout(() => {
            setDeleteSuccessful(null)
          }, 5000)
      })
      fetchData(statePersons)
    }
  }

  export default {fetchData, addPerson, deletePerson}