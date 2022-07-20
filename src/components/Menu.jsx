import React, { useEffect, useState ,useContext,Suspense} from 'react';
import {ContextStore} from "./ContextStore.jsx";
const ColMenu = React.lazy(() => import('./ColMenu.jsx'));
const KsMenu  = React.lazy(() => import('./KsMenu.jsx'));
const sel = (name) =>{
  let new_sel = {};
  const getVal= (id) =>{ return document.getElementById(id)&&document.getElementById(id).value?document.getElementById(id).value.split(","):[];}
  new_sel[name]= getVal(name);
  if(name!=="ks"){
    new_sel[name+"Cht"]= new_sel[name].length>0?getVal(name+"Cht"):[];
    if(new_sel[name+"Cht"].length<=0) new_sel[name]=[];
  } 
  return new_sel
}

export default ({
  param,//選單API的參數
  isNav, //是否是導覽列的單一搜尋
}) => {
  const {name,changeMenuOpen} = useContext(ContextStore)
  let old_sel = isNav?{[name]: [],[name+"Cht"]: []} : sel(name); //deep copy ，不然第二層array一樣傳址
  const [state, setState] = useState(old_sel); //暫存的已選區

  //跳出視窗時頁面不可滑動
  useEffect(()=>{
    document.querySelector("body").style.overflow= "hidden";
    document.querySelector("html").style.overflow= "hidden";
    return(()=>{
      document.querySelector("body").style.overflow= "";
      document.querySelector("html").style.overflow= "";
    })
  },[])

  return (
    <>
      <div className="blue-backdrop"></div>
      <div id="cat-menu" className={name=="ks"?"kscat-menu":""}>
        {param.length <= 0 ? (
            <Suspense fallback={<div className="cat_load"></div>}>
              <KsMenu states={[state, setState]}/>
            </Suspense>    
        ) : (
          <Suspense fallback={<div className="cat_load"></div>}>
            <ColMenu  states={[state, setState]} param={param} isNav={isNav}/>
          </Suspense>        
        )}
     
       <button type="button" id="cat-close" onClick={() => changeMenuOpen(false)}>×</button>
      </div>
      <link rel="stylesheet" href="public/css/menu.css?v=20201207" />
    </>
  );
}



