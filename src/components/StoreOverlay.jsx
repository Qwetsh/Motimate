import React from 'react';

function StoreOverlay({ item, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-darkBg text-white p-6 rounded-lg shadow-lg w-full max-w-xs text-center">
        <h3 className="text-xl font-semibold mb-4">Confirmer l'achat</h3>
        <p className="mb-4">Voulez-vous acheter <strong>{item.name}</strong> pour <strong>{item.cost} coins</strong> ?</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300"
          >
            Confirmer
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoreOverlay;
