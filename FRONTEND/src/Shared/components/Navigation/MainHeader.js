import React from 'react';

import './MainHeader.css'

export const MainHeader = (props) => {

    return(
        <header className='main-header' >
          {props.children} {/*refers to stuff you pass betweeen your opening and cosing tags.*/}
        </header>
    )
}