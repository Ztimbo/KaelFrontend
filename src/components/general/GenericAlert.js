import './Alert.scss';
import { Snackbar, Alert } from '@mui/material';
import { useEffect, useState } from 'react';

import './GenericAlert.scss';

const GenericAlert = ({alert}) => {
    const [open, setOpen] = useState(true);
    const [vertical, setVertical] = useState('top');
    const [horizontal, setHorizontal] = useState('right');

    const { msg, type } = alert;

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
    
      useEffect(() => {
        if(alert) {
          setOpen(true);
        }
      }, [alert]);
  return (
    <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert className='alert' onClose={handleClose} severity={type} sx={{ width: '100%' }}>
            {msg}
        </Alert>
    </Snackbar>
  )
}

export default GenericAlert