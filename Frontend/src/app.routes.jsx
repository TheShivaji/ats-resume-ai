import { createBrowserRouter } from "react-router-dom"
import Signup from "./feature/auth/pages/Signup"
import Login from "./feature/auth/pages/Login"
import Home from "./feature/auth/pages/Home"
import { ProtectRoute } from "./feature/auth/components/ProtectRoute"
import { PublicRoute } from "./feature/auth/components/PublicRoute"
export const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectRoute><Home /></ProtectRoute>
    },
    {
        path: '/signup',
        element: <PublicRoute><Signup /></PublicRoute>
    },
    {
        path: '/login',
        element: <PublicRoute><Login /></PublicRoute>
    }
])