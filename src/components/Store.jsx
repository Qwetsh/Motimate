import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import StoreOverlay from './StoreOverlay';
import PurchaseHistoryOverlay from './PurchaseHistoryOverlay';

function Store({ user, setUser }) {
  const [purchases, setPurchases] = useState([]);
  const [isAddingPurchase, setIsAddingPurchase] = useState(false);
  const [newPurchaseName, setNewPurchaseName] = useState('');
  const [newPurchaseCost, setNewPurchaseCost] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [message, setMessage] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const fetchPurchases = async () => {
      const querySnapshot = await getDocs(collection(db, "purchases"));
      const purchasesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPurchases(purchasesArray);
    };

    fetchPurchases();
  }, []);

  const handleConfirmPurchase = async () => {
    if (user.balance >= selectedPurchase.cost) {
      const newBalance = user.balance - selectedPurchase.cost;
      setUser({ ...user, balance: newBalance });

      const userRef = doc(db, "users", user.username);
      await updateDoc(userRef, { balance: newBalance });

      await addDoc(collection(db, "purchaseHistory"), {
        username: user.username,
        purchaseName: selectedPurchase.name,
        cost: selectedPurchase.cost,
        purchasedAt: Timestamp.now(),
      });

      setMessage(`Vous avez acheté ${selectedPurchase.name} pour ${selectedPurchase.cost} coins !`);
    } else {
      setMessage("Solde insuffisant pour cet achat.");
    }

    setTimeout(() => setMessage(''), 3000);
    setSelectedPurchase(null);
  };

  const handleAddPurchase = async () => {
    if (newPurchaseName.trim() && newPurchaseCost) {
      const newPurchase = {
        name: newPurchaseName,
        cost: parseInt(newPurchaseCost, 10),
      };

      try {
        await addDoc(collection(db, "purchases"), newPurchase);

        setPurchases([...purchases, { id: purchases.length + 1, ...newPurchase }]);
        setNewPurchaseName('');
        setNewPurchaseCost('');
        setIsAddingPurchase(false);
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'achat :", error);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Magasin</h3>

      {/* Affichage du message d'achat */}
      {message && (
        <div className="text-center mb-4 text-sm font-semibold text-neonBlue">
          {message}
        </div>
      )}

      {/* Bouton pour voir l'historique des achats */}
      <div className="text-right mb-4">
        <button
          onClick={() => setIsHistoryOpen(true)}
          className="text-sm text-gray-400 hover:text-neonBlue transition duration-300"
        >
          Historique des achats
        </button>
      </div>

      {/* Affichage de la liste des achats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            onClick={() => setSelectedPurchase(purchase)}
            className="flex flex-col items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-4 shadow-lg cursor-pointer transform hover:scale-105 transition duration-300"
          >
            <span className="text-sm font-bold">{purchase.name}</span>
            <span className="text-xs font-semibold bg-neonBlue text-darkBg rounded-full px-2 py-0.5 mt-2">
              {purchase.cost} coins
            </span>
          </div>
        ))}

        {/* Bouton "Ajouter un achat" avec le même design */}
        <div
          onClick={() => setIsAddingPurchase(true)}
          className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-4 shadow-lg cursor-pointer transform hover:scale-105 transition duration-300"
        >
          <span className="text-sm font-bold">+ Ajouter un achat</span>
        </div>
      </div>

      {/* Overlay pour ajouter un nouvel achat */}
      {isAddingPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-darkBg p-6 rounded-lg shadow-lg w-full max-w-xs text-white">
            <h3 className="text-xl font-semibold mb-4 text-center">Nouvel achat</h3>
            <input
              type="text"
              placeholder="Nom de l'achat"
              value={newPurchaseName}
              onChange={(e) => setNewPurchaseName(e.target.value)}
              className="w-full mb-4 p-2 rounded-lg text-black"
            />
            <input
              type="number"
              placeholder="Coût (coins)"
              value={newPurchaseCost}
              onChange={(e) => setNewPurchaseCost(e.target.value)}
              className="w-full mb-4 p-2 rounded-lg text-black"
            />
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleAddPurchase}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300"
              >
                Ajouter
              </button>
              <button
                onClick={() => setIsAddingPurchase(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay pour confirmer un achat */}
      {selectedPurchase && (
        <StoreOverlay
          item={selectedPurchase}
          onConfirm={handleConfirmPurchase}
          onCancel={() => setSelectedPurchase(null)}
        />
      )}

      {/* Overlay pour afficher l'historique des achats */}
      {isHistoryOpen && (
        <PurchaseHistoryOverlay
          username={user.username}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}
    </div>
  );
}

export default Store;
