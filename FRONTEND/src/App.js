import React, { Suspense, lazy }  from 'react';
import { BrowserRouter,Route,Redirect, Switch } from 'react-router-dom/cjs/react-router-dom';

import { Users } from './Users/pages/Users';
import { MainNavigation } from './Shared/components/Navigation/MainNavigation';
import { AuthContext } from './Shared/context/authenticate-context';
import { useAuth } from './Shared/Hooks/auth-hook';
import LoadingSpinner from './Shared/components/UIElements/LoadingSpinner';


// Now this will not be imported immediately when App.js runs and also not in the bundle produced by our build tool. It's not included right from the start, but it will be loaded on demand once it is required. 
// Only have to do this in App.js.
const NewPlace = lazy(() => import('./Places/pages/NewPlace'));
const UserPlaces = lazy(() => import('./Places/pages/UserPlaces'));
const UpdatePlace = lazy(() => import('./Places/pages/UpdatePlace'));
const Authenticate = lazy(() => import('./Users/pages/Authenticate'));

const App = () => {
  const { logIn, logOut, token, creatorId } = useAuth();
   let routes;

   if(token){
     routes = (
      <Switch> 
       <Route path="/" exact>
        <Users />
       </Route>
       
       <Route path="/:userId/places" exact>
        <UserPlaces />
       </Route>
       
       <Route path="/places/new" exact>
        <NewPlace />
       </Route>
       
       <Route path="/places/:placeId">
        <UpdatePlace />
       </Route>
       
       <Redirect to="/" />
      </Switch>
     );
    } else {
     routes = (
     <Switch> 
       <Route path="/" exact>
        <Users />
       </Route>
       
       <Route path="/:userId/places" exact>
        <UserPlaces />
       </Route>
       
       <Route path="/auth">
        <Authenticate />
       </Route>
       
       <Redirect to="/auth" />
      </Switch>
     );
    }

return (
 <AuthContext.Provider value={{isLoggedIn: !!token, token: token, creatorId: creatorId, login: logIn, logout: logOut}}> {/* Every component inside this has access to the authContext. */} {/* Double bang operator will convert token to true if theres a value or to false if there isnt a value in it(if theres no token). */}
  <BrowserRouter>
  <MainNavigation/> {/*Render it above the switch code so that it's always visible.*/}
  <main>
   <Switch> {/* The order of the routes matter, React will check if the entered route matches the routes in this order.so we have to carefully place them in a way that no route get's skipped.*/}
     <Suspense fallback={ <div className="center"> <LoadingSpinner/> </div>}>
      {routes}
     </Suspense>
   </Switch>
  </main>
  </BrowserRouter>
 </AuthContext.Provider>
  )
}

export default App;
