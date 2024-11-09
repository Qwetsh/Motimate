import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import TaskOverlay from './TaskOverlay';

function Tasks({ user, addCoins, refreshHistory }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskReward, setNewTaskReward] = useState('');

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

  const handleSelectTask = (task) => {
    setSelectedTask(task);
  };

  const handleConfirmTask = async () => {
    if (selectedTask) {
      addCoins(selectedTask.reward);

      // Enregistrer la tâche dans l'historique Firestore
      await addDoc(collection(db, "historique"), {
        username: user.username,
        taskName: selectedTask.name,
        reward: selectedTask.reward,
        completedAt: Timestamp.now(),
      });

      setSelectedTask(null);

      if (refreshHistory) {
        refreshHistory();
      }
    }
  };

  const handleAddTask = async () => {
    if (newTaskName.trim() && newTaskReward) {
      const newTask = {
        name: newTaskName,
        reward: parseInt(newTaskReward, 10),
      };
      
      try {
        // Ajouter la tâche dans Firestore
        await addDoc(collection(db, "tasks"), newTask);

        // Mettre à jour l'état pour affichage immédiat
        setTasks([...tasks, { id: tasks.length + 1, ...newTask }]);

        // Réinitialiser le formulaire et masquer l'overlay d'ajout
        setNewTaskName('');
        setNewTaskReward('');
        setIsAddingTask(false);
      } catch (error) {
        console.error("Erreur lors de l'ajout de la tâche :", error);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Liste des tâches</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Affichage des tâches */}
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => handleSelectTask(task)}
            className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-2xl p-4 shadow-lg cursor-pointer transform hover:scale-105 transition duration-300"
          >
            <span className="text-sm font-bold">{task.name}</span>
            <span className="text-xs font-semibold bg-neonBlue text-darkBg rounded-full px-2 py-0.5 mt-2">
              +{task.reward} coins
            </span>
          </div>
        ))}

        {/* Bouton Ajouter une tâche dans la grille des tâches */}
        <div
          onClick={() => setIsAddingTask(true)}
          className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-4 shadow-lg cursor-pointer transform hover:scale-105 transition duration-300"
        >
          <span className="text-sm font-bold">+ Ajouter une tâche</span>
        </div>
      </div>

      {/* Overlay pour ajouter une nouvelle tâche */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-darkBg p-6 rounded-lg shadow-lg w-full max-w-xs text-white">
            <h3 className="text-xl font-semibold mb-4 text-center">Nouvelle tâche</h3>
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

      {/* Overlay pour confirmer la tâche sélectionnée */}
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
