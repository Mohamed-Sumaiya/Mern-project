import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import './PlaceForm.css'
import { Input } from '../../Shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../Shared/util/validators';
import  Button  from '../../Shared/components/FormElements/Button';
import { useForm } from '../../Shared/Hooks/form-hook';
import { useHttpClient } from '../../Shared/Hooks/http-hook';
import { AuthContext } from '../../Shared/context/authenticate-context';
import ErrorModal from '../../Shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../Shared/components/UIElements/LoadingSpinner';
import { ImageUpload } from '../../Shared/components/FormElements/ImageUpload';

const NewPlace = () => {
 const auth = useContext(AuthContext);
 const {sendRequest, error, clearError, isLoading}= useHttpClient();
 const [formState, inputHandler] = useForm( {
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
    address: {
      value: '',
      isValid: false
    },
    image: { // This state name/key has to match the id we set below so that the state is correctly defined.
      value: null,
      isValid: false
    }
  }, false)

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try{
      const formData = new FormData();
       formData.append('title', formState.inputs.title.value)
       formData.append('description', formState.inputs.description.value)
       formData.append('address', formState.inputs.address.value)
       // Don't need to send the creatorId in the req as we get it from the token in the back end for better security.
       formData.append('image', formState.inputs.image.value) // This has to be image because we will retrieve the image key later on the back end.
      await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/places',
         'POST',
         formData,
         {
           Authorization: 'Bearer ' + auth.token // This header (auth/token header) is now attached to this request.
           
         }
      )
      history.push('/'); // Here I want the user to go back after the navigation to the '/' route.(main page)
    } catch (error) {
     // Error handling is already being done using (inside) the custom http-hook.
     // Later we do want to redirect the user to a different place.
    }
    console.log(auth.token)
  };
  
  return (
  <>
    <ErrorModal error={error} onClear={clearError} />
    <form className="place-form" onSubmit={placeSubmitHandler}>
      {isLoading && <LoadingSpinner asOverlay />}
    <Input 
      id="title"
      type="text" 
      label="Title"
      element= "input"
      validators={[VALIDATOR_REQUIRE()]}
      errorText="Please enter a valid title."
      onInput={inputHandler}
    />
    <Input 
      id="description"
      element="textarea"
      label="Description"
      validators={[VALIDATOR_MINLENGTH(5)]}
      errorText="Please enter a valid description (at least 5 characters)."
      onInput={inputHandler}
    />
     <Input 
      id="address"
      element="input"
      label="Address"
      validators={[VALIDATOR_REQUIRE()]}
      errorText="Please enter a valid address."
      onInput={inputHandler}
    />
    <ImageUpload 
      id="image" 
      center 
      onInput={inputHandler} 
      errorText="Please provide an image" 
    />
    <Button type="submit" disabled={!formState.isValid}> ADD PLACE </Button>
  </form>
  </>
  )
};

export default NewPlace;