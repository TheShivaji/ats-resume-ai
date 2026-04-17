import { createBrowserRouter } from "react-router-dom"
import Signup from "./feature/auth/pages/Signup"
import Login from "./feature/auth/pages/Login"
import Home from "./feature/auth/pages/Home"
export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/signup',
        element: <Signup />
    },
    {
        path: '/login',
        element: <Login />
    }
])