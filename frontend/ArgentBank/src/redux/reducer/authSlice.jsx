import { createSlice } from '@reduxjs/toolkit';

// Fonction de vérification si un jeton d'authentification est présent dans le LocalStorage
const checkToken = () => {
  return localStorage.getItem('authToken') || null;
};

// État initial du slice d'authentification
const initialState = {
  // Propriétés
  token: checkToken(), // Initialise le token avec la valeur renvoyé par checkToken()
  isAuthentificated: false, // Initialise isAuthentificated à false par défaut
};

// Crée un slice d'authentification avec un nom, un état initial et des réducteurs
const authSlice = createSlice({
  name: 'auth', // Nom du slice
  initialState, // État initial (je reprends ma const plus haut)
  reducers: {
    // Réducteur qui met à jour l'état pour indiquer une connexion réussie
    setSignIn(state, action) {
      state.token = action.payload.token; // Met à jour le token avec la valeur passée dans l'action
      state.isAuthentificated = true; // Indique que l'utilisateur est authentifié
    },
    // Réducteur qui met à jour l'état pour indiquer une déconnexion
    setSignOut(state) {
      state.token = null; // Réinitialise le token à null
      state.isAuthentificated = false; // Indique que l'utilisateur n'est plus authentifié
      localStorage.removeItem('authToken'); // Supprime le jeton d'authentification du LocalStorage
    },
  },
});

// Export les actions générées par le slice (setSignIn, setSignOut)
export const { setSignIn, setSignOut } = authSlice.actions;
// Export le réducteur généré par le slice
export default authSlice.reducer;
