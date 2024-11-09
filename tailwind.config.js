module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#1F1D2B',   // Couleur de fond sombre
        lightPurple: '#3E3A57', // Couleur pour les boutons
        neonBlue: '#4A3AFF', // Couleur pour les icônes et les accents
        neonPink: '#AB47BC', // Couleur pour les effets de survol et d’accentuation
      },
      boxShadow: {
        'neomorph-inset': 'inset 5px 5px 10px #1A1822, inset -5px -5px 10px #27263D',
        'neomorph': '5px 5px 10px #1A1822, -5px -5px 10px #27263D',
      },
    },
  },
  plugins: [],
};
