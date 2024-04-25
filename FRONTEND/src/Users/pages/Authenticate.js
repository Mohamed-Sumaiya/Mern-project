import React, {useState, useContext } from 'react';

import './Authenticate.css';
import Card from '../../Shared/components/UIElements/Card';
import { Input } from '../../Shared/components/FormElements/Input';'../../Shared/components/FormElements/Input';
import Button from '../../Shared/components/FormElements/Button';
import {VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from '../../Shared/util/validators'
import { useForm } from '../../Shared/Hooks/form-hook';
import { AuthContext } from '../../Shared/context/authenticate-context';
import LoadingSpinner from '../../Shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../Shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../Shared/Hooks/http-hook';
import { ImageUpload } from '../../Shared/components/FormElements/ImageUpload';

const Authenticate = () => {
 const auth = useContext(AuthContext);
 const [isLogInMode, setIsLoginMode] = useState(true);
 const { isLoading, error, sendRequest, clearError } = useHttpClient();
 

 const [formState, inputHandler, setFormData] = useForm({
    email: {
        value: '',
        isValid: false
    },
    password: {
        value: '',
        isValid: false
    }
  } //This object is the state!
    ,false);

 const switchModeHandler = () => {
    if(!isLogInMode){
      setFormData(
      {  
        ...formState.inputs,
        name: undefined,
        image: undefined
      }, 
      formState.inputs.email.isValid && formState.inputs.password.isValid 
      );
    } else {
        setFormData({
            ...formState.inputs,
            name: {
                value : '',
                isValid: false
            },
            image: {
              value: null,
              isValid: false
            }
        }, false)
    }
    setIsLoginMode(prevMode => !prevMode) //From what it was before to it's opposite.
};

 const authSubmitHandler = async (event) => {
  event.preventDefault();
  
  //setIsLoading(true); // This will now be done inside the http-hook function.

  if (isLogInMode) {
    try {
     const data = await sendRequest( // Might be an error if it is undefined.
      process.env.REACT_APP_BACKEND_URL + '/users/login',
      'POST', 
      JSON.stringify({ // Stringify method takes regular javascript data like an array or like an object and converts it to  a Json string. // Always has to be in json format.
       // Here you will submit form data, we will send the three data below as that is what we are expecting in our backend when a user logs in.
       email: formState.inputs.email.value,
       password: formState.inputs.password.value
      }),
     {
      'Content-Type': 'application/json', // Without this, our backend will not know which kind of data it recieves and our body parsing data(function) will not kick in correctly because it does not know that it's getting json data.
     },
    );
    auth.login( data.userId, data.token); // This should only run if all our data has been fecthed (if all the above has completed).
   } catch (error) {
    /// Because our custom hook handles the error catching we will leave this open but you can alternativley use a then block if you want to ommit it(catch).
   }
    /* const data = await response.json(); // Returns a promise.
    
     if (!response.ok) { // This is a property that exists on the response object and it will be true if we have a 200'ish response code. // If we have a 400'ish or 500'ish code then it will be false. 
       throw new Error(data.message); // If this executes then the code below will be skipped and only the catch code will be executed.
     }
    */

     //setIsLoading(false); // Make sure you first clear your local state on this page before you trigger something that might change the component that's loaded. // Basically first update the state before moving to the next component so that you don't have to update date the state of a component while on a different component.
    
  } else {
   
    try{
       const formData = new FormData(); // This will be an object and is already automatically available so we don't need to import it.
        formData.append('name', formState.inputs.name.value) // first arg is an identifier and the second arg is the value for this identifier.
        formData.append('email', formState.inputs.email.value)
        formData.append('password', formState.inputs.password.value)
        formData.append('image', formState.inputs.image.value)  // Found the key for this in the backend.
       const data = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/users/signup',  // Returns a promise.
        'POST',
        // Instead of sending JSON data we will send Form Data.
        formData,
        // The fecth API which we use under the hood in send request automatically adds the right headers, so we don't have to add it manually for Form Data.

    );

    /* const data = await response.json(); // Returns a promise.
     if (!response.ok) { // This is a property that exists on the response object and it will be true if we have a 200'ish response code. // If we have a 400'ish or 500'ish code then it will be false. 
       throw new Error(data.message); // If this executes then the code below will be skipped and only the catch code will be executed.
     }
     console.log(data);
     setIsLoading(false); // Make sure you first clear your local state on this page before you trigger something that might change the component that's loaded. // Basically first update the state before moving to the next component so that you don't have to update date the state of a component while on a different component.
    */
     auth.login( data.userId, data.token ); // This should only run if all our data has been fecthed (if all the above has completed).
    } catch (err) {
    // Here we will do the same as above.
    //console.log(err);
    // setError(err.message || 'Something went wrong, please try again.'); // Provided a fallback message in case a message property does not exist.
    }
  }
 // setIsLoading(false);
};

 /* This function will be used to reset the error.
 const errorHandler = () => {
   clearError();
 };
*/

 return (
  <>
  <ErrorModal error={error} onClear={clearError}/>
  <Card className="authentication">
  {isLoading && <LoadingSpinner asOverlay/> }
  <h2> Log In Required </h2>
  <hr />
  <form onSubmit={authSubmitHandler}>
    {!isLogInMode && (
     <Input 
       element="input"
       id="name"
       type="text"
       label="Your Name"
       validators={[VALIDATOR_REQUIRE()]}
       errorText="Please enter your name."
       onInput={inputHandler}
     /> )}
     {!isLogInMode && <ImageUpload id="image" center  onInput={inputHandler} errorText="Please provide an image" />}
     <Input
       id="email"
       type="email"
       label="E-mail"
       element="input"
       validators={[VALIDATOR_EMAIL()]}
       errorText="Please enter a valid email address."
       onInput={inputHandler}
     />

     <Input
       id="password"
       type="password"
       label="Password"
       element="input"
       validators={[VALIDATOR_MINLENGTH(6)]}
       errorText="Please enter a valid password(at least 6 characters)."
       onInput={inputHandler}
     />
     <Button type="submit"disabled={!formState.isValid}> 
     {isLogInMode? 'LOGIN' : 'SIGNUP'}
     </Button>
 </form>
 <Button inverse onClick={switchModeHandler}> {isLogInMode? "SWITCH TO SIGNUP" : "SWITCH TO LOGIN"} </Button>
</Card>
  </>
 )
};

export default Authenticate;