import './App.css';
import CreateClass from './components/teacher/CreateClass';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './components/common/Landing';

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/createClass" element={<CreateClass />} />
    </Routes>
  );
}

export default App;
