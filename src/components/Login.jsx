import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      // Vérifier les informations de connexion
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Nom de compte ou mot de passe incorrect.");
        return;
      }

      // Utilisateur trouvé, récupérer ses données
      const userData = querySnapshot.docs[0].data();
      alert("Connexion réussie !");
      onLoginSuccess(userData);
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Erreur lors de la connexion : " + error.message);
    }
  };

  return (
    <div className="bg-darkBg text-white p-6 rounded-lg shadow-lg w-full max-w-xs mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4">Connexion</h2>
      <input
        type="text"
        placeholder="Nom de compte"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-4 p-2 rounded-lg text-darkBg shadow-inner"
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 p-2 rounded-lg text-darkBg shadow-inner"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full py-2 shadow-md hover:shadow-lg transition duration-300"
      >
        Se connecter
      </button>
    </div>
  );
}

export default Login;
