import React, { useEffect, useState } from "react";
import fetch from "unfetch";
import goSearch from "./goSearch.jsx";
import {ContextStore} from "./ContextStore.jsx";
export default ({states}) => {
  const [API, setAPI] = useState([]);
  const [state, setState] = states;
  const {name,changeMenuOpen,setSelect} = React.useContext(ContextStore)
  function handleChange(e) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  function handlePress(e) {
    if (e.charCode == 13||e.keyCode == 13) { //Enter keycode
      e.preventDefault();
      goSearch(state,name,false,setSelect,changeMenuOpen);
    }
  }

  useEffect(() => {
    let isMounted = true;
    fetch("./api/ks.json")
      .then((x) => x.json())
      .then((data) => {
        isMounted && setAPI(data);
      })
      .catch((err) => {
        console.log("錯誤2:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="menu-ks">
      <div>
        <input
          name="ks"
          type="text"
          value={state.ks}
          placeholder="請輸入關鍵字"
          onKeyPress={(e) => handlePress(e)}
          onChange={(e) => handleChange(e)}
        />
        <a
          className="icon-search"
          onClick={() =>
            goSearch(state, name, false, setSelect, changeMenuOpen)
          }
        ></a>
      </div>
      <p className="ks-title">
        人氣推薦工作
      </p>
      {API.map((link, index) => {
        return (
          <a className="menuks-commend" key={index} href="/">
            {link}
          </a>
        );
      })}
    </div>
  );
};
