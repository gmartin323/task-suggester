import React from "react";
import {
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  setDoc
} from "firebase/firestore"
import { todoCollection } from "../firebase";

export default function Todo() {
  const [currentTodo, setCurrentTodo] = React.useState("")
  const [todos, setTodos] = React.useState([])

  const todosEl = todos.map((todo) => {
    return (
      <p>{todo}</p>
    )
  })

  function updateCurrentTodo(event) {
    setCurrentTodo(event.target.value)
  }

  function addTodo() {
    setTodos((prevTodos) => {
      return [...prevTodos, currentTodo] //add new ... to end of array
    })
    setCurrentTodo("")
  }

  console.log(todos)

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
        value={currentTodo}
        onChange={updateCurrentTodo}
        onKeyDown={() => {(event.key === 'Enter') ? addTodo() : null}}
      />
      <button onClick={addTodo}> Add + </button>
    </div>
  )
}