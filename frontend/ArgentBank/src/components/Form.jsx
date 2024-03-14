// Correspond au formulaire de connexion.

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSignIn } from '../redux/reducer/authSlice';
import '../styles/components/_form.scss';

export default function Form() {
  // Obtention d'une référence à la fonction dispatch de Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Stockage des valeurs des champs du formulaire
  const [email, setEmail] = useState(''); // chaine de caractères vide
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fonction qui gère la soumission du formulaire, qui prend en prop " e " pour event
  const handleSubmit = async (e) => {
    e.preventDefault(); // pour éviter le comportement par défaut (ici, le rechargement de la page en appuyant sur un btn de type submit ou sur entrée)

    // Création d'un objet 'formData avec les valeurs des champs du formulaire
    const formData = {
      email: email,
      password: password,
    };

    try {
      // Envoie d'une requête HTTP POST vers l'API pour la connexion de l'utilisateur
      const response = await fetch('http://localhost:3001/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      // Vérification de la réussite de la requête
      if (response.ok) {
        // Récupération des données de réponse au format JSON
        const responseData = await response.json();
        console.log(responseData);

        // Extraction du jeton d'authentification (contenu dans le corps/body de la réponse de la requête à l'API) et sauvegarde dans le LocalStorage
        const token = responseData.body.token;
        localStorage.setItem('authToken', token);
        // Redirection vers la page utilisateur après une connexion réussie
        navigate('/profile');
        // Envoi de l'action pour indiquer au store Redux que l'utilisateur est connecté
        dispatch(setSignIn({ token }));
      } else {
        // En cas d'erreur, récupération des données d'erreur au format JSON
        const errorData = await response.json();
        console.error('Erreur :', response.statusText);
        // Mise à jour du message d'erreur à afficher dans le formulaire
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      // Gestion des erreurs imprévues pendant le processus d'envoi de la requête
      console.error('Erreur :', error);
      // Mise à jour du message d'erreur à afficher dans le formulaire
      setErrorMessage('an error has occured');
    }
  };

  return (
    <section className="sign-in-content">
      <i className="fa fa-user-circle sign-in-icon"></i>
      <h1>Sign In</h1>

      {/* Formulaire avec gestion conditionnelle de l'affichage du message d'erreur */}
      <form onSubmit={handleSubmit}> {/* Formulaire avec une action déclenchée lors de la soumission */}
        {errorMessage && <p className="errorMsg">{errorMessage}</p>} {/* Affichage du message d'erreur s'il existe */}
        <div className="input-wrapper">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required /> {/* Si nécessaire, voir plus bas pour le onChange */}
        </div>
        <div className="input-wrapper">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <div className="input-remember">
          <input type="checkbox" id="remember-me" />
          <label htmlFor="remember-me">Remember me</label>
        </div>
        <button type="submit" className="sign-in-button">
          Sign In
        </button>
      </form>

    </section>
  );
}

// 'onChange' est utilisé pour surveiller les changements de contenu dans l'input et pour mettre à jour l'état correspondant (email dans ce cas),
// en fonction de la saisie de l'utilisateur.
