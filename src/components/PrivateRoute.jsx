import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ textAlign: 'center', marginTop: '40px' }}>Loading...</div>
  return user ? children : <Navigate to="/login" />
}

export default PrivateRoute
