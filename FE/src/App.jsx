import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'

function App() {

  return (  
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
    )
}

export default App
