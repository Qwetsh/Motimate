import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import TaskOverlay from './TaskOverlay'; // Importer TaskOverlay

function Tasks({ user, addCoins }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false); // État pour gérer l'affichage du formulaire de création de tâche
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskReward, setNewTaskReward] = useState('');

  // Charger les tâches depuis Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const tasksArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksArray);
    };

    fetchTasks();
  }, []);

  // Fonction pour sélectionner une tâche
  const handleSelectTask = (task) => {
    setSelectedTask(task);
  };

  // Fonction pour confirmer la tâche
  const handleConfirmTask = () => {
    if (selectedTask) {
      addCoins(selectedTask.reward); // Ajoute des coins au solde de l'utilisateur
      setSelectedTask(null); // Ferme l'overlay
    }
  };

  // Fonction pour ajouter une nouvelle tâche dans Firestore
  const handleAddTask = async () => {
    if (!newTaskName.trim() || !newTaskReward) {
      alert("Veuillez entrer un nom de tâche et une récompense valide.");
      return;
    }

    const newTask = {
      name: newTaskName,
      reward: parseInt(newTaskReward, 10),
    };

    try {
      // Ajouter la tâche dans Firestore
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      
      // Ajouter la tâche à l'état local pour affichage immédiat
      setTasks([...tasks, { id: docRef.id, ...newTask }]);
      
      // Réinitialiser le formulaire
      setNewTaskName('');
      setNewTaskReward('');
      setIsAddingTask(false); // Fermer le formulaire après l'ajout
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche :", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Liste des tâches</h3>

      {/* Bouton pour créer une nouvelle tâche */}
      <button
        onClick={() => setIsAddingTask(true)}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-full py-2 mt-4 mb-4 shadow-md hover:shadow-lg hover:scale-105 transform transition duration-200"
      >
        + Créer une tâche
      </button>

      {/* Grille d'affichage des tâches */}
      <div className="grid grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => handleSelectTask(task)}
            className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-2xl shadow-lg p-4 cursor-pointer transform hover:scale-105 transition duration-300"
          >
            <span className="text-sm font-bold">{task.name}</span>
            <span className="text-xs font-semibold bg-neonBlue text-darkBg rounded-full px-2 py-0.5 mt-2">
              +{task.reward} coins
            </span>
          </div>
        ))}
      </div>

      {/* Formulaire d'ajout de tâche */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-darkBg text-white p-6 rounded-lg shadow-lg w-full max-w-xs text-center">
            <h3 className="text-xl font-semibold mb-4">Ajouter une tâche</h3>
            <input
              type="text"
              placeholder="Nom de la tâche"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="w-full mb-4 p-2 rounded-lg text-black"
            />
            <input
              type="number"
              placeholder="Récompense (coins)"
              value={newTaskReward}
              onChange={(e) => setNewTaskReward(e.target.value)}
              className="w-full mb-4 p-2 rounded-lg text-black"
            />
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleAddTask}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300"
              >
                Ajouter
              </button>
              <button
                onClick={() => setIsAddingTask(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Afficher TaskOverlay si une tâche est sélectionnée */}
      {selectedTask && (
        <TaskOverlay
          task={selectedTask}
          onConfirm={handleConfirmTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}

export default Tasks;
