import GenericForm from '../../general/GenericForm';
import { useEffect, useState } from 'react';
import { types } from '../../../constants/alertType';
import GenericAlert from '../../general/GenericAlert';
import axiosClient from '../../../config/axosClient';
import getOptions from '../../../helpers/getRequestOptions';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import Spinner from '../../general/Spinner';
import { Avatar, Chip } from '@mui/material';
import './OrderForm.scss';

const OrderForm = ({id}) => {
    const [alert, setAlert] = useState({});
    const [clientName, setClientName] = useState('');
    const [deliverDate, setDeliverDate] = useState('');
    const [aditionalInfo, setAditionalInfo] = useState('');
    const [items, setItems] = useState([]);

    const {setLoading, loading} = useAuth();

    useEffect(() => {
        setItems([
            {
                id: 1,
                product: "Docena de donas",
                quantity: 1
            },
            {
                id: 2,
                product: "Ocho donas",
                quantity: 1
            },
            {
                id: 3,
                product: "Cinco donas",
                quantity: 1
            },
            {
                id: 4,
                product: "Cinco donas",
                quantity: 1
            },
            {
                id: 5,
                product: "Cinco donas",
                quantity: 1
            }
        ]);
    }, []);

    const handleSubmit = async () => {

    }

    const searchProduct = async product => {
    }

    const handleChipClick = async id => {
        const newState = items.map(item => {
            if(item.id === id) {
                const quantity = item.quantity + 1;
                return {...item, quantity: quantity}
            }

            return item;
        });

        setItems(newState);
    }

    const handleChipDelete = async id => {
        setItems(items.filter(item => item.id !== id));
    }

    const {msg} = alert;

  return (
    <>
        <GenericForm formTitle={id ? 'Actualizar orden' : 'Crear nueva orden'} submit={handleSubmit}>
            <label>Orden</label>
            <input type="text" placeholder="Nombre del cliente" value={clientName} onChange={e => setClientName(e.target.value)} />
            <label>Fecha de entrega</label>
            <input type="date" value={deliverDate} onChange={e => setDeliverDate(e.target.value)} />
            <label>Agregar productos</label>
            <input type="text" placeholder="Nombre del producto" onChange={e => searchProduct(e.target.value)} />
            <div>
                {
                    items.map(item => (
                        <Chip className='order-product' avatar={<Avatar>{item.quantity}</Avatar>} label={item.product} variant="outlined" onClick={() => handleChipClick(item.id)} onDelete={() => handleChipDelete(item.id)} />
                    ))
                }
            </div>
            <label>Notas</label>
            <textarea type="text" placeholder="Notas" value={aditionalInfo} onChange={e => setAditionalInfo(e.target.value)} />
        </GenericForm>
        {msg && <GenericAlert alert={alert} />}
        {loading && <Spinner />}
    </>
  )
}

export default OrderForm