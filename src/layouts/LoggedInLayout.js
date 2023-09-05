import Logo from '../resources/images/Logo.jpeg'
import './LoggedInLayout.scss'
import { Outlet, Link, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/general/Spinner'

const LoggedInLayout = () => {
    const { cerrarSesionAuth, auth, loading } = useAuth();
    const location = useLocation();

  return (
    <div className="dashboard-container">
        {loading && <Spinner />}
        <div className="sidebar">
        <div className="logo">
            <img src={Logo} alt="Company Logo" />
        </div>
        <p className='user-name'>{auth.name} {auth.surname}</p>
        <ul className="sidebar-menu">
            <li className={location.pathname.includes('/dashboard') ? 'active' : ''}><Link to='/dashboard'>Dashboard</Link></li>
            <li className={location.pathname.includes('/orders') ? 'active' : ''}><Link to='/orders'>Pedidos</Link></li>
            <li className={location.pathname.includes('/products') ? 'active' : ''}><Link to='/products'>Productos</Link></li>
            <li className={location.pathname.includes('/users') ? 'active' : ''}><Link to='/users'>Usuarios</Link></li>
        </ul>
        <button className="logoff-button" onClick={cerrarSesionAuth}>Cerrar sesión</button>
        </div>
        <div className="main-content">
            <Outlet />
        </div>
    </div>
  )
}

export default LoggedInLayout