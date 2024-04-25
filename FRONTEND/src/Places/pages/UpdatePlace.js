import React, {useEffect, useState, useContext} from 'react';
import { useParams, useHistory } from 'react-router-dom/cjs/react-router-dom';

import './PlaceForm.css';
import { Input } from '../../Shared/components/FormElements/Input';
import Button from '../../Shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../Shared/util/validators';
import { useForm } from '../../Shared/Hooks/form-hook';
import Card from '../../Shared/components/UIElements/Card';
import { useHttpClient } from '../../Shared/Hooks/http-hook';
import LoadingSpinner from '../../Shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../Shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../Shared/context/authenticate-context';


// Users will only be able to update the title and description of the place.
const UpdatePlace = () => {
   const auth = useContext(AuthContext); // Use the useContext hook by pointing at the context function you created.
   const  {sendRequest, error, clearError, isLoading} = useHttpClient();
   const history = useHistory(); // This will gie us a history object that will allow us to easily navigate around the front-end.
   const [loadedPlace, setLoadedPlace] = useState();
   const  placeId = useParams().placeId; // Accessing the ":placeId" param in the route(URL) that leads to this component.
   
  
   const [formState, inputHandler, setFormData] = useForm(
    {
     title: {
        value: '',
        isValid: false
     },
     description: {
        value: '',
        isValid: false
     }
   }, 
    false
   );

   //const identifiedPlace = DUMMY_PLACES.find( (place) => place.id === placeId);

   useEffect( () => {
     const fetchPlace = async () => {
       try{
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}` // Inject the place Id.
        );
        setLoadedPlace(data.place);
       // console.log(data.place)
        setFormData(
        {
          title: {
             value: formState.inputs.title.value,
             isValid: true
          },
          description: {
             value: formState.inputs.description.value,
             isValid: true
          }
        }, true);
       } catch (error) {
         console.log(error);
       }
     };
     fetchPlace();
   }
  , [sendRequest, placeId, setFormData]);

   /*useEffect(() => {

    if (identifiedPlace){
      setFormData({
        title: {
           value: identifiedPlace.title,
           isValid: true
        },
        description: {
           value: identifiedPlace.description,
           isValid: true
        }
      }, true);
    }

    setIsLoading(false);
   }, [setFormData, identifiedPlace])
  */
   const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
     try{
       await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }),
        {
          'Content-Type': 'application/json', // For the backend to parse the incoming data correctly.
           Authorization: 'Bearer '+ auth.token        
        }
      )
      history.push('/' + auth.creatorId + '/places'); // Navigate to the .
     } catch (error) {
       // Don't have to throw the error because the http-hook handles it but added console.log because lint was throwing an error.
       console.log(error);
     }
   };
   
    // Have to check isLoading early as if it's check later then the "could not find place" dialog will briefly appear.
    if(isLoading){ //Alternative way of displaying the loading state. 
      return (
          <div className="center">
             <LoadingSpinner />
          </div>
       )
   }
  

   // If a place(s) is not found then this will be displayed.
   if(!loadedPlace && !error){
     return (
     <div className="center">
        <Card>
          <h2> Could not find place! </h2>
        </Card>
     </div>
     )
   }
   
   
 // If a place(s) is found then this will be displayed.
 return (
   <>
     <ErrorModal error={error} onClear={clearError}/>
     { !isLoading && loadedPlace &&  
      <form className="place-form" onSubmit={placeUpdateSubmitHandler}> 
      {/* Initially this form is valid.*/}
       <Input 
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={loadedPlace.title}
        initialValid={true}
       />
       <Input 
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min. 5 characters)."
        onInput={inputHandler}
        initialValue={loadedPlace.description}
        initialValid={true}
       />
       <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
       </Button>
      </form>}
   </>
 );
};

export default UpdatePlace;