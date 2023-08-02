import React, { useEffect, useState } from 'react'
import TaskDetails from './TaskDetails'


export default function TasksDashboard(params) {
  const {tasks, setShowAddTaskModal, getTasks, categories, setShowAddCategoryModal} = params
  const [taskShow, setTaskShow] = useState({})
  const [showExpiredTasks, setShowExpiredTasks] = useState(false)
  const [showIncomingTasks, setShowIncomingTasks] = useState(false)
  const [showCompletedTasks, setShowCompletedTasks] = useState(false)
  const [isTaskEmpty, setIsTaskEmpty] = useState(true)
  const [completedTasks, setCompletedTasks] = useState([])
  const [expiredTasks, setExpiredTasks] = useState([])
  const [incomingTasks, setIncomingTasks] = useState([])

  function categorizeTasks(tasks){
    console.log('categorize')
    const completeArr = []
    const expiredArr = []
    const incomingArr = []
  
    tasks.map(task=>{
      const dateNow = Date.now()
      const dueDate = Date.parse(task.due_date)
      if(task.is_complete){
        completeArr.push(task)
      }
      else if(dueDate<dateNow){
        expiredArr.push(task)
      }
      else{
        incomingArr.push(task)
      }
    })
    setCompletedTasks(completeArr)
    setExpiredTasks(expiredArr)
    setIncomingTasks(incomingArr)
  }
  const toggleExpiredTasks =()=>{
    setShowExpiredTasks(!showExpiredTasks)
  }
  const toggleIncomingTasks =()=>{
    setShowIncomingTasks(!showIncomingTasks)
  }
  const toggleCompletedTasks =()=>{
    setShowCompletedTasks(!showCompletedTasks)
  }

  function generateTasksList(tasksList){
    let className = 'task-item'
    switch(tasksList){
      case expiredTasks:
        className = 'task-item expired'
        break;
      case incomingTasks:
        className = 'task-item incoming'
        break;
      case completedTasks:
        className = 'task-item completed'
        break;
    }
    tasksList.sort(
      (taskA, taskB) => {
        const timeA = (Date.parse(taskA.due_date))
        const timeB = (Date.parse(taskB.due_date))
        return Number(timeA) - Number(timeB)
      }
    )
    return tasksList.map((task, index)=>{
      const dueDate =()=>{
        const dateNow = new Date(Date.now()).toDateString()
        const dueDate = (new Date(task.due_date)).toDateString()
            if(dueDate == dateNow){
                return "Today"
            }
            else{
                return dueDate
            }
    }
      return (<div className={className} key={task.id} onClick={()=>{
        setIsTaskEmpty(false)
        setTaskShow(tasksList[index])}}>
        <p>{task.name}</p>
        <p>{dueDate()}</p>
      </div>)
    })
  }

  useEffect(()=>{
    // setExpiredTasks([])
    // setIncomingTasks([])
    categorizeTasks(tasks)

  },[tasks])
  return (
    <>
      <div className='task-dashboard dashboard-container'>
        <section className='task-list-container'>
          <div className='tasks-list-header task-item'>
            <p>Tasks List</p>
            <button type="button"className='add-tasks-button' onClick={()=>setShowAddTaskModal(true)}>
              Add new task
            </button>
          </div>
          <div>
            <div className='task-item' onClick={toggleExpiredTasks}>
              <div className='task-category'>
                <p>Expired Tasks</p> 
                <p>({expiredTasks.length})</p>
              </div>
              <span className="material-symbols-outlined">
                    {showExpiredTasks ? 'expand_less' : 'expand_more'}
                  </span>
            </div>
            {showExpiredTasks &&<div>
              {generateTasksList(expiredTasks)}
            </div>}
            
          </div>
          <div>
            <div className='task-item' onClick={toggleIncomingTasks}>
              <div className='task-category'>
                <p>Tasks</p> 
                <p>({incomingTasks.length})</p>
              </div>
              <span className="material-symbols-outlined">
                    {showIncomingTasks ? 'expand_less' : 'expand_more'}
              </span>
            </div>
              {showIncomingTasks && <div>
                {generateTasksList(incomingTasks)}
            </div>}
          </div>
          <div>
            <div className='task-item' onClick={toggleCompletedTasks}>
              <div className='task-category'>
                <p>Completed Tasks</p> 
                <p>({completedTasks.length})</p>
              </div>
                <span className="material-symbols-outlined">
                  {showCompletedTasks ? 'expand_less' : 'expand_more'}
                </span>
              </div>
                {showCompletedTasks && <div>
                  {generateTasksList(completedTasks)}
              </div>}
          </div>
        </section>
        <section>
          {!isTaskEmpty && <TaskDetails taskShow={taskShow} getTasks={getTasks} setIsTaskEmpty={setIsTaskEmpty} categories={categories}
          setShowAddCategoryModal={setShowAddCategoryModal}
          setTaskShow={setTaskShow}/>}
        </section>
      </div>
      
    </>
    
  )
}
