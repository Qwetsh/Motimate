import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

function TaskHistory({ username, onRefresh }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const historyRef = collection(db, "historique");
      const q = query(historyRef, where("username", "==", username), orderBy("completedAt", "desc"));
      const querySnapshot = await getDocs(q);

      const historyArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHistory(historyArray);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique :", error);
    } finally {
      setLoading(false);
    }
  };

  // Utiliser useEffect pour passer fetchHistory une seule fois
  useEffect(() => {
    fetchHistory();

    if (onRefresh) {
      onRefresh(() => fetchHistory()); // Passer fetchHistory sous forme de fonction callback
    }
  }, [username, onRefresh]);

  return (
    <div className="w-full max-w-md mx-auto mt-6 px-4">
      <h3 className="text-lg font-semibold mb-4 text-center">Historique des tâches réalisées</h3>

      {loading ? (
        <p className="text-gray-400 text-center">Chargement de l'historique...</p>
      ) : (
        <div className="bg-darkBg rounded-lg shadow-lg p-4 max-h-64 overflow-y-auto scrollable-content">
          <ul className="space-y-4">
            {history.length > 0 ? (
              history.map((entry) => (
                <li key={entry.id} className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg shadow-md">
                  <div>
                    <span className="font-semibold">{entry.taskName}</span>
                    <span className="block text-sm text-gray-300">
                      {new Date(entry.completedAt.seconds * 1000).toLocaleString()}
                    </span>
                  </div>
                  <span className="font-bold">+{entry.reward} coins</span>
                </li>
              ))
            ) : (
              <p className="text-gray-400 text-center">Aucune tâche accomplie pour le moment.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TaskHistory;
