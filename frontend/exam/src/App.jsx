import { Route, Routes } from 'react-router-dom'
import './App.css'
import AuthScreens from './pages/authScreens'
import Book from './pages/Book'
import ProtectedRoute from './utils/protectedRoute'
import Layout from './pages/Layout'

function App() {

  return (
    <Routes>
      {/* <Route path='/' element={ } /> */}
      <Route path='/' element={
        <AuthScreens />
      } />
      <Route path="/layout" element={<Layout />} />
      <Route path="/admin" element={<Book />} />
    </Routes>
  )
}

export default App
