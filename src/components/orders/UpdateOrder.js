import OrderForm from './generic/OrderForm'
import { useParams } from 'react-router-dom'

const UpdateOrder = () => {
    const { id } = useParams();
  return (
    <div className='form-container'>
        <OrderForm id={id} />
    </div>
  )
}

export default UpdateOrder