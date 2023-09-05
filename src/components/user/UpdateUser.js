import './UpdateUser.scss'
import UserForm from './generic/UserForm'
import { useParams } from 'react-router-dom'

const UpdateUser = () => {
    const { id } = useParams();

  return (
    <div className='form-container'>
        <UserForm id={id} />
    </div>
  )
}

export default UpdateUser