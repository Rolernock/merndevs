import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProfileRoute() {
  const { profile } = useSelector(state => state.profiles)
  return profile ? <Outlet /> : <Navigate to='/profile' />
}
