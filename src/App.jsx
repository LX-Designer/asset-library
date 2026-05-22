import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import AssetPage from './pages/AssetPage.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ClassDetail from './pages/ClassDetail.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/asset/:assetId" element={<AssetPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/classes/:classId" element={<ClassDetail />} />
        </Route>
      </Route>
    </Routes>
  )
}
