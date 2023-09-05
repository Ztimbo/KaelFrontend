import { Outlet } from "react-router-dom"
import './AuthLayout.scss'
import Spinner from "../components/general/Spinner"
import useAuth from "../hooks/useAuth"

const AuthLayout = () => {
    const { loading } = useAuth();
  return (
    <>
        <main className="login-layout">
            <Outlet />
        </main>
        {loading && <Spinner />}
    </>
  )
}

export default AuthLayout