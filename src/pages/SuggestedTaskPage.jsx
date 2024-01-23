import React from 'react'
import shuffleArray from '../utilities/shuffleArray'

export default function SuggestedTask({ todos, setShowSuggestedTask }) {

  // X. Create button/page that suggests a task from the list.
  //      a. Get task usiong random number and fetch from database -> save to currentTodo state (include id and content)
  //      b. Display task on full page -> include button to mark as complete
  //      c. When button is clicked, animate/style to show completion and change button to return to task list (clear currentTodo state?)

  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [shuffledArray, setShuffledArray] = React.useState(shuffleArray(todos))

  return (
    <div className='page-container'>
      <h1>Suggested Task</h1>
      <p>{shuffledArray[currentIndex].text}</p> 
      <div className='buttons-container'>
        <button
          onClick={() => setShowSuggestedTask(false)}
        >
          Return to list
        </button>

        {currentIndex !== (todos.length - 1) && 
          <button
          onClick={() => setCurrentIndex((prev) => prev+1)}
          >
            Next
          </button>
        }
      </div>
      
    </div>
  )
}