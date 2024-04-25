import React, {useRef, useState, useEffect} from 'react';

import './ImageUpload.css';
import Button from './Button';

// The idea here is to utilise the input element(file input) without seeing it.
export const ImageUpload = (props) => {
   const filePickerRef = useRef();
   const [file, setFile] = useState();
   const [previewUrl, setPreviewUrl] = useState();
   const [isValid, setIsValid] = useState(false);
   
   useEffect(() => {
    // Whenever we pick a new file, we will run this logic.
    // In this function I want to generate a preview.
    if (!file){
        return;
    }
    const fileReader = new FileReader(); // This helps use read files
    fileReader.readAsDataURL(file); // This does not give us a promise back.
    fileReader.onload = () => { // This anonymous function will be executed whenever the file reader loads a new file or is done parsing a file.
      setPreviewUrl(fileReader.result);
    }; 
   }, [file])

   // The goal here is to generate something that helps us preview the file (the file at the bottom) and also forward the file to the surrounding component where we use the image upload component in.
   const pickedHandler = (event) => { // There is a files property on the events target that holds the file the user selected.
    let pickedFile;
    let fileIsValid = isValid; // This will be equal to the current state of isValid as the state might not be updated by the time we pass it to the props.onInput function. // This will ensure that we pass the updated state value.
    if(event.target.files && event.target.files.length === 1){
        pickedFile = event.target.files[0]; // The first and only file.
        setFile(pickedFile);
        setIsValid(true);
        fileIsValid = true;
     } else {
      // If we don't have a file then we will set isValid to false (if nothing is detected when this function is called).
      setIsValid(false);
      fileIsValid = false;
     }
    props.onInput(props.id, pickedFile, fileIsValid);
   };

   const pickImageHandler = () => {
    filePickerRef.current.click(); // This method exists on this DOM node and it will open that file picker.
   };

  return(
    <div className="form-control">
      {/*Below is how you set inlne styles in react. With display set to none the input is still part of the DOM but it's not visible.*/}
      {/* pickedHandler Function will run when a user picks a file.*/ }
      <input 
        id={props.id} 
        ref={filePickerRef}
        type="file" 
        style={{display: 'none'}} 
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler} 
      />  
      <div className= {`image-upload ${props.center && 'center'}`} >
        <div className="image-upload__preview">
           { previewUrl && <img src={previewUrl} alt="Preview" />}
           { !previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button> {/*Set it to type button so that it actually acts as a button and submits the file, even though the file upload is not in a form.*/}
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};