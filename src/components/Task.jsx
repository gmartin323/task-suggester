import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'

/* props needed 

todo
toggleIsCompleted
updateTodo
focusInput
deleteTodo

*/

export default function Task({todo, toggleIsCompleted, updateTodo, focusInput, deleteTodo}) {

  

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
          className={todo.isCompleted ? "todo-text lower-opacity" : "todo-text"}
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
            icon={faXmark}
            pointerEvents={"none"}
          />}
        </button>
      </div>
  )
}