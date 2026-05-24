import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home';
import RoomList from './components/Rooms/RoomList';

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [view, setView] = useState<'home' | 'login' | 'register' | 'rooms'>('home');

  useEffect(() => {
    // Connect to the backend socket
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setView('rooms');
  };

  const handleRegister = (user: any) => {
    setCurrentUser(user);
    setView('rooms');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
  };

  const sendMessage = () => {
    if (socket && message.trim() !== '') {
      socket.emit('message', message);
      setMessage('');
    }
  };

  const renderCurrentView = () => {
    if (!currentUser) {
      switch (view) {
        case 'login':
          return <Login onLogin={handleLogin} />;
        case 'register':
          return <Register onRegister={handleRegister} />;
        default:
          return <Home />;
      }
    }

    // User is logged in
    switch (view) {
      case 'rooms':
        return (
          <div>
            <div className="user-header">
              <span>Bienvenue, {currentUser.username}</span>
              <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
            </div>
            <RoomList />
          </div>
        );
      default:
        return (
          <div>
            <div className="user-header">
              <span>Bienvenue, {currentUser.username}</span>
              <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
            </div>
            <Home />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-6">Game Board Strategy</h1>
        
        <div className="mb-4">
          <p className="text-center">
            {isConnected ? (
              <span className="text-green-500">Connected to server</span>
            ) : (
              <span className="text-red-500">Disconnected from server</span>
            )}
          </p>
        </div>

        {/* Navigation */}
        {!currentUser && (
          <div className="flex justify-center space-x-4 mb-6">
            <button 
              onClick={() => setView('home')}
              className={`px-4 py-2 rounded ${view === 'home' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Accueil
            </button>
            <button 
              onClick={() => setView('login')}
              className={`px-4 py-2 rounded ${view === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Se connecter
            </button>
            <button 
              onClick={() => setView('register')}
              className={`px-4 py-2 rounded ${view === 'register' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              S'inscrire
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="mb-8">
          {renderCurrentView()}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Game Features</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Real-time multiplayer gameplay</li>
            <li>Interactive world map</li>
            <li>Troop movement and combat</li>
            <li>Dice rolling animations</li>
            <li>Player profiles and statistics</li>
            <li>Competitive ranking system</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;