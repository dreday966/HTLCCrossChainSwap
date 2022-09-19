import logo from './logo.svg';
import './App.css';
import { Some } from './routeComponents/some';
import { Charts } from './routeComponents/charts';
import { Routes, Route, Link } from "react-router-dom";
import { A } from './routeComponents/a';
import { B } from './routeComponents/b';

function App() {
  return (
    <div>
      
      <Routes>
        <Route path="/" element={<A />} />
        <Route path="/b" element={<B />} />
      </Routes>
    </div>
  );
}



export default App;
