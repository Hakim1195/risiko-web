import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/lobby" element={<Layout><Lobby /></Layout>} />
          <Route path="/game" element={<Layout><Game /></Layout>} />
          <Route path="/game/:matchId" element={<Layout><Game /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;