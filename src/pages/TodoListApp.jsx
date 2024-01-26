import React from "react";
import TaskListPage from "./TaskListPage";
import SuggestedTask from "./SuggestedTaskPage";
import {
  onSnapshot,
  doc,
  getDoc,
  setDoc
} from "firebase/firestore"
import { todoCollection, db } from "../firebase";


export default function TodoListApp() {
  const [todos, setTodos] = React.useState([])
  const [showSuggestedTask, setShowSuggestedTask] = React.useState(false)

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

  async function toggleIsCompleted(event) {
    const todoId = event.target.dataset.checkbox
    const docRef = doc(db, "todo" , todoId)
    const docSnap = await getDoc(docRef)
    const currentTodoData = docSnap.data()
    await setDoc(docRef, { isCompleted: !currentTodoData.isCompleted } , { merge: true })
  }

  const incompleteTasks = todos.filter(todo => todo.isCompleted === false).length
  
  if (showSuggestedTask) {
    return (
      <SuggestedTask 
        todos={todos}
        toggleIsCompleted={toggleIsCompleted}
        incompleteTasks={incompleteTasks}
        setShowSuggestedTask={setShowSuggestedTask}
      />
    )
  } else {
    return (
      <TaskListPage
        todos={todos}
        toggleIsCompleted={toggleIsCompleted}
        incompleteTasks={incompleteTasks}
        setShowSuggestedTask={setShowSuggestedTask}
      />
    )
  }
}