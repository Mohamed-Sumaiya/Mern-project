import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(); // Will be used to check if there is an error.
   
    const activeHttpRequests = useRef([]); // This reference will not be re-initialised  after this function runs.

    // To avoid an infinite loop with a request I will use the useCallback hook so that this function never gets recreated when the component that uses it rerenders.
    const sendRequest = useCallback( async (
        url,
        method = 'GET', 
        body = null, 
        headers = {} ) => { // Method, body and headers have default argument values. 
     setIsLoading(true);
     const httpAbortCtrl = new AbortController();
     activeHttpRequests.current.push(httpAbortCtrl); // This is just managing the state behind the scenes and not displaying it on the UI.
        try{
        const response = await fetch(url, {
            method: method, // method, <= shorthand.
            body: body,
            headers: headers,
            signal: httpAbortCtrl.signal
          });
    
          const data = await response.json(); // Returns a promise.
        
          // Remove the controller that was used  in the current request.
          activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl); // With this we will not have any old request controller, which we would try to use to cancel our request which is not on its way anymore.

          if (!response.ok) { // This(ok) is a property that exists on the response object and it will be true if we have a 200'ish response code. // If we have a 400'ish or 500'ish code then it will be false (falsey). 
            throw new Error(data.message); // If this executes then  only the catch code will be executed.
          }
          

          setIsLoading(false);
          return data; // Return the data so that the component that uses this hook can use it(the data).
     } catch (error) {
       if(!httpAbortCtrl.signal.aborted){
        setError(error.message);
        setIsLoading(false);
        throw error // So that the component that uses this hook has a chance of knowing that something went wrong.
 
     }
    }
     
    }, []); // Because the dependency array is empty, this function will only be saved in memory(memoized) once and never again.
    
    const clearError = () => {
      setError(null);
    };

    useEffect(() => {
        // When you return a function inside the default function then the returned function is executed as a cleanup function before the next time use effect runs again.
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []); // This will basically clean up the code so that we don't continue with a request that is on it's way out if we switch away from the component that triggered the request to a new one(defferent one).

    // return the below so that you can use it again elsewhere.
    return { isLoading, error, sendRequest, clearError };
};