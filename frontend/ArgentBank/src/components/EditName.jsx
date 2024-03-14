import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserName } from '../redux/reducer/profileSlice';

import '../styles/pages/_profile.scss';

export default function EditName() {

  const dispatch = useDispatch(); // Obtention de la fonction dispatch pour envoyer des actions à Redux

  const userProfile = useSelector((state) => state.user); // Récupération des données utilisateur depuis le store Redux

  const token = useSelector((state) => state.auth.token); // Récupération du token d'authentification depuis le store Redux

  const [isEditing, setEditing] = useState(false); // Gestion de l'état de l'édition du formulaire

  const [editedUserName, setEditedUserName] = useState(''); // Gestion de l'état du nom d'utilisateur édité (chaine de caractères vide)

  useEffect(() => {
    if (userProfile?.userName) { // Vérification si le userName existe dans les données utilisateur
      setEditedUserName(userProfile.userName); // Mise à jour de l'état du nom d'utilisateur édité avec le nom d'utilisateur actuel
    }
  }, [userProfile]); // Le useEffect est déclenché chaque fois que le userProfile change

  const handleEditClick = () => { // Définition d'une fonction pour gérer le clic sur le bouton d'édition
    setEditing(true); // Mise à jour de l'état pour activer le mode édition
  };

  const handleSaveClick = async (event) => { // Définition d'une fonction pour gérer le clic sur le bouton de sauvegarde
    event.preventDefault(); // Empêcher le comportement par défaut du formulaire
    setEditing(false); // Désactiver le mode édition

    try {
      const editedUserNameString = String(editedUserName); // Conversion du nom d'utilisateur édité en chaîne de caractères
      const response = await fetch('http://localhost:3001/api/v1/user/profile', { // Appel d'une API pour mettre à jour le profil utilisateur
        method: 'PUT',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Inclusion du token d'authentification dans les en-têtes de la requête
        },
        body: JSON.stringify({ // Corps de la requête contenant le nouveau nom d'utilisateur
          userName: editedUserNameString,
        }),
      });
      if (response.ok) { // Vérification si la requête s'est bien déroulée
        const responseData = await response.json(); // Extraction des données de la réponse
        dispatch(updateUserName(editedUserName)); // Dispatch de l'action updateUserName pour mettre à jour le nom d'utilisateur dans le store Redux
        console.log('Le nom d/utilisateur a été mis à jour avec succès :', responseData); // Affichage d'un message de succès dans la console
      } else {
        console.error('Error :', response.statusText); // Affichage d'un message d'erreur dans la console si la requête échoue
      }
    } catch (error) {
      console.error('Error : ', error); // Affichage d'un message d'erreur dans la console en cas d'erreur lors de l'appel à l'API
    }
  };

  const handleCanceClick = () => { // Définition d'une fonction pour gérer le clic sur le bouton d'annulation
    setEditedUserName(userProfile?.userName); // Réinitialisation du nom d'utilisateur édité avec le nom d'utilisateur actuel
    setEditing(false); // Désactive le mode édition
  };

  const handleUserNameChange = (event) => { // Définition d'une fonction pour gérer le changement du nom d'utilisateur édité
    setEditedUserName(event.target.value); // Mise à jour du nom d'utilisateur édité avec la valeur de l'entrée utilisateur
  };

  return (
    <> {/* Fragment React pour retourner plusieurs éléments sans englober dans une div */}
      {userProfile?.userName !== undefined && ( // Vérification si le nom d'utilisateur existe dans les données utilisateur
        <>
          {isEditing ? ( // Vérification si le mode édition est activé
            <form onSubmit={handleSaveClick}> {/* Formulaire pour modifier le nom d'utilisateur */}
              <h1>Edit User Info</h1>
              <div className="form">
                <div className="edit">
                  <label htmlFor="userName">User Name:</label>
                  <input type="text" id="userName" value={editedUserName} onChange={handleUserNameChange} autoComplete="userName" required /> {/* Champ d'édition du nom d'utilisateur */}
                </div>
                <div className="edit">
                  <label htmlFor="firstName">First Name:</label>
                  <input type="text" id="firstName" value={userProfile.firstName} readOnly />
                </div>
                <div className="edit">
                  <label htmlFor="lastName">Last Name:</label>
                  <input type="text" id="lastName" value={userProfile.lastName} readOnly />
                </div>
              </div>
              <div className="edit-ctaBtn">
                <button className="edit-button" type="submit">
                  Save
                </button>
                <button className="edit-button" type="button" onClick={handleCanceClick}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1>
                Welcome back
                <br />
                {`${userProfile.firstName} ${userProfile.lastName} !!`} {/* Affichage du prénom et du nom de famille de l'utilisateur */}
              </h1>
              <button className="edit-button" onClick={handleEditClick}> {/* Bouton pour activer le mode édition */}
                Edit Name
              </button>
            </>
          )}
        </>
      )}
    </>
  );
}
