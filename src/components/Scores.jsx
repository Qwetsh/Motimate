import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

function Scores() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        // Récupérer les utilisateurs depuis Firestore, triés par solde en ordre décroissant
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("balance", "desc"));
        const querySnapshot = await getDocs(q);

        // Mettre en forme les données des utilisateurs
        const usersArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersArray);
      } catch (error) {
        console.error("Erreur lors de la récupération des scores :", error);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-6 px-4">
      <h3 className="text-lg font-semibold mb-4 text-center">Scores des Utilisateurs</h3>

      <ul className="bg-darkBg rounded-lg shadow-lg p-4 space-y-4">
        {users.map((user, index) => (
          <li key={user.id} className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg shadow-md">
            <span className="font-semibold">{index + 1}. {user.username}</span>
            <span className="font-bold">{user.balance} coins</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Scores;
