import { BrowserRouter, Route, Routes } from 'react-router-dom'

import "bootstrap-icons/font/bootstrap-icons.css";
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='*' element={<h1>Not Found</h1>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;