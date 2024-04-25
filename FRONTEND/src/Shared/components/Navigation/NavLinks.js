import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom/cjs/react-router-dom';

import './NavLinks.css'
import { AuthContext } from '../../context/authenticate-context';
import Button from '../FormElements/Button';

export const NavLinks = () => {
  const auth = useContext(AuthContext); // Gets back an object.
  return <ul className="nav-links">
     <li>
        <NavLink to="/" exact> ALL USERS </NavLink>
     </li>
     {auth.isLoggedIn && (
      <li>
        <NavLink to={`${auth.creatorId}/places`}> MY PLACES </NavLink>
      </li> 
      )}
     {auth.isLoggedIn && (
      <li>
        <NavLink to="/places/new"> ADD PLACE </NavLink>
      </li>
      )}
     {!auth.isLoggedIn && (
      <li>
        <NavLink to="/auth"> AUTHENTICATE </NavLink>
      </li>
      )}
     {auth.isLoggedIn && (
      <li>
      <Button onClick={auth.logout}> LOGOUT </Button>
      </li>
     )}
  </ul>
}