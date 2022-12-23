import { useRoutes } from "react-router-dom"
import { EditTask } from "../pages/EditTask"
import { Home } from "../pages/Home"
import { NewTask } from "../pages/NewTask"

export const RouterList = () => {
    return useRoutes ([
        {path: '/', element: <Home />},
        {path: '/newtask', element: <NewTask />},
        {path: '/edit/:id', element: <EditTask />}
    ])
}