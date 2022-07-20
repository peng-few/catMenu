import React,{useState,useContext,useEffect} from "react";
import { ContextStore } from "./ContextStore.jsx";
import {getUrl}  from './goSearch.jsx';
import fetch from "unfetch";

export default ({state,isNav}) => {
  const [jobAmount, setjobAmount] = useState(0); //儲存現在有選的選項
  const {name, direct} = useContext(ContextStore);
  useEffect(()=>{
    let exp = new RegExp(`&${name}Cht=[^&]*|&${name}=[^&]*`,'g')
    let search= '';  
    let elseName = name=="c0"?"d0":"c0";
    let item =document.getElementById(elseName);
    let otherVal = item&&item.value;
    if(!isNav&&otherVal && search.indexOf(elseName+"=") < 0) search = location.search.replace("?","&").replace(exp,'')+getUrl(otherVal,elseName);   
     fetch('api/empHandler.php?apFun=empSearch&size=1'+getUrl(state[name],name)+search)
       .then((x) => x.json())
       .then((data) => {
         setjobAmount(data[0]?data[0].total_rows:'0')
       })
       .catch((err) => {
         console.log('網頁忙碌中，請刷新頁面...',err);
       });   
},[state])

  return (
    <p style={{ lineHeight: "1.5" }}>
      搜尋結果共
      <span
        style={{ color: "#FD5858", fontSize: "2rem", margin: "0 8px" }}
        id="jobAmount"
      >{jobAmount}</span>筆
      <br />
      {!direct &&
        (name == "c0" ? (
          <span className="cat-kit">
            還可以用<span className="font-blue">職務搜尋</span>
            ，讓你找工作更精準唷！
          </span>
        ) : name == "d0" ? (
          <span className="cat-kit">
            利用<span className="font-blue">地區+職務</span>
            可以更迅速的找到你適合的工作唷！
          </span>
        ) : (
          ""
        ))}
    </p>
  );
};
