import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function PrivateRoute() {
  const { user } = useSelector(state => state.users)
  return user ? <Outlet /> : <Navigate to='/login' />
}
