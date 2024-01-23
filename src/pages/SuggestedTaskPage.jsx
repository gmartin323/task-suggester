import React from 'react'
import shuffleArray from '../utilities/shuffleArray'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleList } from '@fortawesome/free-regular-svg-icons'
import { faAngleRight, faListCheck } from '@fortawesome/free-solid-svg-icons'


export default function SuggestedTask({ todos, completeTodo, setShowSuggestedTask }) {

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
    <div className='page-container suggested-task-page'>
      <div className='task-container'>
        <p className={shuffledArray[currentIndex].isCompleted ? "strikethrough" : ""}>{shuffledArray[currentIndex].text}</p>
      </div>
      <div className='buttons-container'>
        <button
          onClick={completeTask}
          data-checkbox={shuffledArray[currentIndex].id}
          className='btn complete-task-btn'
        >
          Done!
        </button> 
        <button
          onClick={() => setShowSuggestedTask(false)}
          className="btn return-btn"
        >
          <FontAwesomeIcon icon={faListCheck} pointerEvents={"none"} />
        </button>

        {currentIndex !== (shuffledArray.length - 1) && 
          <button
            onClick={() => setCurrentIndex((prevIndex) => prevIndex + 1)}
            className="btn next-btn"
          >
            <FontAwesomeIcon icon={faAngleRight} />
            <FontAwesomeIcon icon={faAngleRight} />
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        }
      </div>
      
    </div>
  )
}