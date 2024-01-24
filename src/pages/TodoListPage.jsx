import React from "react";
import SuggestedTask from "./SuggestedTaskPage";
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
import { faSquareCheck, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons'
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

// VIII. Refactor into smaller components.
// IX. Debouncing updates -> see scrimba lessons -> (Unnecessary in this app as the database is not updated too often)
// X. Create button/page that suggests a task from the list.
//      a. Get task usiong random number and fetch from database -> save to currentTodo state (include id and content)
//      b. Display task on full page -> include button to mark as complete
//      c. When button is clicked, animate/style to show completion and change button to return to task list (clear currentTodo state?)

export default function TodoList() {
  const [todos, setTodos] = React.useState([])
  const [showSuggestedTask, setShowSuggestedTask] = React.useState(false)
  const [currentTodoText, setCurrentTodoText] = React.useState("")

  const inputRef = React.useRef()

  React.useEffect(() => {
    inputRef.current.focus()
  }, [])

  function focusInput() {
    inputRef.current.focus()
    // window.scrollTo({
    //   top: (inputRef.current.offsetTop - 180),
    //   behaviour: "smooth"
    // })
    inputRef.current.scrollIntoView({behavior: "smooth"}) // found better (?) method
  }

  React.useEffect(() => {
    const unsubscribe = onSnapshot(todoCollection, function(snapshot) {
      const todoArr = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      const sortedTodos = todoArr.sort((a, b) => a.createdAt - b.createdAt)
      setTodos(sortedTodos)
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

  async function toggleIsCompleted(event) {
    const todoId = event.target.dataset.checkbox
    const docRef = doc(db, "todo" , todoId)
    const docSnap = await getDoc(docRef)
    const currentTodoData = docSnap.data()
    await setDoc(docRef, { isCompleted: !currentTodoData.isCompleted } , { merge: true })
  }

  function suggestTask() {
    setShowSuggestedTask(true)
  }

  const incompleteTasks = todos.filter(todo => todo.isCompleted === false).length

  const todosEl = todos.map((todo) => {
    return (
      <div className="todo" key={todo.id}>
        <button
          className="todo-complete-btn"
          onClick={toggleIsCompleted}
          data-checkbox={todo.id}
        >
          <FontAwesomeIcon 
            icon={todo.isCompleted ? faSquareCheck : faSquare} 
            pointerEvents={"none"}
          /> 
        </button>
        <p
          className={todo.isCompleted ? "strikethrough todo-text" : "todo-text"}
          onBlur={updateTodo}
          onKeyDown={() => {(event.key === 'Enter') ? focusInput() : null}}
          data-text={todo.id}
          contentEditable="true"
          suppressContentEditableWarning
        >
          {todo.text}
        </p>
        <button
          className="todo-delete-btn"
          
          onClick={deleteTodo}
          data-delete={todo.id}
        >
          {<FontAwesomeIcon 
            // icon={faTrashCan}
            icon={faXmark}
            pointerEvents={"none"}
          />}
        </button>
      </div>
    )
  })

  const TodoListPage = (
    <div className="page-container ">
      {/* {incompleteTasks === 0 && 
        <div className="ribbon"><span>Complete!</span></div>
     } */}
      <h1 className="header">Today's tasks</h1>
      <div className="todos-container">
        {todosEl}
      </div>
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
          onKeyDown={() => {(event.key === 'Enter') ? addNewTodo() : null}}
          />
        <button 
          onClick={addNewTodo}
          className={currentTodoText.length > 0 ? "add-todo-btn" : "add-todo-btn disabled"}
        >
          <FontAwesomeIcon 
            icon={faPlus}
            pointerEvents={"none"}
            style={currentTodoText.length > 0 ? {color: "#6D53EE"} : {color: "#BDB4CF"}}
          />
        </button>
      </div>
      {todos.length > 0 && incompleteTasks !== 0 ? 
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

  if (showSuggestedTask) {
    return <SuggestedTask 
      todos={todos}
      incompleteTasks={incompleteTasks}
      completeTodo={toggleIsCompleted}
      setShowSuggestedTask={setShowSuggestedTask}
    />
  } else {
    return TodoListPage
  }
}