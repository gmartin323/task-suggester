import React from "react";
import {
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  setDoc
} from "firebase/firestore"
import { todoCollection } from "../firebase";

// To-Do //

// I. Save to database collection in addTodo function
// II. Each item needs: 
        // a. text content
        // b. createdAt time using Date.now()
        // c. updatedAt time using Date.now()
        // d. isCompleted: true/false -> toBeChanged when user clicks completed button
        // e. id: -> in order to identify when deleting/editing
// III. Get data from database when page loads
// IV. Delete from database when user compltes 'delete' action (icon click? / menu selection? / swipe and click icon?)  
// V. Allow user to edit todos in place -> property (contentEditable) on p element? ->

export default function Todo() {
  const [currentTodoText, setCurrentTodoText] = React.useState("")
  const [todos, setTodos] = React.useState([])

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

  const todosEl = todos.map((todo) => {
    return (
      <p /* contentEditable="true" */>{todo.text}</p>
    )
  })

  function updateCurrentTodoText(event) {
    setCurrentTodoText(event.target.value)
  }

  function addTodo() {
    setTodos((prevTodos) => {
      return [...prevTodos, currentTodoText]
    })
    setCurrentTodoText("")
  }

  async function addNewTodo() {
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