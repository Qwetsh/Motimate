import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import TaskOverlay from './TaskOverlay';
import './CoinsAnimation.css';

function Tasks({ user, addCoins, refreshHistory }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskReward, setNewTaskReward] = useState('');
  const [coinsToAnimate, setCoinsToAnimate] = useState([]);
  const soldeRef = useRef(null);

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

  const handleSelectTask = (task, event) => {
    // Ignorer si le clic vient du bouton de suppression
    if (event.target.tagName === 'BUTTON') return;

    const taskButtonRect = event.currentTarget.getBoundingClientRect();
    const startX = taskButtonRect.left + taskButtonRect.width / 2;
    const startY = taskButtonRect.top + taskButtonRect.height / 2;

    setSelectedTask({ ...task, startX, startY });
  };

  const handleConfirmTask = async () => {
    if (selectedTask) {
      const { startX, startY } = selectedTask;
      const coinCount = Math.min(selectedTask.reward, 20);

      const soldeRect = soldeRef.current.getBoundingClientRect();
      const endX = soldeRect.left + soldeRect.width / 2;
      const endY = soldeRect.top + soldeRect.height / 2;

      for (let i = 0; i < coinCount; i++) {
        setTimeout(() => {
          setCoinsToAnimate((prevCoins) => [
            ...prevCoins,
            {
              id: Date.now() + i,
              startX,
              startY,
              translateX: endX - startX,
              translateY: endY - startY,
            },
          ]);
        }, i * 100);
      }

      addCoins(selectedTask.reward);

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

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche :", error);
    }
  };

  const handleAddTask = async () => {
    if (newTaskName.trim() && newTaskReward) {
      const newTask = {
        name: newTaskName,
        reward: parseInt(newTaskReward, 10),
      };

      try {
        const taskRef = await addDoc(collection(db, "tasks"), newTask);
        setTasks([...tasks, { id: taskRef.id, ...newTask }]);
        setNewTaskName('');
        setNewTaskReward('');
        setIsAddingTask(false);
      } catch (error) {
        console.error("Erreur lors de l'ajout de la tâche :", error);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCoinsToAnimate([]);
    }, 1500);

    return () => clearTimeout(timer);
  }, [coinsToAnimate]);

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Solde : <span ref={soldeRef} className="balance-display">{user.balance} coins</span>
      </h3>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={(e) => handleSelectTask(task, e)}
            className="relative flex flex-col items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-2xl p-4 shadow-lg cursor-pointer transform hover:scale-105 transition duration-300"
          >
            <span className="text-sm font-bold">{task.name}</span>
            <span className="text-xs font-semibold bg-neonBlue text-darkBg rounded-full px-2 py-0.5 mt-2">
              +{task.reward} coins
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation(); // Empêcher le clic de se propager au parent
                handleDeleteTask(task.id);
              }}
              className="absolute top-2 right-2 text-white p-1 rounded-full hover:bg-red-600 transition duration-200"
            >
              X
            </button>
          </div>
        ))}

        <div
          onClick={() => setIsAddingTask(true)}
          className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-4 shadow-lg cursor-pointer transform hover:scale-105 transition duration-300"
        >
          <span className="text-sm font-bold">+ Ajouter une tâche</span>
        </div>
      </div>

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

      {selectedTask && (
        <TaskOverlay
          task={selectedTask}
          onConfirm={handleConfirmTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      <div className="coins-animation-container">
        {coinsToAnimate.map((coin) => (
          <div
            key={coin.id}
            className="coin-animation"
            style={{
              left: `${coin.startX}px`,
              top: `${coin.startY}px`,
              transform: `translate(${coin.translateX}px, ${coin.translateY}px)`,
              transition: "transform 1.5s ease, opacity 1.5s ease",
              opacity: 0,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
