import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

function Signup({ onSignupSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!username || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      // Vérifier si le nom de compte existe déjà
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("Nom de compte déjà pris. Veuillez en choisir un autre.");
        return;
      }

      // Créer un nouveau document utilisateur dans Firestore
      const newUserRef = doc(usersRef, username); // Utilise le nom de compte comme ID de document pour plus de simplicité
      await setDoc(newUserRef, {
        username: username,
        password: password, // Pour un vrai projet, n'enregistrez pas de mot de passe en clair.
        balance: 0,
        tasks: []
      });

      alert("Inscription réussie !");
      onSignupSuccess({ username, balance: 0, tasks: [] });
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      alert("Erreur lors de l'inscription : " + error.message);
    }
  };

  return (
    <div className="bg-darkBg text-white p-6 rounded-lg shadow-lg w-full max-w-xs mx-auto mb-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Inscription</h2>
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
        onClick={handleSignup}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full py-2 shadow-md hover:shadow-lg transition duration-300"
      >
        S'inscrire
      </button>
    </div>
  );
}

export default Signup;
