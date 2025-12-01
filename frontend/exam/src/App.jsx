import { Route, Routes } from 'react-router-dom'
import './App.css'
import AuthScreens from './pages/authScreens'
import Book from './pages/Book'
import ProtectedRoute from './utils/protectedRoute'

function App() {

  return (
    <Routes>
      {/* <Route path='/' element={ } /> */}
      <Route path='/' element={<ProtectedRoute>
        <AuthScreens />
      </ProtectedRoute>} />
      <Route path="/admin" element={<Book />} />
    </Routes>
  )
}

export default App
