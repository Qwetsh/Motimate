import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import StoreOverlay from './StoreOverlay';

const rewards = [
  { id: 1, name: "Sortie au cinéma", cost: 50 },
  { id: 2, name: "Repas au restaurant", cost: 120 },
  { id: 3, name: "Soirée jeux de société", cost: 30 },
  { id: 4, name: "Journée spa", cost: 200 },
  { id: 5, name: "Carte cadeau (10€)", cost: 150 },
  // Ajoutez d'autres récompenses ici
];

function Store({ user, setUser }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [notification, setNotification] = useState('');

  const handlePurchaseClick = (item) => {
    if (user.balance < item.cost) {
      setNotification("Solde insuffisant pour cet achat.");
      setTimeout(() => setNotification(''), 3000);
      return;
    }
    setSelectedItem(item);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedItem) return;
    const newBalance = user.balance - selectedItem.cost;
    setUser({ ...user, balance: newBalance });
    const userRef = doc(db, "users", user.username);
    await updateDoc(userRef, { balance: newBalance });
    setNotification(`Vous avez acheté : ${selectedItem.name}`);
    setTimeout(() => setNotification(''), 3000);
    setSelectedItem(null);
  };

  const handleCancelPurchase = () => setSelectedItem(null);

  return (
    <div className="w-full max-w-md mx-auto mt-6 px-4"> {/* Ajout de px-4 pour l'espacement horizontal */}
      <h3 className="text-lg font-semibold mb-4 text-center">Magasin</h3>
      
      {/* Notification de succès ou d'erreur */}
      {notification && (
        <div className="bg-blue-600 text-white p-2 mb-4 rounded-lg text-center">
          {notification}
        </div>
      )}

      {/* Grille d'affichage des récompenses */}
      <div className="grid grid-cols-3 gap-6">
        {rewards.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-2xl p-4 shadow-lg cursor-pointer transform hover:scale-105 transition duration-300"
            onClick={() => handlePurchaseClick(item)}
          >
            {/* Emplacement pour une future image */}
            <div className="w-16 h-16 bg-gray-300 rounded-full mb-3 flex items-center justify-center">
              <span className="text-gray-700 font-bold text-xl">🏆</span>
            </div>

            {/* Nom de la récompense */}
            <span className="text-sm font-semibold text-center">{item.name}</span>

            {/* Prix en coins */}
            <span className="mt-2 text-xs font-semibold bg-neonBlue text-white rounded-full px-2 py-0.5">
              {item.cost} coins
            </span>
          </div>
        ))}
      </div>

      {/* Afficher StoreOverlay si un article est sélectionné */}
      {selectedItem && (
        <StoreOverlay
          item={selectedItem}
          onConfirm={handleConfirmPurchase}
          onCancel={handleCancelPurchase}
        />
      )}
    </div>
  );
}

export default Store;
