import React, { useEffect, useState} from 'react';
import {ContextStore} from "./ContextStore.jsx";
import fetch from "unfetch";
let count= 0;


const SelectedItem = ({state,inputClick})=>{
  const {name} = React.useContext(ContextStore);
  return(
    <section class="search-tag">
      <p className="d-block d-md-none aware-d0">請搜尋你想要查詢的職務關鍵字</p>
      {state[name].length>0?<p className="st-p">已選取職務:</p>:""}
      <br/>
      {
        state[name].map((v,i)=>{
          let tdName =state[name+"Cht"][i];
          return (
            <label htmlFor={"sel"+v}  key={v} className="st-label">
            <input type="text" name={tdName} id={"sel"+v} value={v} onClick={(e)=>inputClick(tdName,name,e)} className="d-none"/>
            {state[name+"Cht"][i]}
            <span>✖</span>
          </label>
          )
        })
      }
    </section>
  )
}

export default ({API,inputClick,state,setShowSearch}) => {
    const [keyword, setKeyword] = useState(""); //輸入的關鍵字
    const [data,setData]= useState({}); //顯示結果
    const {name} = React.useContext(ContextStore)
    const [visible,setVisible] = useState(false);
    function handleChange(e) {
      setKeyword(e.target.value);
    }


    function handleSubmit(e) {
      let val= e.target.value;
      if(val!==keyword) setKeyword(val)
      setVisible(true);
    }

    //點選其他區域關掉
    const otherClick = event => {
      let main = document.getElementById("td-search");
      let $target = event.target; 
      if(main !== $target && !(main.contains($target))){  
        setVisible(false);
      }  
    }

    //按enter顯示
    const enterKeyPress = event => {
      let code = (event.keyCode ? event.keyCode : event.which);
      if (code == 13) { //Enter keycode
        setVisible(true);
        } 
      }

      //找到他的中文字
    function getCht(v){  
      function getIdx(data,start,end,divisor){        
          let mid= ~~((start+end)/2);
          if (data[mid].no ==v) return data[mid].des
          if (~~((data[mid].no)/divisor)!= ~~(v/divisor)){
            if (mid==start || mid==end) return false  
            if(data[mid].no>v) end =mid;
            else start =mid;    
            return getIdx(data,start,end,divisor) 
        }
        if((divisor/100)<1) return false;
        return getIdx( data[mid].n , 0 , data[mid].n.length ,divisor/100 )
      }
      return getIdx(API,0, API.length,10000);
    }
  

    //點其他地方關閉顯示
    useEffect(()=>{ 
        document.getElementById("root").addEventListener("click",otherClick)
      return(()=>
        document.getElementById("root").removeEventListener("click",otherClick)
      ) 
    },[])
    
    //點enter顯示框框
    useEffect(()=>{ 
       window.addEventListener("keypress",enterKeyPress)
      return(()=>
        window.removeEventListener("keypress",enterKeyPress)
      ) 
    },[])

    useEffect(() => { 
        let h = keyword.replace(/\s+/g, "");
        let isMounted = true;
        if( h.length >= 2){     
          let thisCount= ++count;
          fetch(
            `/api/tradeSearch&kw=${keyword}`)
            .then((x) => x.json())
            .then((data) => {
              if (isMounted&&thisCount==count) {
                  setData(data)  
                  setVisible(true);   
                  console.log(data)         
              }
            })
            .catch((err) => {
              console.log("錯誤:", err);
            });
      
        }else{
          setData({})  
          setVisible(false);
        }
        return () => {
          isMounted = false;
        };
      }, [keyword]);

    
      return (
          <div className="td-search" id="td-search">
            <div className="close-d0" onClick={()=> setShowSearch(false)} >
              <svg xmlns="http://www.w3.org/2000/svg" width="25.952" height="25.952" viewBox="0 0 25.952 25.952">
                <path id="chevron-circle-right-solid" d="M20.976,8A12.976,12.976,0,1,1,8,20.976,12.974,12.974,0,0,1,20.976,8Zm5.959,12.086L19.846,13a1.251,1.251,0,0,0-1.774,0l-.889.889a1.251,1.251,0,0,0,0,1.774L22.5,20.976l-5.316,5.316a1.251,1.251,0,0,0,0,1.774l.889.889a1.251,1.251,0,0,0,1.774,0l7.09-7.09A1.257,1.257,0,0,0,26.935,20.086Z" transform="translate(33.952 33.952) rotate(180)" fill="#0a65c2"/>
              </svg>
            </div>
            <input className="td-input" value={keyword} onFocus={(e)=> handleSubmit(e)} onChange={(e)=>handleChange(e)} type="text" id="d0Qry" name="d0Qry" placeholder="請輸入職務關鍵字後查詢"/>
            {!visible?<SelectedItem state={state} inputClick={inputClick}/> :
            <div className="td-result">
              {data.status==200?
              (
                <>
                  <p>共{data.sum}筆</p>
                  <ul className="td-ul">
                    {data.R.map((v)=>{
                      let tdName= getCht(v.no);
                      return(
                        <li key={v.no}>
                          <label htmlFor={"td"+v.no} className="td-title"> <input type="checkbox"  checked={state[name].includes(v.no)} onChange={(e) => inputClick(tdName,name,e)}  name="td-input" id={"td"+v.no} value={v.no}/>{tdName}<br/>
                          <p className="td-des">{unescape(v.det)}</p>
                          </label>                       
                        </li>
                      )
                    }
                    )}
                  </ul>
                </>
              ):
                keyword.length>1?<p>找不到相符的資料，請重新搜尋。</p> :<SelectedItem state={state} inputClick={inputClick}/>
            }
            </div>
            }
          </div>  
      )

}