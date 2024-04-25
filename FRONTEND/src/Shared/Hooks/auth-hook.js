import { useState, useCallback, useEffect } from 'react';

// It's outside of our app because it's just some behind the scenes data I need to manage and not data which should re-render, its just a general variable.
let logOutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(); // Token will act as the new isLogedIn state.
    const [tokenExpiration, setTokenExpiration] = useState();
    const [ creatorId, setCreatorId] = useState(null);
  
    
    // We are using useCallback here because we will pass this function(s) to child component and dont want the child component to re-render unnessecerily because of this function(s) so we store it in memory and will only re-render/trigger a re-render when the dependency changes.
    // In this case it will be stored in memory once and never again , it will not re-render because it doesnt use a variable , state, function, hook ,etc thats value will change, thus the dependency array is empty.
    const logIn = useCallback((cid, token, expirationDate) => { //cid = creator id.
     setToken(token);
     setCreatorId(cid);
     // This will generate a new date object thats based on a current date plus an hour
     const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // getTime() will return the number of milliseconds that have passed since the beginning of time(1970). // Calculation for an hour.
     setTokenExpiration(tokenExpirationDate);
     localStorage.setItem('userData', JSON.stringify({ creatorId: cid, token: token, expiration: tokenExpirationDate.toISOString() })); // A way of storing an object into localStorage.  // the ISO string method ensures that no data gets lost when this date is stringified
    }, []);
  
    const logOut = useCallback(() => {
      setToken(null);
      setCreatorId(null);
      setTokenExpiration(null); // Have to do this otherwise we still have our old expiration date managed, which will lead to an immediate logOut. 
      localStorage.removeItem('userData'); // Completely remove the user token, they will get a new one when they log in again or sign up .
     }, []);
  
  
     // This useEffact is used to automatically log The user in when the browser reloads so that the user can stay logged in if their token did not expire.
     useEffect(() => {
      // Ceck localStorage for a token.
      // This function will only run once, when the component mounts.
      const storedData = JSON.parse(localStorage.getItem('userData')); // Extract date(time) from the localStorage.
      if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) { // This will take this stored ISO string and convert it into a date object. // If the expiration Date is greater than the cureent date then it means the expiration date is still in the future and the token is still valid.
       // Now that we know there is userData and mainly a token is not expired yet we can automatically log the user in again.
       logIn(storedData.creatorId, storedData.token, new Date(storedData.expiration)); // Forward the extracted expiration date.
      } else {
        return;
      }
  
      // Because this will take time to complete you can add an additional state to keep track of wether the token is there or not and if not you can display a splash screen, but in this case the app loads so fast so we don't really need to implement that.
     }, [logIn]); // This useEffect will still only run once because logIn is defined with the useCallback hook.
   
  
     // This useEffect is used to log the user out automatically when the token expires, if there is no token then it will just clearTimeout();
     useEffect(() => {
       if (token && tokenExpiration) {
        // Here we need to calculate the remaining time we have until the token expires.
        const remainingTime =  tokenExpiration.getTime() - new Date().getTime() ; // new Date() will return the current date as an object and getTime() returns how long it has been from 1970(javascript time). // We will get the time(answer in milliseconds.)
        logOutTimer = setTimeout(logOut, remainingTime); // second argument takes a time(number). // setTimout expects time in milliseconds. // Returns the time we have left in milliseconds. 
       } else {
        // Clear timeout.
        clearTimeout(logOutTimer); // Will remove the setTimout if token is null (if the user manually logs out).
       }
     }, [token, logOut, tokenExpiration]);// When the token changes then we want to work with our timer. // Thanks to the useCallback hook  logOut will not be re-created and an infinite loop will be avoided.
  
    return { logIn, logOut, token, tokenExpiration, creatorId };
};
