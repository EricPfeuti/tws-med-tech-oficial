import { BrowserRouter, Route, Routes } from 'react-router-dom'

import "bootstrap-icons/font/bootstrap-icons.css";
import Index from './pages/index';
import Register from './pages/Register/Register';
import SignDoctor from './pages/Doctor/SignDoctor/SignDoctor';
import LoginDoctor from './pages/Doctor/LoginDoctor/LoginDoctor';
import SignPatient from './pages/Patient/SignPatient/SignPatient';
import LoginPatient from './pages/Patient/LoginPatient/LoginPatient';
import Doctor from './pages/Doctor/Home/HomeDoctor';
import Patient from './pages/Patient/Home/HomePatient';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/register' element={<Register />} />
        <Route path='/signDoctor' element={<SignDoctor />} />
        <Route path='/loginDoctor' element={<LoginDoctor />} />
        <Route path='/signPatient' element={<SignPatient />} />
        <Route path='/loginPatient' element={<LoginPatient />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/patient" element={<Patient />} />
        <Route path='*' element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;