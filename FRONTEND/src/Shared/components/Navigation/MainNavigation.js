import React, { useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom';

import './MainNavigation.css'
import { MainHeader } from './MainHeader';
import { NavLinks } from './NavLinks';
import { SideDrawer } from './SideDrawer';
import  Backdrop   from '../UIElements/Backdrop'

export const MainNavigation = () => {

  const [drawerIsOpen,setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
      setDrawerIsOpen(true);
  }

  const closeDrawerHandler = () => {
      setDrawerIsOpen(false);
  }

    return(
    <> {/*This does not render any html tag it just fulfills the javascript limitation. */} {/* Cannot assign any class to this tag */}
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
          <nav className="main-navigation__drawer-nav">
            <NavLinks />
          </nav>
      </SideDrawer>
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDrawerHandler}>
            <span/>
            <span/>
            <span/>
        </button>
        <h1 className="main-navigation__title"> <Link to='/'> Your Places </Link> </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
    )
}