import React from 'react'
import shuffleArray from '../utilities/shuffleArray'

export default function SuggestedTask({ todos, completeTodo, setShowSuggestedTask }) {

  // X. Create button/page that suggests a task from the list.
  //      a. Get task usiong random number and fetch from database -> save to currentTodo state (include id and content)
  //      b. Display task on full page -> include button to mark as complete
  //      c. When button is clicked, animate/style to show completion and change button to return to task list (clear currentTodo state?)
  //      d. filter already completed tasks before shuffling

  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [shuffledArray, setShuffledArray] = React.useState(shuffleArray(todos.filter((todo) => todo.isCompleted !== true)))

  console.log("shuffledArr", shuffledArray)

  function completeTask(event) {
    const currentTaskId = event.target.dataset.checkbox

    setShuffledArray(shuffledArray.map(task => {
      if (task.id === currentTaskId) {
        return {...task, isCompleted: !task.isCompleted}
      } else {
        return task
      }
    }))

    completeTodo(event)
  }

  return (
    <div className='page-container'>
      <h1>Suggested Task</h1>
      <p className={shuffledArray[currentIndex].isCompleted ? "strikethrough" : ""}>{shuffledArray[currentIndex].text}</p>
      <button
        onClick={completeTask}
        data-checkbox={shuffledArray[currentIndex].id}
      >Complete</button> 
      <div className='buttons-container'>
        <button
          onClick={() => setShowSuggestedTask(false)}
        >
          Return to list
        </button>

        {currentIndex !== (shuffledArray.length - 1) && 
          <button
          onClick={() => setCurrentIndex((prevIndex) => prevIndex + 1)}
          >
            Next
          </button>
        }
      </div>
      
    </div>
  )
}