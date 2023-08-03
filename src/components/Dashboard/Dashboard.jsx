import { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar'
import AddCategory from '../Modals/AddCategory'
import AddTask from '../Modals/AddTask'
import CategoriesDashboard from './CategoriesDashboard'
import TasksDashboard from './TasksDashboard'
import { UserAuthContext } from '../../Helper/Context'
import "../Auth/Auth.css"
import "../Dashboard/CategoriesDashboard.css"

export default function Dashboard(params) {
  const {token, setUserAuth, userAuth}= useContext(UserAuthContext)
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [categories, setCategories] = useState([])
  const [tasks, setTasks] = useState([])
  const [showTasks, setShowTasks] = useState(true)
  const [showCategories, setShowCategories ] = useState(false)
  
  const toggleShowTask=()=>{
    setShowTasks(true)
    setShowCategories(false)
  }

  const toggleShowCategory=()=>{
    setShowTasks(false)
    setShowCategories(true)
  }

  async function getTasks(){
    try {
      const getTasksResponse = await fetch(`${API_URL}/users/id/tasks`,{
        method: "GET",
        headers:{"Content-Type": "application/json",
                  "Authorization" : `Token ${token}`
        }
      })
      const res = await getTasksResponse.json()
      if(res.status == 'success'){
        setTasks(res.body)
      }
      else{
        setUserAuth(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  async function getCategories(){
    try {
      const getCategoriesResponse = await fetch(`${API_URL}/users/id/categories`,{
        method: "GET",
        headers:{"Content-Type": "application/json",
                  "Authorization" : `Token ${token}`
        }
      })
      const res = await getCategoriesResponse.json()
      if(res.status =="success"){
        setCategories(res.body)
      }
      else{
        setUserAuth(false)
      }
    } catch ({ name, message }) {
      console.log(name, message)
    } 
  }

  // const generateTaskList=(tasks)=>{
  //   return tasks.map(task=>{
  //       return (<div key={task.id}>task.name</div>)
  //   })
  // }
  useEffect(()=>{
    
      getTasks()
      getCategories()
  },[])

  return (
    <div className='dashboard'>
        {showAddCategoryModal &&
            <AddCategory
            setShowAddCategoryModal={setShowAddCategoryModal}
            getCategories = {getCategories}
            />}

        {showAddTaskModal &&
            <AddTask
            setShowAddTaskModal={setShowAddTaskModal}
            categories={categories}
            setShowAddCategoryModal={setShowAddCategoryModal}
            getTasks={getTasks}
            />}

        <Navbar
        toggleShowTask={toggleShowTask}
        toggleShowCategory={toggleShowCategory}
        />

        {showCategories &&
          <CategoriesDashboard
            getCategories={getCategories}
            setShowAddTaskModal={setShowAddTaskModal}
            tasks = {tasks}
            getTasks={getTasks}
            categories={categories}
            setShowAddCategoryModal={setShowAddCategoryModal}
            showAddTaskModal={showAddTaskModal}
          />}

        {showTasks &&
            <TasksDashboard
            getCategories={getCategories}
            setShowAddTaskModal={setShowAddTaskModal}
            tasks = {tasks}
            getTasks={getTasks}
            categories={categories}
            setShowAddCategoryModal={setShowAddCategoryModal}
          />}
    </div>
  )
}
