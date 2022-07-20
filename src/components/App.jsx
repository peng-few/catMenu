import React, { useState,useEffect } from 'react';
import  Menu  from './Menu.jsx';
import {ContextStore} from "./ContextStore.jsx";



function App() {
  //確認有選的選項
  const [menuCat, setMenucat] = useState({ cat: null, name: null,exclude: ''}); //cat=選單API的參數e:city。name=條件的參數ex: c0
  const [isMenuOpen, changeMenuOpen] = useState(false); //選單開關
  const [isNav, setIsNav] = useState(false); //是否為nav上的選單(單一選單搜尋)
  const [directSearch, setDirectSearch] = useState(false); //是否直接搜尋

  const openMenu = (cat, name, isDirectSearch,isNav,ex) => {
    setMenucat({ cat: cat, name: name,exclude: ex});
    setIsNav(isNav);
    setDirectSearch(isDirectSearch);
    changeMenuOpen(true);
  };

  return (
      <>
      {isMenuOpen ? (
        <ContextStore.Provider value={{
          name: menuCat.name,
          direct : directSearch,
          changeMenuOpen : changeMenuOpen,
          excludeParam : menuCat.exclude
        }}>
        <Menu
          param={menuCat.cat} 
          isNav={isNav}
        />
         </ContextStore.Provider>
      ) : (
        ''
      )}

      <br />
     
    </>
  );
}

export default App;
