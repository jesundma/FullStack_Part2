const Course = (props) => {
  
  const { course } = props

  return (
    <div>
        {course.map(course =>
          <div key = {course.id}> 
           <Header name = {course}/>
           <Content parts = {course.parts} />
           </div>
        )}
    </div>
  )
}

const Header = (props) => {
  return (
    <div key = {props.id} style = {{fontSize: 26, fontWeight: "bold"}}>
      {props.name.name}
    </div>
  )
}

const Content = (props) => {
  
  return (
    <Parts parts={props.parts}/>
  )
}

//Check how calculated directly from props (contains name -> parts -> exercises)
const Total = (props) => {
  return props.total.reduce((accumulator, part) => accumulator + part.exercises, 0)
}

const Parts = (props) => {

    return (
      <div>
          {props.parts.map(part => 
            <p key = {part.id}>
            {part.name} {part.exercises}
            </p>
           )}
      <strong>Total of <Total total={props.parts}/> Exercises</strong>
      <p></p>
    </div>   
    )
}

export default Course