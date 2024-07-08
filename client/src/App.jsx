
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {



  return (
   <div>
    <ToastContainer />
      <Router>
        <Routes>
          <Route path='/' element={<Dashboard />}  />
          <Route path='/register' element={<Register />}  />
          <Route path='/login' element={<Login />}  />
        </Routes>
      </Router>

 
    </div>
  )
}

export default App
