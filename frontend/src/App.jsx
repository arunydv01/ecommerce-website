
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Success from './components/Success'
import Cancel from './components/Cancel'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignUpForm'

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/success" element={<Success/>}/>
          <Route path="/cancel" element={<Cancel/>}/>
          <Route path="/login" element={<LoginForm/>}/>
          <Route path='/signup' element={<SignupForm/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
