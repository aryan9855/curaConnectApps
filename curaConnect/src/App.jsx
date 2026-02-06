import "./App.css"
import { Route, Routes } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Catalog from "./pages/Catalog"
import Error from "./pages/Error"
import ForgotPassword from "./pages/ForgotPassword"
import UpdatePassword from "./pages/UpdatePassword"
import VerifyEmail from "./pages/VerifyEmail"

import Navbar from "./components/core/HomePage/common/Navbar"
import DotGrid from "./components/DotGrid"

import OpenRoute from "./components/core/Auth/OpenRoute"
import PrivateRoute from "./components/core/Auth/PrivateRoute"

import Dashboard from "./pages/Dashboard"
import MyProfile from "./components/core/Dashboard/MyProfile"
import Settings from "./components/core/Dashboard/Settings/Settings"
import EnrolledHealthPrograms from "./components/core/Dashboard/EnrolledHealthPrograms"
import Cart from "./components/core/Dashboard/Cart/Cart"
import AddHealthProgram from "./components/core/Dashboard/AddHealthProgram"

import HealthProgramDetails from "./pages/HealthProgramDetails"
import ViewHealthProgram from "./pages/ViewHealthProgram"
import VideoDetails from "./components/core/ViewHealthProgram/VideoDetails"

import { ACCOUNT_TYPE } from "./utils/constants"
import { getUserDetails } from "./services/operations/SettingsAPI"

function App() {
  const dispatch = useDispatch()

  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)

  // 🔄 Refresh user on reload
  useEffect(() => {
    if (token) {
      dispatch(getUserDetails(token))
    }
  }, [token, dispatch])

  return (
    <div className="w-screen min-h-screen flex flex-col font-inter relative bg-richblack-900">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <DotGrid
          dotSize={7}
          gap={15}
          baseColor="#271E37"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      {/* App Content */}
      <div className="relative z-10">
        <Navbar />

        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/catalog/:catalogName" element={<Catalog />} />
          <Route
            path="/health-programs/:programId"
            element={<HealthProgramDetails />}
          />

          <Route
            path="/login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <OpenRoute>
                <Signup />
              </OpenRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <OpenRoute>
                <ForgotPassword />
              </OpenRoute>
            }
          />

          <Route
            path="/update-password/:id"
            element={
              <OpenRoute>
                <UpdatePassword />
              </OpenRoute>
            }
          />

          <Route
            path="/verify-email"
            element={
              <OpenRoute>
                <VerifyEmail />
              </OpenRoute>
            }
          />

          {/* ================= DASHBOARD ================= */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="settings" element={<Settings />} />

            {/* 👤 PATIENT */}
            {user?.accountType === ACCOUNT_TYPE.PATIENT && (
              <>
                <Route path="cart" element={<Cart />} />
                <Route
                  path="my-health-programs"
                  element={<EnrolledHealthPrograms />}
                />
              </>
            )}

            {/* 👨‍⚕️ DOCTOR */}
            {user?.accountType === ACCOUNT_TYPE.DOCTOR && (
              <>
                <Route
                  path="add-health-programs"
                  element={<AddHealthProgram />}
                />
              </>
            )}
          </Route>

          {/* ================= VIEW HEALTH PROGRAM ================= */}
          <Route
            element={
              <PrivateRoute>
                <ViewHealthProgram />
              </PrivateRoute>
            }
          >
            {user?.accountType === ACCOUNT_TYPE.PATIENT && (
              <Route
                path="/view-health-program/:programId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            )}
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
