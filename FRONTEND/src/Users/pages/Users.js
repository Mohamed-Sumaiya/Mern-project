import React, { useState, useEffect} from 'react';

import { UsersList } from '../components/UsersList';
import LoadingSpinner from '../../Shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../Shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../Shared/Hooks/http-hook';


export const Users = () => {
  const {sendRequest, isLoading, error, clearError} = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

 
  
  // Here we want to send a request whenever this page loads, so we will use the useEffect hook as this will prevent an infinite loop because useEffect hooks allows us to run certain code only when certain dependencies change then the code will re-run and not the whole time.
  // It will only run once as the dependency array is empty (It will retrieve the data once when this component renders).
  useEffect( () => { // DON'T turn the defualt useEffect function into an async function. IT'S NOT GOOD CODE. // Rather create another function inside the default one that is an async and wait function.
  
    const fetchUsers = async () => {
    try{
    const data =   await sendRequest(
       process.env.REACT_APP_BACKEND_URL + '/users',
        // Is a GET request by default.
       );
    
    setLoadedUsers(data.users);
    } catch (error) {
      // Error handling is already implemented by the custom hook.
    }
  }
  fetchUsers();
 }, [sendRequest]); // sendRequest is indeed now a dependency for this useEffect hook.
 
 console.log(process.env.REACT_APP_BACKEND_URL)
  return (
    <>
      <ErrorModal error={error} onClear={clearError}/>

      {isLoading && <div className="center">
        <LoadingSpinner />
        </div>
      }
      {!isLoading && loadedUsers && <UsersList items={loadedUsers}/>}
    </>
  )
}