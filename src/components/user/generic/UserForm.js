import './UserForm.scss'
import GenericForm from '../../general/GenericForm';
import { useEffect, useState } from 'react';
import { types } from '../../../constants/alertType';
import GenericAlert from '../../general/GenericAlert';
import axiosClient from '../../../config/axosClient';
import getOptions from '../../../helpers/getRequestOptions';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import Spinner from '../../general/Spinner';
import GenericDialog from '../../general/GenericDialog';

const UserForm = ({id}) => {
    const [_id, setId] = useState('');
    const [userName, setUserName] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [alert, setAlert] = useState({});
    const [isOpened, setIsOpened] = useState(false);

    const navigate = useNavigate();
    const {setLoading, loading, auth} = useAuth();

    useEffect(() => {
        const getUser = async () => {
            if(id) {
                try {
                    setLoading(true);
                    const {data} = await axiosClient.get(`/users/${id}`, getOptions());
                
                    if(!data) {
                        setAlert({msg: 'Usuario no encontrado', type: types.ERROR});
                        return;
                    }

                    setId(data._id);
                    setUserName(data.userName);
                    setName(data.name);
                    setSurname(data.surname);
                } catch(err) {
                    setAlert({msg: 'Error', type: types.ERROR});
                } finally {
                    setLoading(false);
                }
            }
        }
        
        getUser();
    }, [id]);

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setLoading(true);
        
            if((!id && [userName, name, surname, password, passwordRepeat].includes('')) || (id && [userName, name, surname].includes(''))) {
                setAlert({msg: 'Todos los campos son obligatorios', type: types.ERROR});
                return;
            }

            if(password !== passwordRepeat) {
                setAlert({msg: 'Las contraseñas deben coincidir', type: types.ERROR});
                return;
            }

            const {data} = !id ? await axiosClient.post('/users', {userName, name, surname, password}, getOptions()) 
                                : await axiosClient.put(`/users/${id}`, {userName, name, surname}, getOptions());

            setAlert({msg: data.message, type: types.SUCCESS});

            setTimeout(() => {
                setUserName('');
                setName('');
                setSurname('');
                setPassword('');
                setPasswordRepeat('');
                navigate('/users');
            }, 2000);
        } catch(err) {
            setAlert({msg: err.response.data.message, type: types.ERROR});
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        setIsOpened(true);
    }

    const handleDeleteItem = async () => {
        try {
            setLoading(true);
            if(auth._id == id) {
                setAlert({msg: 'No puedes eliminar tu propio usuario', type: types.ERROR});
                return;
            }

            const {data} = await axiosClient.delete(`/users/${id}`, getOptions());
            setAlert({msg: data.message, type: types.SUCCESS});
            setIsOpened(false);

            setTimeout(() => {
                navigate('/users');
            }, 2000);
        } catch(err) {
            setAlert({msg: 'Error en el servidor', type: types.ERROR});
        } finally {
            setLoading(false);
        }
    }

    const {msg} = alert;

  return (
    <>
        <GenericForm formTitle={id ? 'Actualizar usuario' : 'Crear nuevo usuario'} submit={handleSubmit} handleDelete={handleDelete}>
            <label>Nombre de usuario</label>
            <input type="text" placeholder="Nombre de usuario" value={userName} onChange={e => setUserName(e.target.value)} />
            <label>Nombre(s)</label>
            <input type="text" placeholder="Nombre(s)" value={name} onChange={e => setName(e.target.value)} />
            <label>Apellido(s)</label>
            <input type="text" placeholder="Apellido(s)" value={surname} onChange={e => setSurname(e.target.value)} />
            {!id && <label>Contraseña</label>}
            {!id && <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />}
            {!id && <label>Repetir contraseña</label>}
            {!id && <input type="password" placeholder="Repite la contraseña" value={passwordRepeat} onChange={e => setPasswordRepeat(e.target.value)} />}
        </GenericForm>
        {msg && <GenericAlert alert={alert} />}
        {loading && <Spinner />}
        <GenericDialog isOpened={isOpened} setIsOpened={setIsOpened} dialogTitle={'¿Desea eliminar a este usuario?'} dialogContentText={'Esta acción no puede ser revertida.'} handleDeleteItem={handleDeleteItem} />
    </>
  )
}

export default UserForm