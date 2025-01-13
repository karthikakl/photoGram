import { createBrowserRouter } from "react-router-dom";
import Login  from "./pages/Login";
import Error from './pages/error';
import Signup from './pages/signup';
import Home  from "./pages/home";
import Profile from './pages/profile';
import Post from './pages/post';
import ProtectedRoutes from "./components/ProtectedRoutes";
export const router = createBrowserRouter([
    {
        element:<ProtectedRoutes/>,
        children:[
            {
                path:"/",
                element:<Home/>,
                errorElement:<Error/>
            },
            {
                path:"/profile",
                element:<Profile/>,
                errorElement:<Error/>
            },
            {
                path:'/post',
                element:<Post/>,
                errorElement:<Error/>
            }
        ]

    },
    {
        path:"/login",
        element:<Login/>,
        errorElement:<Error/>
    },
    {
        path:"/signup",
        element:<Signup/>,
        errorElement:<Error/>
    },
    
])

export default router;