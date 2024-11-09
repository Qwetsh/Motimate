import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

function PurchaseHistoryOverlay({ username, onClose }) {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      setLoading(true);
      try {
        const historyRef = collection(db, "purchaseHistory");
        const q = query(
          historyRef,
          where("username", "==", username),
          orderBy("purchasedAt", "desc")
        );
        const querySnapshot = await getDocs(q);

        const historyArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPurchaseHistory(historyArray);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique d'achats :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [username]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 " onClick={onClose} >
      <div className="bg-darkBg p-6 rounded-lg shadow-lg w-full max-w-md text-white text-center relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-xl font-bold">
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-4">Historique des achats</h3>
        
        {loading ? (
          <p className="text-gray-400">Chargement...</p>
        ) : purchaseHistory.length > 0 ? (
          <ul className="space-y-4 max-h-60 overflow-y-auto scrollable-content">
            {purchaseHistory.map((entry) => (
              <li key={entry.id} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg shadow-md flex justify-between items-center max-h-64 overflow-y-auto scrollable-content">
                <div>
                  <span className="font-semibold">{entry.purchaseName}</span>
                  <span className="block text-sm text-gray-300">{new Date(entry.purchasedAt.seconds * 1000).toLocaleString()}</span>
                </div>
                <span className="font-bold">{entry.cost} coins</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Aucun achat enregistré.</p>
        )}
      </div>
    </div>
  );
}

export default PurchaseHistoryOverlay;
