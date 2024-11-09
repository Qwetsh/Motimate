import React from 'react';

function Home({ onNavigate }) {
  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-xs">
      <h1 className="text-2xl md:text-3xl font-bold text-neonBlue mb-6">Bienvenue, [Nom]</h1>
      
      <button
        onClick={() => onNavigate('tasks')}
        className="w-full h-14 bg-lightPurple text-white rounded-full flex items-center justify-center shadow-neomorph hover:shadow-neomorph-inset hover:bg-neonPink transition duration-300"
      >
        J'ai fait une tâche
      </button>

      <button
        onClick={() => onNavigate('store')}
        className="w-full h-14 bg-lightPurple text-white rounded-full flex items-center justify-center shadow-neomorph hover:shadow-neomorph-inset hover:bg-neonPink transition duration-300"
      >
        Magasin
      </button>
    </div>
  );
}

export default Home;
