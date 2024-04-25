import { useCallback, useReducer } from "react";

 const formReducer = (state, action) => {
    switch (action.type) {
      case 'INPUT_CHANGE': {
        let formIsValid = true;
        for( const inputId in state.inputs){
          if(!state.inputs[inputId]){
            continue; //This tells javascript to not complete the rest of the for loop, but to go to the next iteration.
          }
          if(inputId === action.inputId){
            formIsValid = formIsValid && action.isValid;
          } else {
            formIsValid = formIsValid && state.inputs[inputId].isValid;
          }

        }
        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputId] : { value: action.value, isValid: action.isValid}
          },
          isValid: formIsValid
        }; // return new state object. We update the input state and the overall validity state.
      }
      case 'SET_DATA': {
        return {
            inputs: action.inputs,
            isValid: action.formIsValid
        }
      }
      default:
        return state;
    }
  }
  

export const useForm = (initialInputs, initialFormValidity) => {
    const [formState, dispatch] =  useReducer(formReducer, { // Below is the initial state that is updated inside the reducer function.
        inputs: initialInputs,
        isValid: initialFormValidity
      });

      const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
         type: 'INPUT_CHANGE',
         value: value,
         isValid: isValid,
         inputId: id
        })
     }, []); // You can ommit dispatch as a dependency because react ensures that dispacth from useReducer never changes.
     
    // This function will update the state stored for the value and validity(when new values are entered in the form).
    // Using the useCallback hook so that the function is stored by React and not re-rendered unnecessarily.
    const setFormData = useCallback((inputData, formValidity) => {
      dispatch({
        type: 'SET_DATA',
        inputs: inputData,
        formIsValid: formValidity
      })
    }, []);

    
     return [formState, inputHandler, setFormData];
};