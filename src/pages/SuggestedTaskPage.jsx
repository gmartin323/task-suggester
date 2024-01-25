import React from 'react'
import shuffleArray from '../utilities/shuffleArray'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleList } from '@fortawesome/free-regular-svg-icons'
import { faAngleRight, faListCheck, faRotateLeft, faArrowRotateLeft, faCircle, faCircleDot } from '@fortawesome/free-solid-svg-icons'
import medalImg from '../images/tick-medal.png';


export default function SuggestedTask({ todos, completeTodo, setShowSuggestedTask, incompleteTasks }) {

  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [shuffledArray, setShuffledArray] = React.useState(getShuffledIncompleteTasksArray(todos))
  const currentTask = shuffledArray[currentIndex]
  const totalTasks = shuffledArray.length


  function getShuffledIncompleteTasksArray(arr) {
    return shuffleArray(arr.filter((todo) => todo.isCompleted !== true))
  }

  function toggleCompleteTask(event) {
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

  function resetSuggestions() {
    setCurrentIndex(0)
    setShuffledArray(getShuffledIncompleteTasksArray(todos))
  }

  const dotsEl = (
    <div className='dotsContainer'>
      {shuffledArray.map((task, index) => {
        if (index === currentIndex) {
          return <FontAwesomeIcon icon={faCircle} className = "dot" />
        } else {
          return <FontAwesomeIcon icon={faCircleDot} className = "dot" />
        }
      })}
    </div>
  )

  return (
    <div className='page-container suggested-task-page'>
      <div className='task-container'>
        <p className={currentTask.isCompleted ? "lower-opacity task-name" : "task-name"}>{currentTask.text}</p>       
        {currentTask.isCompleted ? 
          <img src={medalImg} alt='medal image' className='medal-img'/>
          : null
        }
        {dotsEl}
      </div>
      <div className='buttons-container'>
        <button
          onClick={toggleCompleteTask}
          data-checkbox={currentTask.id}
          className='btn complete-task-btn'
        >
          {currentTask.isCompleted ? <FontAwesomeIcon icon={faArrowRotateLeft} pointerEvents={"none"} /> : "Done!"}
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

        {incompleteTasks === 0 ?
          <div
            className="btn next-btn all-tasks-complete"
          >
            All Tasks Complete!
          </div>
          :
        currentIndex === (shuffledArray.length - 1) ?
          <button
            className="btn next-btn"
            onClick={resetSuggestions}
          >
            Let's go again
          </button>
          :
          <button
            className="btn next-btn"
            onClick={() => setCurrentIndex((prevIndex) => prevIndex + 1)}
          >
            Next Task
          </button>
        }
      </div>
      
    </div>
  )
}