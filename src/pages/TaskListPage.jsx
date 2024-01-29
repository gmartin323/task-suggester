import React from 'react'
import TaskList from '../components/TaskList'

import {
  addDoc,
  doc,
  deleteDoc,
  setDoc
} from "firebase/firestore"
import { todoCollection, db } from "../firebase";

export default function TaskListPage( { todos, toggleIsCompleted, incompleteTasks, setShowSuggestedTask }) {
  const [currentTodoText, setCurrentTodoText] = React.useState("")
  const [isTaskBeingEdited, setIsTaskBeingEdited] = React.useState(false)

  const inputRef = React.useRef()

  /* React.useEffect(() => {
    inputRef.current.focus()
  }, []) */

  function focusInput() {
    inputRef.current.focus()
    // window.scrollTo({
    //   top: (inputRef.current.offsetTop - 180),
    //   behaviour: "smooth"
    // })
    inputRef.current.scrollIntoView({behavior: "smooth"}) // found better (?) method
  }

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

  async function updateTodo(event) {
    setIsTaskBeingEdited(false)
    const todoId = event.target.dataset.text
    const newText = event.target.innerText
    const docRef = doc(db, "todo" , todoId)
    await setDoc(docRef,  { text: newText, updatedAt: Date.now()} , { merge: true })
  }

  async function deleteTodo(event) {
    const todoId = event.target.dataset.delete
    const docRef = doc(db, "todo", todoId)
    await deleteDoc(docRef)
  }

  function suggestTask() {
    setShowSuggestedTask(true)
  }

  return (
    <div className="page-container ">
      <h1 className="header">Today's tasks</h1>
      <TaskList 
        todos={todos}
        focusInput={focusInput}
        toggleIsCompleted={toggleIsCompleted}
        setIsTaskBeingEdited={setIsTaskBeingEdited}
        updateTodo={updateTodo}
        deleteTodo={deleteTodo}
      />
      <div className="input-container">
        <input 
          type="text"
          name="new-todo-input"
          className="todo-input"
          placeholder="New task..."
          autoComplete="off"
          ref={inputRef}
          value={currentTodoText}
          onChange={updateCurrentTodoText}
          onKeyDown={() => {(event.key === 'Enter') && currentTodoText.trim() ? addNewTodo() : null}}
          />
        {/* <button 
          onClick={addNewTodo}
          className={currentTodoText ? "add-todo-btn" : "add-todo-btn disabled"}
        >
          <FontAwesomeIcon 
            icon={faPlus}
            pointerEvents={"none"}
            style={currentTodoText ? {color: "#6D53EE"} : {color: "#BDB4CF"}}
          />
        </button> */}
      </div>
      {currentTodoText.trim() ? 
        <button
          onClick={addNewTodo}
          className='add-task-btn btn'
        >
          Add Task
        </button>
        :
      isTaskBeingEdited ? 
        <button
          onClick={updateTodo}
          className='add-task-btn btn'
        >
          Update Task
        </button>
        :
      todos.length > 0 && incompleteTasks !== 0 ? 
        <button 
          className={"suggest-task-btn btn"}
          onClick={suggestTask}
        >
          Let's go!
        </button>
        :
        null
      }
    </div>
  )
}