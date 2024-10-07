import './App.css'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import LandingScreen from './screens/home/LandingScreen'
import PageNotFound from './screens/routing/PageNotFound'
import LoginScreen from './screens/auth/LoginScreen'
import RegisterScreen from './screens/auth/RegisterScreen'
import PrivateRoute from './components/PrivateRoute'
import ProjectsScreen from './screens/projects/ProjectsScreen'
import PostScreen from './screens/post/PostScreen'
import ProfileScreen from './screens/profile/ProfileScreen'
import ProfilesScreen from './screens/profile/ProfilesScreen'
import AdminRoute from './components/AdminRoute'
import Message from './components/Message'
import Messages from './components/Messages'
import UserScreen from './screens/users/UserScreen'
import ProfileById from './screens/profile/ProfileById'
import FollowingScreen from './screens/followers/FollowingScreen'
import FollowersScreen from './screens/followers/FollowersScreen'
import FollowingByIdScreen from './screens/followers/FollowingByIdScreen'
import FollowersByIdScreen from './screens/followers/FollowersByIdScreen'
import CreateProfileScreen from './screens/profile/CreateProfileScreen'
import ForgotPassword from './screens/routing/ForgotPassword'
import NewProject from './screens/projects/NewProject'
import ProjectByIdScreen from './screens/projects/ProjectsByIdScreen'
import UpdateUser from './screens/users/UpdateUser'
import AddPost from './screens/post/AddPost'
import HomeScreen from './screens/home/HomeScreen'
import ProfileRoute from './components/ProfileRoute'
import ResetPassword from './screens/routing/ResetPassword'

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingScreen />} />
      <Route path='/' element={<MainLayout />}>
        <Route path='/posts' element={<HomeScreen />} />
        <Route path='/developers' element={<ProfilesScreen />} />
        <Route path='' element={<PrivateRoute />}>
          <Route path='/post/:postId' element={<PostScreen />} />
          <Route
            path='/followers/:profileId'
            element={<FollowersByIdScreen />}
          />
          <Route
            path='/following/:profileId'
            element={<FollowingByIdScreen />}
          />
          <Route path='/add-post' element={<AddPost />} />
          <Route path='/message' element={<Message />} />
          <Route path='/projects' element={<ProjectsScreen />} />
          <Route path='/profile' element={<ProfileScreen />} />
          <Route path='followers' element={<FollowersScreen />} />
          <Route path='/following' element={<FollowingScreen />} />
          <Route path='/create-profile' element={<CreateProfileScreen />} />
          <Route path='/update-profile' element={<CreateProfileScreen />} />
          <Route path='/new-project' element={<NewProject />} />
        </Route>

        <Route path='' element={<ProfileRoute />}>
          <Route path='/profile/:profileId' element={<ProfileById />} />
          <Route path='/projects/:profileId' element={<ProjectByIdScreen />} />
        </Route>
        <Route path='' element={<AdminRoute />}>
          <Route path='/users' element={<UserScreen />} />
          <Route path='/messages' element={<Messages />} />
          <Route path='/user/:userId' element={<UpdateUser />} />
        </Route>
        <Route path='/page/:pageNumber' element={<HomeScreen />} />
        <Route path='/search/:keyword' element={<HomeScreen />} />
        <Route path='/login' element={<LoginScreen />} />
        <Route path='/register' element={<RegisterScreen />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='*' element={<PageNotFound />} />
      </Route>
    </Routes>
  )
}

export default App
