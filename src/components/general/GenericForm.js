import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import './GenericForm.scss'

const GenericForm = ({children, formTitle, submit, handleDelete}) => {
  return (
    <Card className='form' sx={{ minWidth: 275 }}>
        <div className='form-header'>
            <span>{formTitle}</span>
        </div>
        <CardContent className='form-card'>
            <form className='form-content-container' onSubmit={submit}>
                <div className='form-content'>
                    {children}
                </div>
                
                <button className='submit-button' type='submit'>Guardar</button>
                {formTitle.includes('Actualizar') && <button className='delete-button' type='button' onClick={handleDelete}>Eliminar</button>}
            </form>
        </CardContent>
    </Card>
  )
}

export default GenericForm