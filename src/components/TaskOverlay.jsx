import React from 'react';

function TaskOverlay({ task, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-darkBg p-6 rounded-lg shadow-neomorph text-center text-white space-y-4 w-64">
        <h3 className="text-lg font-bold">Confirmer la tâche</h3>
        <p>Valider <span className="text-neonBlue font-semibold">{task.name}</span> et gagner {task.reward} coins ?</p>
        <button
          onClick={(e) => onConfirm(e)} // Passe l'événement de clic
          className="w-full px-4 py-2 bg-neonBlue rounded-full shadow-neomorph hover:bg-neonPink transition duration-300 text-white"
        >
          Valider
        </button>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-lightPurple rounded-full shadow-neomorph hover:bg-darkBg transition duration-300 text-white"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

export default TaskOverlay;
