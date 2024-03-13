import React, { useEffect, useState } from 'react';
import Account from '../components/Account';
import EditName from '../components/EditName';
import { useDispatch } from 'react-redux';
import { setProfile } from '../redux/reducer/profileSlice';
import '../styles/pages/_profile.scss';

export default function Profile() {
  // Utilise le hook useDispatch pour obtenir la fonction de dispatch du store Redux
  const dispatch = useDispatch();
  const [isTokenValidated, setIsTokenValidated] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setIsTokenValidated(true); // Marquer la validation du token comme effectuée
      window.location.href = '/login'; // Rediriger vers la page de connexion si aucun token n'est trouvé
    } else {
      setIsTokenValidated(true); // Marquer la validation du token comme effectuée
      fetchProfileData(authToken); // Appel à la fonction de récupération des données de profil
    }
  }, []);

  if (!localStorage.getItem('authToken')) {
    window.location.href = '/login';
    return null;
  }

  // Création d'une fonction asynchrone pour récupérer les données de profil depuis l'API
  async function fetchProfileData(authToken) {
    try {
      // Envoie une requête de type POST à l'API pour récupérer les données de profil
      const response = await fetch('http://localhost:3001/api/v1/user/profile', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      // Vérifie si la réponse est ok
      if (response.ok) {
        // La réponse est retournée en format JSON
        const responseData = await response.json();
        // Dispatch l'action setProfile avec les données de profil récupérées
        dispatch(setProfile(responseData));
        // Affiche dans la console les données de profil
        console.log(responseData);
        console.log(responseData.body);
      } else {
        // Affiche une erreur en cas de réponse non OK
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      // Affiche une erreur en cas d'échec de la requête
      console.error('Error', error);
    }
  }

  return (
    <main className="main bg-dark">
      <div className="header">
        <EditName />
      </div>
      <h2 className="sr-only">Accounts</h2>
      <Account title="Argent Bank Checking (x8349)" amount="$2,082.79" description="Available Balance" />
      <Account title="Argent Bank Savings (x6712)" amount="$10,928.42" description="Available Balance" />
      <Account title="Argent Bank Credit Card (x8349)" amount="$184.30" description="Current Balance" />
    </main>
  );
}
