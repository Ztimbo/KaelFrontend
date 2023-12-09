import GenericForm from '../../general/GenericForm';
import React, { useEffect, useState } from 'react';
import { types } from '../../../constants/alertType';
import GenericAlert from '../../general/GenericAlert';
import axiosClient from '../../../config/axosClient';
import getOptions from '../../../helpers/getRequestOptions';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import Spinner from '../../general/Spinner';
import { Autocomplete, Divider, IconButton, List, ListItem, ListItemText, TextField } from '@mui/material';
import { getDate, getNumericDate } from '../../../helpers/getFormattedDate';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import './OrderForm.scss';

const OrderForm = ({id}) => {
    const [alert, setAlert] = useState({});
    const [_id, setId] = useState('');
    const [clientName, setClientName] = useState('');
    const [deliverDate, setDeliverDate] = useState('');
    const [aditionalInfo, setAditionalInfo] = useState('');
    const [items, setItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [subTotal, setSubTotal] = useState('');

    const {setLoading, loading} = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const getOrder = async () => {
            if(id) {
                try {
                    setLoading(true);
                    const {data} = await axiosClient.get(`/orders/${id}`, getOptions());
                    console.log(data);
                
                    if(!data) {
                        setAlert({msg: 'Orden no encontrada', type: types.ERROR});
                        return;
                    }
                    
                    const items = data.items.map(d => {
                        return {product: d.product._id, productName: d.product.product, price: d.price, quantity: d.quantity}
                    });

                    setId(data._id);
                    setSubTotal(data.subTotal);
                    setClientName(data.clientName);
                    setAditionalInfo(data.aditionalInfo);
                    setDeliverDate(getNumericDate(data.deliverDate));
                    setItems(items);
                } catch(err) {
                    setAlert({msg: 'Error', type: types.ERROR});
                } finally {
                    setLoading(false);
                }
            }
        }
        
        getOrder();
    }, [id]);

    useEffect(() => {
        const getProducts = async() => {
            try {
                setLoading(true);
                const {data} = await axiosClient.get('/products', getOptions());
                
                if(data.length > 0) {
                  data.map(d => {
                      d.createdAt = getDate(d.createdAt);
                      d.updatedAt = getDate(d.updatedAt);
                      d.price = `$${d.price}`;
                  });
  
                  setAlert({});
                  setProducts(data);
                }
            } catch(err) {
                setAlert({msg: err.message, type: types.ERROR});
            } finally {
                setLoading(false);
            }
        }
        
        getProducts();
    }, []);

    useEffect(() => {
        const calculateTotal = async() => {
            let total = 0;
            
            items.map(item => {
                total += item.price * item.quantity;
            });
    
            setSubTotal(total);
        }

        calculateTotal();
    }, [items]);

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setLoading(true);
        
            if(!id && [clientName, deliverDate].includes('')) {
                setAlert({msg: 'Todos los campos son obligatorios', type: types.ERROR});
                return;
            }

            console.log({clientName, deliverDate, items, aditionalInfo, total: subTotal});

            const {data} = !id ? await axiosClient.post('/orders', {clientName, deliverDate, items, aditionalInfo, total: subTotal}, getOptions()) 
                                : await axiosClient.put(`/orders/${id}`, {clientName, deliverDate, items, aditionalInfo, total: subTotal}, getOptions());

            setAlert({msg: data.message, type: types.SUCCESS});

            setTimeout(() => {
                setSubTotal('');
                setClientName('');
                setAditionalInfo('');
                setDeliverDate('');
                setItems([]);
                navigate('/orders');
            }, 2000);
        } catch(err) {
            setAlert({msg: err.response.data.message, type: types.ERROR});
        } finally {
            setLoading(false);
        }
    }

    const addProduct = async product => {
        if(!product) {
            return;
        }

        const existingItem = items.find(item => item.product === product);
        if(existingItem) {
            setAlert({msg: 'Este producto ya fue agregado', type: types.ERROR});
            return;
        }
        setItems([...items, { product: (product.split('-')[2]).trim(), productName: (product.split('-')[1]).trim(), quantity: 1, price: (product.split('-')[0]).replace('$', '').trim() }]);
        setProductName('');
    }

    const addItem = async product => {
        const existingItems = items.map(item => {
            if(item.product === product) {
                item.quantity += 1;
            }
            
            return item;
        });
        setItems(existingItems);
    }

    const substractItem = async product => {
        const existingItems = items.map(item => {
            if(item.product === product) {
                item.quantity -= 1;
            }
            return item;
        });
        const existingItemsFiltered = existingItems.filter(item => item.quantity > 0);
        setItems(existingItemsFiltered);
    }

    const {msg} = alert;

  return (
    <>
        <GenericForm formTitle={id ? 'Actualizar orden' : 'Crear nueva orden'} submit={handleSubmit}>
            <label>Cliente</label>
            <input type="text" placeholder="Nombre del cliente" value={clientName} onChange={e => setClientName(e.target.value)} />
            <label>Fecha de entrega</label>
            <input type="date" value={deliverDate} onChange={e => setDeliverDate(e.target.value)} />
            <label>Agregar productos</label>
            <Autocomplete
                className='input-autocomplete'
                options={products.map((item) => `${item.price} - ${item.product} - ${item._id}`)}
                value={productName}
                onChange={ async (e, value) => {
                    await addProduct(value);
                }}
                renderInput={
                    (params) => (
                        <TextField 
                            {...params}
                            onChange={e => setProductName(e.target.value)}/>
                    )
                }
            />
            {
                items.length > 0 && (
                    <List className='product-list'>
                    {
                        items.map((item, index) => (
                            <>
                                <ListItem 
                                    disableGutters
                                    secondaryAction={
                                        <>
                                            <IconButton className='product-list-icon' onClick={() => addItem(item.product)}>
                                                <AddCircleOutlineRoundedIcon color="disabled" />
                                            </IconButton>
                                            <label>{item.quantity}</label>
                                            <IconButton className='product-list-icon' onClick={() => substractItem(item.product)}>
                                                <RemoveCircleOutlineRoundedIcon color="disabled" />
                                            </IconButton>
                                        </>
                                    }>
                                    <ListItemText primary={item.productName} />
                                </ListItem>
                                {
                                    (index !== items.length - 1) && (
                                        <Divider />
                                    )
                                }
                            </>
                        ))
                    }
                    </List>
                )
            }
            <label>Notas</label>
            <textarea type="text" placeholder="Notas" value={aditionalInfo} onChange={e => setAditionalInfo(e.target.value)} />
            <label>Subtotal: ${subTotal}</label>
            
        </GenericForm>
        {msg && <GenericAlert alert={alert} />}
        {loading && <Spinner />}
    </>
  )
}

export default OrderForm