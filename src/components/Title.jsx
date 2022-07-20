import React,{useState} from 'react';
const TradeSearch  = React.lazy(() => import('./TradeSearch.jsx'));
export default ({name,API,inputClick,state}) => {
    const arr = { c0: "工作地點", d0: "職務類別",t0:"產業類別",m0:"科系類別",nt:"排除產業",};
    return (
      <>
        {arr[name]}
        {showSearch?<TradeSearch API={API} inputClick={inputClick} state={state} setShowSearch={setShowSearch}/> :""}
      </>
    );

};


