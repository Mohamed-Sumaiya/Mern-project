import React from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom';

import Avatar from '../../Shared/components/UIElements/Avatar'
import Card from '../../Shared/components/UIElements/Card'
import "./UserItem.css"

export const UserItem = (props) => {
  
  
    return (
    <li className='user-item'>
        <Card className='user-item__content'>
         <Link to={`/${props.id}/places`}>
            <div className='user-item__image'>
               <Avatar 
                 image={`${process.env.REACT_APP_ASSET_BACKEND_URL}/${props.image}`}
                 alt={props.name}
               />
            </div>
            <div className='user-item__info'>
               <h2>{props.name}</h2>
               <h3>{props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}</h3>
            </div>
          </Link>
        </Card>
    </li>
  )
}