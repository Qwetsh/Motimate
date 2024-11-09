import React, { useState } from 'react';
import LoginSignup from './components/LoginSignup';
import Tasks from './components/Tasks';
import Store from './components/Store';
import Scores from './components/Scores';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('');

  const handleSignupSuccess = (userData) => {
    setUser(userData);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setView('');
  };

  const addCoins = async (amount) => {
    if (user) {
      const newBalance = user.balance + amount;
      setUser({ ...user, balance: newBalance });

      const userRef = doc(db, "users", user.username);
      await updateDoc(userRef, {
        balance: newBalance,
      });
    }
  };

  const changeView = (viewName) => {
    setView(viewName);
  };

  return (
    <div className="bg-darkBg min-h-screen flex flex-col items-center py-4 text-white">
      {!user ? (
        <LoginSignup onSignupSuccess={handleSignupSuccess} onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-2">Bienvenue, {user.username}</h2>
          <p className="text-lg mb-6">Solde : <span className="text-neonBlue">{user.balance} coins</span></p>

          {/* Menu de sélection */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => changeView('tasks')}
              className={`py-2 px-4 rounded-full font-semibold transition duration-300 ${
                view === 'tasks' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'bg-gray-700 text-white'
              } hover:scale-105 transform shadow-lg`}
            >
              Compléter une tâche
            </button>
            <button
              onClick={() => changeView('store')}
              className={`py-2 px-4 rounded-full font-semibold transition duration-300 ${
                view === 'store' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'bg-gray-700 text-white'
              } hover:scale-105 transform shadow-lg`}
            >
              Magasin
            </button>
            <button
              onClick={() => changeView('scores')}
              className={`py-2 px-4 rounded-full font-semibold transition duration-300 ${
                view === 'scores' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'bg-gray-700 text-white'
              } hover:scale-105 transform shadow-lg`}
            >
              Voir les scores
            </button>
          </div>

          {/* Bouton Se déconnecter */}
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full py-2 px-4 shadow-lg transition duration-300 transform hover:scale-105"
          >
            Se déconnecter
          </button>
          
          {/* Affichage conditionnel des vues */}
          <div className="w-full max-w-md mt-6">
            {view === 'tasks' && <Tasks user={user} addCoins={addCoins} />}
            {view === 'store' && <Store user={user} setUser={setUser} />}
            {view === 'scores' && <Scores />}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
