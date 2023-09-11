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

const ProductForm = ({id}) => {
    const [_id, setId] = useState('');
    const [product, setProduct] = useState('');
    const [price, setPrice] = useState('');
    const [alert, setAlert] = useState({});
    const [isOpened, setIsOpened] = useState(false);

    const navigate = useNavigate();
    const {setLoading, loading} = useAuth();

    useEffect(() => {
        const getProduct = async () => {
            if(id) {
                try {
                    setLoading(true);
                    const {data} = await axiosClient.get(`/products/${id}`, getOptions());
                
                    if(!data) {
                        setAlert({msg: 'Producto no encontrado', type: types.ERROR});
                        return;
                    }

                    setId(data._id);
                    setProduct(data.product);
                    setPrice(`$${data.price}`);
                } catch(err) {
                    setAlert({msg: 'Error', type: types.ERROR});
                } finally {
                    setLoading(false);
                }
            }
        }
        
        getProduct();
    }, [id]);

    const handleSubmit = async e => { 
        e.preventDefault();

        try {
            setLoading(true);
        
            if(!id && [product, price].includes('')) {
                setAlert({msg: 'Todos los campos son obligatorios', type: types.ERROR});
                return;
            }

            const numericPrice = Number(price.replace('$', ''));

            const {data} = !id ? await axiosClient.post('/products', {product, price: numericPrice}, getOptions()) 
                                : await axiosClient.put(`/products/${id}`, {product, price: numericPrice}, getOptions());

            setAlert({msg: data.message, type: types.SUCCESS});

            setTimeout(() => {
                setProduct('');
                setPrice('');
                navigate('/products');
            }, 2000);
        } catch(err) {
            setPrice(handleChangePrice(price));
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

            const {data} = await axiosClient.delete(`/products/${id}`, getOptions());
            setAlert({msg: data.message, type: types.SUCCESS});
            setIsOpened(false);

            setTimeout(() => {
                navigate('/products');
            }, 2000);
        } catch(err) {
            setAlert({msg: 'Error en el servidor', type: types.ERROR});
        } finally {
            setLoading(false);
        }
    }

    const handleChangePrice = inputPrice => {
        let formattedPrice = inputPrice.toString().replace('$', '');

        if(isNaN(Number(formattedPrice))) {
            setAlert({msg: 'Solo se permiten valore numéricos', type: types.ERROR});
            return `$${formattedPrice.toString().substring(0, formattedPrice.toString().length - 1)}`;
        }

        return formattedPrice.length > 0 ? `$${formattedPrice}` : '';
    }

    const {msg} = alert;
  return (
    <>
        <GenericForm formTitle={id ? 'Actualizar producto' : 'Crear nuevo producto'} submit={handleSubmit} handleDelete={handleDelete}>
            <label>Producto</label>
            <input type="text" placeholder="Nombre del producto" value={product} onChange={e => setProduct(e.target.value)} />
            <label>Precio</label>
            <input type="text" placeholder="Precio" value={price} onChange={e => setPrice(handleChangePrice(e.target.value))} />
        </GenericForm>
        {msg && <GenericAlert alert={alert} />}
        {loading && <Spinner />}
        <GenericDialog isOpened={isOpened} setIsOpened={setIsOpened} dialogTitle={'¿Desea eliminar este producto?'} dialogContentText={'Esta acción no puede ser revertida.'} handleDeleteItem={handleDeleteItem} />
    </>
  )
}

export default ProductForm