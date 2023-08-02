
import { useContext, useEffect, useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import { UserAuthContext } from '../../Helper/Context'


export default function Registration() {
  const {setUserAuth, setToken, setTokenExpiration} = useContext(UserAuthContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const createUser = async (e)=>{
    e.preventDefault()
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL
    try {
      const userDataRes = await fetch(`${API_URL}/auth/signup`,{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'user':{
            "email": email,
            "password": password,
            "password_confirmation": passwordConfirmation
          }
        })
      })
      const res = await userDataRes.json()
      console.log(res)
      if(res.status == 'success'){
        const body = res.body
        sessionStorage.setItem("token", JSON.stringify(body.user.token));
        sessionStorage.setItem("token_expiration", JSON.stringify(body.user.token_expiration))
        setToken(body.user.token)
        setTokenExpiration(body.user.token_expiration)
        setUserAuth(true)
        navigate('/')
      }

    } catch (error) {
      console.log(error)
    }      
  }
  useEffect(()=>{
  })
  return (
    <div className='auth-page'>
        <h1>Journal App</h1>
        <p>by: Paul Allen</p>
        <form action="">
          <label htmlFor="email">Email</label>
          <input type="email" name='email' onChange={(e)=>setEmail(e.target.value)}/>
          <label htmlFor="password">Password</label>
          <input type="password" name='password' id='password' onChange={(e)=>setPassword(e.target.value)}/>
          <label htmlFor="password-confirmation">Password Confirmation</label>
          <input type="password" name='password-confirmation' id='password-confirmation' onChange={(e)=>setPasswordConfirmation(e.target.value)}/>
          <button type='submit' onClick={(e)=>createUser(e)}>Sign up</button>
        </form>
        <p>Already have an account? <Link to='/auth/signin'>Log In</Link></p>
    </div>
  )
}