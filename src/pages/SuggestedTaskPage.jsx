import React from 'react'
import shuffleArray from '../utilities/shuffleArray'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faRectangleList } from '@fortawesome/free-regular-svg-icons'
import { faAngleRight, faListCheck, faUndo, faRotateLeft } from '@fortawesome/free-solid-svg-icons'


export default function SuggestedTask({ todos, completeTodo, setShowSuggestedTask }) {

  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [shuffledArray, setShuffledArray] = React.useState(getShuffledIncompleteTasksArray(todos))

  console.log("shuffledArr", shuffledArray)

  function getShuffledIncompleteTasksArray(arr) {
    return shuffleArray(arr.filter((todo) => todo.isCompleted !== true))
  }

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

  const incompleteTasks = todos.filter(todo => todo.isCompleted === false).length
  

  function resetSuggestions() {
    setCurrentIndex(0)
    setShuffledArray(getShuffledIncompleteTasksArray(todos))
  }

  return (
    <div className='page-container suggested-task-page'>
      <div className='task-container'>
        <p className={shuffledArray[currentIndex].isCompleted ? "strikethrough task-name" : "task-name"}>{shuffledArray[currentIndex].text}</p>
        <p className="task-tracker">{currentIndex + 1} / {shuffledArray.length}</p>
      </div>
      <div className='buttons-container'>
        <button
          onClick={completeTask}
          data-checkbox={shuffledArray[currentIndex].id}
          className='btn complete-task-btn'
        >
          {shuffledArray[currentIndex].isCompleted === false ? "Done!" : "Undo"}
        </button> 
        <button
          onClick={() => setShowSuggestedTask(false)}
          className="btn return-btn"
        >
          <span 
            className="fa-stack"
            data-count={incompleteTasks}
          >
            <FontAwesomeIcon 
              icon={faListCheck} 
              pointerEvents={"none"}
              className="return-icon fa-stack-1x"
            />
          </span>
        </button>

        {currentIndex !== (shuffledArray.length - 1) ? 
          <button
            className="btn next-btn"
            onClick={() => setCurrentIndex((prevIndex) => prevIndex + 1)}
          >
            <FontAwesomeIcon icon={faAngleRight} />
            <FontAwesomeIcon icon={faAngleRight} />
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          :
          <button
            className="btn next-btn"
            onClick={resetSuggestions}
          >
            Let's go again
          </button>
        }
      </div>
      
    </div>
  )
}