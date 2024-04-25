import React from 'react';

import { UserItem } from './UserItem';
import Card from '../../Shared/components/UIElements/Card'
import "./UsersList.css"

export const UsersList = (props) => {
  // If no user(s) are found then this will be displayed.
  if (props.items.length === 0){
    return(
       <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
       </div>
    )
  }
  
  // If user(s) are found then this will be displayed.
  return (
    <ul className='users-list'>
    {props.items.map( (user) => (
       <UserItem  
       key={user.id}  
       id={user.id}  
       image={user.image} 
       name={user.name} 
       placeCount={user.places.length} // Places will now be an array.
       />
    ))}
  </ul>
  )
};