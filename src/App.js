import './App.css';
import Landing from './Pages/Landing/Landing';
import ToDoApplication from './Pages/TodoApplication/ToDoApplication';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={<Landing />}></Route>
          <Route path="/app" exact element={<ToDoApplication />}></Route>
        </Routes>
      </Router>
    </>

  );
}

export default App;
