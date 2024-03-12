import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserName } from '../redux/reducer/profileSlice';
import '../styles/pages/_profile.scss';

export default function EditName() {
  // Obtention de la fonction dispatch du Redux pour envoyer des actions
  const dispatch = useDispatch();

  // Récupération des données du Redux store de l'utilisateur
  const userProfile = useSelector((state) => state.user);

  // Récupération du jeton d'authentification depuis le Redux store
  const token = useSelector((state) => state.auth.token);

  // Utilisation du hook useState pour gérer l'état d'ouverture du formulaire
  const [isEditing, setEditing] = useState(false);

  // Utilisation du hook useState pour définir l'état du nom utilisateur édité (par défaut le nom utilisateur du redux store enregistré est utilisé)
  const [editedUserName, setEditedUserName] = useState('');

  useEffect(() => {
    if (userProfile?.userName !== undefined) {
      setEditedUserName(userProfile.userName);
    }
  }, [userProfile]);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async (event) => {
    event.preventDefault();
    setEditing(false);
    try {
      const editedUserNameString = String(editedUserName);
      const response = await fetch('http://localhost:3001/api/v1/user/profile', {
        method: 'PUT',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userName: editedUserNameString,
        }),
      });
      if (response.ok) {
        const responseData = await response.json();
        dispatch(updateUserName(editedUserName));
        console.log('Le nom d/utilisateur a été mis à jour avec succès :', responseData);
      } else {
        console.error('Error :', response.statusText);
      }
    } catch (error) {
      console.error('Error : ', error);
    }
  };

  const handleCanceClick = () => {
    setEditedUserName(userProfile?.userName);
    setEditing(false);
  };

  const handleUserNameChange = (event) => {
    setEditedUserName(event.target.value);
  };

  return (
    <>
      {userProfile?.userName !== undefined && (
        <>
          {isEditing ? (
            <form onSubmit={handleSaveClick}>
              <h1>Edit User Info</h1>
              <div className="form">
                <div className="edit">
                  <label htmlFor="userName">User Name:</label>
                  <input type="text" id="userName" value={editedUserName} onChange={handleUserNameChange} autoComplete="userName" required />
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
                {`${userProfile.firstName} ${userProfile.lastName} !!`}
              </h1>
              <button className="edit-button" onClick={handleEditClick}>
                Edit Name
              </button>
            </>
          )}
        </>
      )}
    </>
  );
}
