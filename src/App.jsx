import React, { useState } from 'react';
import LoginSignup from './components/LoginSignup';
import Tasks from './components/Tasks';
import Store from './components/Store';
import Scores from './components/Scores';
import TaskHistory from './components/TaskHistory';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(null);

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

  // Fonction pour gérer le clic à l'extérieur de l'overlay
  const handleOverlayClick = (e) => {
    if (e.target.id === "overlay") {
      setIsHistoryOpen(false);
    }
  };

  return (
    <div className="bg-darkBg min-h-screen flex flex-col items-center py-4 text-white">
      {!user ? (
        <LoginSignup onSignupSuccess={handleSignupSuccess} onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-2">Bienvenue, {user.username}</h2>
          <div className="flex items-center space-x-2 mb-6">
            <p className="text-lg">Solde : <span className="text-neonBlue">{user.balance} coins</span></p>
            
            {/* Bouton Voir l'historique, discret et aligné à droite de la solde */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="text-sm text-gray-400 hover:text-neonBlue transition duration-300"
            >
              Voir l'historique
            </button>
          </div>

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

          <button
            onClick={handleLogout}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full py-2 px-4 shadow-lg transition duration-300 transform hover:scale-105"
          >
            Se déconnecter
          </button>
          
          {/* Affichage conditionnel des vues */}
          <div className="w-full max-w-md mt-6">
            {view === 'tasks' && (
              <Tasks
                user={user}
                addCoins={addCoins}
              />
            )}
            {view === 'store' && <Store user={user} setUser={setUser} />}
            {view === 'scores' && <Scores />}
          </div>

          {/* Overlay de l'historique des tâches */}
          {isHistoryOpen && (
            <div
              id="overlay" // ID pour détecter les clics en dehors de la fenêtre
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              onClick={handleOverlayClick} // Gestionnaire pour fermer l'overlay au clic à l'extérieur
            >
              <div className="bg-darkBg p-6 rounded-lg shadow-lg w-full max-w-md text-white relative">
                <button
                  onClick={() => setIsHistoryOpen(false)} // Fermer l'overlay
                  className="absolute top-4 right-4 text-white text-xl font-bold"
                >
                  &times;
                </button>
                <TaskHistory username={user.username} onRefresh={setRefreshHistory} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
