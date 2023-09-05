import {BrowserRouter, Routes, Route} from 'react-router-dom'

import './App.scss';
import Login from './components/user/Login';

import { AuthProvider } from './context/AuthProvider';
import LoggedInLayout from './layouts/LoggedInLayout';
import Dashboard from './components/dashboard/Dashboard';
import AuthLayout from './layouts/AuthLayout';
import Users from './components/user/Users';
import NewUser from './components/user/NewUser';
import UpdateUser from './components/user/UpdateUser';
import Products from './components/products/Products';
import Orders from './components/orders/Orders';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<AuthLayout />}>
              <Route index element={<Login />} />
            </Route>
            
            <Route path='/' element={<LoggedInLayout />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/users'>
                <Route index element={<Users />} />
                <Route path='new' element={<NewUser />} />
                <Route path='update/:id' element={<UpdateUser />} />
              </Route>
              <Route path='/products'>
                <Route index element={<Products />} />
              </Route>
              <Route path='/orders'>
                <Route index element={<Orders />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
