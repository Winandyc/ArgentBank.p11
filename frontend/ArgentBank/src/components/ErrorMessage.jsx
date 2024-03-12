// Correspond au message d'erreur qui s'affiche lorsque ma route n'est pas reconnue (URL).

import React from 'react';
import { isRouteErrorResponse } from 'react-router-dom';

export default function ErrorMessage({ error }) {
  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <div>
          <h1>{error.status}</h1>
          <p>The request page does not exist</p>
        </div>
      </main>
    );
  }
}
