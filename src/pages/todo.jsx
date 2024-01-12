import React from "react";
import {
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  setDoc
} from "firebase/firestore"
import { todoCollection, db } from "../firebase";

// import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'



// To-Do //

// I. Save to database collection in addTodo function
// II. Each item needs: 
        // a. text content
        // b. createdAt time using Date.now()
        // c. updatedAt time using Date.now()
        // d. isCompleted: true/false -> toBeChanged when user clicks completed button
        // e. id: -> in order to identify when deleting/editing
// III. Get data from database when page loads
// IV. Delete from database when user completes 'delete' action (icon click? / menu selection? / swipe and click icon?)  
// V. Allow user to edit todos in place -> property (contentEditable) on p element? ->

export default function Todo() {
  const [todos, setTodos] = React.useState([])
  const [currentTodoText, setCurrentTodoText] = React.useState("")

  React.useEffect(() => {
    const unsubscribe = onSnapshot(todoCollection, function(snapshot) {
      const todoArr = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setTodos(todoArr)
    })
    return unsubscribe
  }, [])

  console.log(todos)

  function toggleIsCompleted() {
    // toggle isCompleted property of targeted todo item in firebase
  }

  async function deleteTodo(event) {
    // console.log("dataset", event.target.dataset.delete)
    const todoId = event.target.dataset.delete
    const docRef = doc(db, "todo", todoId)
    await deleteDoc(docRef)

  }

  const todosEl = todos.map((todo) => {
    return (
      <div className="todo" key={todo.id}>
        {todo.isCompleted ? 
          <FontAwesomeIcon 
            icon={faSquareCheck} 
            onClick={toggleIsCompleted}
          /> : 
          <FontAwesomeIcon 
            icon={faSquare} 
            onClick={toggleIsCompleted}
          />
        }
        <p
          /* contentEditable="true" */
        >
          {todo.text}
        </p>
        <button
          className="todoDeleteBtn"
          onClick={deleteTodo}
          data-delete={todo.id}
        >
          {<FontAwesomeIcon 
            icon={faTrashCan}
            pointerEvents={"none"}
            // onClick={deleteTodo}
            // data-delete={todo.id}
          />}
        </button>
      </div>
    )
  })

  function updateCurrentTodoText(event) {
    setCurrentTodoText(event.target.value)
  }

  async function addNewTodo() {
    if (currentTodoText !== "") {
      const newTodo = {
        text: currentTodoText,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isCompleted: false,
        // firebase will set an id when creating the document
      }
      await addDoc(todoCollection, newTodo)
      setCurrentTodoText("")
    }
  }

  return (
    <div className="page-container">
      <h1>To-do list</h1>
      <div className="todos-container">
        {todosEl}
      </div>
      <input 
        type="text"
        placeholder="Type here"
        name="new-todo-input"
        value={currentTodoText}
        onChange={updateCurrentTodoText}
        onKeyDown={() => {(event.key === 'Enter') ? addNewTodo() : null}}
      />
      <button onClick={addNewTodo}> Add + </button>
    </div>
  )
}