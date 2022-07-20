import React from 'react';
import {ContextStore} from "./ContextStore.jsx";
  
export const Inputs =({data, title,inputClick,state}) =>{ 
    const {name} = React.useContext(ContextStore)
    return( 
    <li 
    className={(data.des == "全選" ? "flex-all" : "")+(state[name].includes(data.no) ? " canc" : "")}
    >
      <input
        type="checkbox"
        value={data.no}
        id={"sel_" + data.no}
        onChange={(e) => inputClick(data.des,name, e)}
        checked={state[name].includes(data.no)}
        name={title} //海外地區使用匯入參數title，其他中類用divName
      />
      <label
        htmlFor={"sel_" + data.no}
        className={data.des == "全選" ? "chs-all" : ""}
      >
        <span>{data.des.replace(/／|╱/g, "/")}</span>
        <span className="icon-checkmark"></span>
      </label>
    </li>
  )
}

const Col3 = ({ datas, catCity,inputClick,state }) => {
    const {name} = React.useContext(ContextStore)
    return datas.map((data) => {
      return (
        <React.Fragment key= {data.no}>
          {data.n !== undefined && data.n.length > 0 ? (
            //海外地區小類
            <div
              className={state[name].includes(data.no) ? "nclick cat-sma" : "cat-sma"}>
              <Inputs data={data} title= "" inputClick={inputClick} state={state}/>
              {<Col3 datas={data.n} catCity={data.des} inputClick={inputClick} state={state}/>}
            </div>
          ) : (
            <Inputs data={data} title= {catCity} inputClick={inputClick} state={state}/>
          )}
        </React.Fragment>
      );
    });
  };

  export default Col3;