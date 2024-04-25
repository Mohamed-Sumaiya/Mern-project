import React from 'react';
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group';

import './Modal.css';
import Backdrop from '../../components/UIElements/Backdrop'

const ModalOverlay = (props) => {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form onSubmit={props.onSubmit ? props.onSubmit : (event) => event.preventDefault()}>
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  return createPortal(content, document.getElementById('modal-hook'))
};

{/* <ModalOverlay {...props} /> Forwards all the props we get from modal into modal overlay. */}

export const Modal = (props) => {
  return <React.Fragment> 
     {props.show && <Backdrop onClick={props.onCancel} /> }
     <CSSTransition in={props.show} timeout={200} classNames="modal" mountOnEnter unmountOnExit>
       <ModalOverlay {...props} /> 
     </CSSTransition>
  </React.Fragment>
};

