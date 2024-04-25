import React from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.css'

export const SideDrawer = (props) => {
    return(
    <div>
      {/*semantically this will still look the same as how it would look if it was
       rendered as a normal component but it is semantically better and easy to read*/}
     {createPortal(  <CSSTransition in={props.show} timeout={200} classNames="slide-in-left" mountOnEnter unmountOnExit> 
     <aside onClick={props.onClick} className='side-drawer'> {props.children} </aside> 
     </CSSTransition>,
     document.getElementById('drawer-hook'))}
   </div>
)
}