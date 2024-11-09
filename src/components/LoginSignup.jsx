import React, { useState } from 'react';
import Login from './Login';
import Signup from './signup';

function LoginSignup({ onSignupSuccess, onLoginSuccess }) {
  const [showSignupModal, setShowSignupModal] = useState(false); // État pour gérer l'affichage de la modale d'inscription

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-darkBg text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Bienvenue</h1>

      {/* Section Connexion */}
      <div className="w-full max-w-md bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Connexion</h2>
        <Login onLoginSuccess={onLoginSuccess} />
      </div>

      {/* Section Inscription avec bouton pour ouvrir la modale */}
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Pas encore de compte ?</h2>
        <button
          onClick={() => setShowSignupModal(true)}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg hover:scale-105 transform transition duration-300"
        >
          Créer un compte
        </button>
      </div>

      {/* Modale d'inscription */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-darkBg p-6 rounded-lg shadow-lg w-full max-w-md text-white">
            <h2 className="text-2xl font-semibold text-center mb-4">Inscription</h2>
            <Signup onSignupSuccess={onSignupSuccess} />
            <button
              onClick={() => setShowSignupModal(false)}
              className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginSignup;
