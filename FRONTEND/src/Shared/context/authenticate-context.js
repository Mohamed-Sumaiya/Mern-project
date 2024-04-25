import {createContext} from 'react';

export const AuthContext = createContext({  // Will be used to share data between components.
    token: null,
    creatorId: null,
    isLoggedIn: false, 
    login: () => {}, 
    logout: () => {} 
}); 