import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './Journal_FE/src/App.css'
import Dashboard from './Journal_FE/src/components/Dashboard/Dashboard'
import Authentication from './Journal_FE/src/components/auth/Authentication'
import { useState, useEffect} from 'react'
import LogIn from './Journal_FE/src/components/auth/LogIn'
import Registration from './Journal_FE/src/components/auth/Registration'
import { UserAuthContext } from './Journal_FE/src/Helper/Context'

function App() {
  const [userAuth, setUserAuth] = useState(false)
  const [tokenExpiration, setTokenExpiration] = useState(JSON.parse(sessionStorage.getItem('token_expiration')) || '')
  const [token, setToken] = useState(JSON.parse(sessionStorage.getItem('token')) || '')
 
  // function isTokenValid(){+ 67200
  //   const dateNow = (Date.parse(new Date(Date.now()))/1000) 
  //   const dueDate = Date.parse(new Date(tokenExpiration))/1000 + 66000
  //   console.log((new Date(tokenExpiration)).toUTCString(), (new Date(Date.now())).toUTCString())
  //   console.log(dueDate - dateNow)
  //   if (dueDate < dateNow){
  //     console.log('token false')
  //     setUserAuth(false)
  //   }
  //   else{
  //     console.log('token true')
  //     setUserAuth(true)
  //   }
  // }
  useEffect(()=>{
    if(token == '' || token == undefined){
      setUserAuth(false)
    }
  })

  function Home(){
    return(
      <>
        { userAuth ? <Dashboard/> : <Authentication setUserAuth={setUserAuth}/>}
      </>
    )
  }
  return (
    <>
      <UserAuthContext.Provider value={{userAuth, setUserAuth, token, setToken, setTokenExpiration}}>
        <BrowserRouter>
            <Routes>
                <Route path='/' Component={Home}/>
                <Route path='/auth/signin' Component={LogIn}/>
                <Route path='/auth/signup' Component={Registration}/>
            </Routes>
          </BrowserRouter> 
      </UserAuthContext.Provider>
    </>
  )
}

export default App
