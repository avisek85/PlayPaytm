// import {BrowserRouter,Routes} from 'react-router-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signin from './components/Signin'
import Signup from "./components/Signup"
import SendMoney from "./components/SendMoney"
import Dashboard from "./components/Dashboard"

function App() {

  return (
  <BrowserRouter>
  <Routes>
    <Route path='/signup' element={<Signup/>}/>
    <Route path='/signin' element={<Signin/>}/>
    <Route path='/' element={<Dashboard/>}/>
    <Route path='/send' element={<SendMoney/>}/>
  </Routes>
  </BrowserRouter>
  )
}

export default App
