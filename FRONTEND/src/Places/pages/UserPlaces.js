import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom';

import { PlaceList } from '../components/PlaceList';
import { useHttpClient } from '../../Shared/Hooks/http-hook';
import ErrorModal from '../../Shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../Shared/components/UIElements/LoadingSpinner';


const UserPlaces = () => {
    const [loadedUserPlaces, setLoadedUserPlaces] = useState();

    const { isLoading,error, clearError, sendRequest} = useHttpClient();
    
    const userId = useParams().userId; {/* Gives us access to the user id that's inside the url. */}
    let data;
   
    useEffect( () => {
      const fetchUserPlaces = async () => {
        try{
          data = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
             // It's already a GET request by defualt.
          )
          setLoadedUserPlaces(data.places);
        } catch (error) {
         //console.log(error)
        }
      }
      fetchUserPlaces();
    }, [sendRequest, userId]); // Basically just add what you use inside the useEffect that will change.

    const placeDeletedHandler = (deletedPlaceId) => {
      setLoadedUserPlaces( prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId));
    };

    //const loadedPlaces = DUMMY_PLACES?.filter( (places) => places.creator === userId)
    return (
        <> 

           <ErrorModal error={error} onClear={clearError} /> 
           {isLoading && <div className="center"> <LoadingSpinner /> </div>}
           {!isLoading && loadedUserPlaces && <PlaceList items={loadedUserPlaces} onDeletePlace={placeDeletedHandler}/>}
        </>
    )
}

export default UserPlaces;