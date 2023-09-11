import ProductForm from './generic/ProductForm'
import { useParams } from 'react-router-dom'

const UpdateProduct = () => {
    const { id } = useParams();
  return (
    <div className='form-container'>
        <ProductForm id={id} />
    </div>
  )
}

export default UpdateProduct