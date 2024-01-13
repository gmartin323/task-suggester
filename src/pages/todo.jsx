import React from "react";
import {
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  getDoc,
  setDoc
} from "firebase/firestore"
import { todoCollection, db } from "../firebase";

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
// VI. setFocus to input when page loads, when new todo is added and when todo is updated
// vII. Allow user to toggle completed using icon click

export default function Todo() {
  const [todos, setTodos] = React.useState([])
  const [currentTodoText, setCurrentTodoText] = React.useState("")

  const inputRef = React.useRef()

  React.useEffect(() => {
    inputRef.current.focus()
  }, [])

  function focusInput() {
    inputRef.current.focus()
  }

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
      focusInput()
    }
  }

  async function deleteTodo(event) {
    const todoId = event.target.dataset.delete
    const docRef = doc(db, "todo", todoId)
    await deleteDoc(docRef)
  }

  async function updateTodo(event) {
    const todoId = event.target.dataset.text
    const newText = event.target.innerText
    const docRef = doc(db, "todo" , todoId)
    await setDoc(docRef,  { text: newText, updatedAt: Date.now()} , { merge: true })
  }

  async function toggleIsCompleted() {
    const todoId = event.target.dataset.checkbox
    const docRef = doc(db, "todo" , todoId)
    const docSnap = await getDoc(docRef)
    const currentTodoData = docSnap.data()
    await setDoc(docRef, { isCompleted: !currentTodoData.isCompleted } , { merge: true })
  }

  const todosEl = todos.map((todo) => {
    return (
      <div className="todo" key={todo.id}>
        <button
          className="todoCompleteBtn"
          onClick={toggleIsCompleted}
          data-checkbox={todo.id}
        >
          <FontAwesomeIcon 
            icon={todo.isCompleted ? faSquareCheck : faSquare} 
            pointerEvents={"none"}
          /> 
        </button>
        <p
          className={todo.isCompleted ? "strikethrough" : ""}
          onBlur={updateTodo}
          onKeyDown={() => {(event.key === 'Enter') ? focusInput() : null}}
          data-text={todo.id}
          contentEditable="true"
          suppressContentEditableWarning
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
          />}
        </button>
      </div>
    )
  })

  return (
    <div className="page-container">
      <div className="todos-container">
        {todosEl}
      </div>
      <input 
        type="text"
        placeholder="Type here"
        name="new-todo-input"
        ref={inputRef}
        value={currentTodoText}
        onChange={updateCurrentTodoText}
        onKeyDown={() => {(event.key === 'Enter') ? addNewTodo() : null}}
      />
      <button onClick={addNewTodo}> Add + </button>
    </div>
  )
}