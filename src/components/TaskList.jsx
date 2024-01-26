import React from 'react'
import Task from './task'

export default function TaskList( { todos, updateTodo, deleteTodo, toggleIsCompleted, focusInput } ) {

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
            focusInput={focusInput}
          />
        )
      })}
    </div>
  )
}