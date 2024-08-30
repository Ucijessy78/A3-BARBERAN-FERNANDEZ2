import './App.css';
import { Route, BrowserRouter as Router, Routes  } from 'react-router-dom';

import { Navbar } from './components/Navbar';
import { GestionProductos } from './components/GestionProductos';
import { GestionCategorias } from './components/GestionCategorias';
import { Home } from './components/Home';


function App() {
  return (
    <Router>
      <Navbar />      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/productos' element={<GestionProductos />} />
        <Route path='/categorias' element={<GestionCategorias />} />
      </Routes>
    </Router>
  );
}


export default App;
