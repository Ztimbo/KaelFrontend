import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../config/axosClient';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const authenticateUser = async () => {
            setLoading(true);
            setToken(localStorage.getItem('token'));

            if(!token) {
                setLoading(false);
                navigate('/');
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const {data} = await axiosClient.get('/users/loggedin/profile', config);
                setAuth(data);
                navigate('/dashboard');
            } catch(ex) {
                setAuth({});
            } finally {
                setLoading(false);
            }
        }

        authenticateUser();
    }, [token]);

    const cerrarSesionAuth = () => {
        setLoading(true);
        setAuth({});
        setToken('');
        localStorage.removeItem('token');
        setLoading(false);
    }

    return(
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                loading,
                cerrarSesionAuth,
                setLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export {AuthProvider}

export default AuthContext