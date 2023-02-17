import './App.css';
import Landing from './Pages/Landing/Landing';
import { useState, useEffect } from 'react';
import ToDoApplication from './Pages/TodoApplication/ToDoApplication';
import { BrowserRouter as Router, Switch, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Landing />}></Route>
        <Route path="/app" exact element={<ToDoApplication />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
