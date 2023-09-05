import './Login.scss';
import Imagen from '../../resources/images/Logo.jpeg';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth'
import axiosClient from '../../config/axosClient';
import GenericAlert from '../general/GenericAlert';
import { useNavigate } from 'react-router-dom';
import { types } from '../../constants/alertType';

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState({});

    const { setAuth, setLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();

        if([userName, password].includes('')) {
            setAlert({msg: 'Campos obligatorios', type: types.ERROR});
            return;
        }

        try {
            setLoading(true);
            const {data} = await axiosClient.post('/users/login', {userName, password});
            setAlert({});
            localStorage.setItem('token', data.token);
            setAuth(data);
            navigate('/dashboard');
        } catch(ex) {
            setAlert({msg: ex.response.data.message, type: types.ERROR});
            return;
        } finally {
            setLoading(false);
        }
    }

    const {msg} = alert;

  return (
    <div className="login-container">
        <img src={Imagen} alt="Background Image" className="logo"></img>
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>INICIO DE SESIÓN</h2>
            <input type="text" placeholder="Nombre de usuario" value={userName} onChange={e => setUserName(e.target.value)} />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit">INGRESAR</button>
        </form>
        {msg && <GenericAlert alert={alert} />}
    </div>
  )
}

export default Login