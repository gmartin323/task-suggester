import React from 'react'
import Task from './Task'

export default function TaskList( { todos, updateTodo, deleteTodo, toggleIsCompleted, setIsTaskBeingEdited, focusInput } ) {

  return (
    <div className="todos-container">
      {todos.map((todo) => {
        return (
          <Task 
            key={todo.id}
            todo={todo}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            toggleIsCompleted={toggleIsCompleted}
            setIsTaskBeingEdited={setIsTaskBeingEdited}
            focusInput={focusInput}
          />
        )
      })}
    </div>
  )
}