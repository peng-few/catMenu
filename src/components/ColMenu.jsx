import React, { useEffect, useState } from "react";
import fetch from "unfetch";
import goSearch  from './goSearch.jsx';
import Title  from './Title.jsx';
import SwiperCore, { Scrollbar,Navigation ,Mousewheel} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import {ContextStore} from "./ContextStore.jsx";
import Col1 from './Col1.jsx'
import Col2 from './Col2.jsx'
import ResultAmount from './ResultAmount.jsx'
import Col3,{Inputs} from './Col3.jsx'
import getDirection from './getDirection.jsx';

SwiperCore.use([ Scrollbar,Navigation,Mousewheel]);
//param: api要的參數,states: 已選的選項
export default ({states, param ,isNav}) => {
  //name: 選項參數ex:c0,changeMenuOpen:選單開關,setSelect: 匯出已選選項
  const {name,changeMenuOpen,excludeParam} = React.useContext(ContextStore)
  const [API, setAPI] = useState([]); //選單API
  const [state, setState] = states; //有選的選項
  const [catMenu, setCatMenu] = useState([]); //中類選項
  const [input, setInput] = useState([]); //小類選項
  const [mainName, setmainName] = useState(); //大類資訊
  const [divName, setDivName] = useState([]); //已選擇的中類資訊: [名稱,遍號]
  const [isloading, setLoading] = useState(true); //loding中ㄇ


  function cleanAll(){
    return setState({...state,[name]:[],[name+"Cht"]:[]})
  }

  useEffect(()=>{
    const mySwiper=  document.querySelector('#cat-menu_lev3 .swiper-container').swiper;
      mySwiper.update();
      mySwiper.scrollbar.updateSize()
    
  },[input])

  //第二欄更換時第三欄也要換
  useEffect(() => {
    if (catMenu[0] && catMenu[0].n) {
      setInput(catMenu[0].n);
      setDivName([catMenu[0].des, catMenu[0].no]);
    }
  }, [catMenu]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch(
      `api/catSearch?${param}&re=${excludeParam}`,
    )
      .then((x) => x.text())
      .then((y) => {
        return JSON.parse(y.slice(1, -1)).n;
      })
      .then((data) => {
        if (isMounted) {
          setAPI(data);
          setCatMenu(data[0].n);
          setLoading(false);
          setmainName(data[0].no);
        }
      })
      .catch((err) => {
        console.log("錯誤:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [param, name]);
  

  //小類點擊
  function inputClick(title,name, e) {
    const value = e.target.value; //編號
    const city = e.target.name;
    const newTitle = title === "全選" ? city : name === "c0" ? city + title : title; //Cht名稱

    setState(prevState =>{
      let newC0 = [...prevState[name]];
      let newCht = [...prevState[name + "Cht"]];
      const idx = prevState[name].findIndex((v) => v === value); //<0:新增選取, >=0: 取消選取
      if (idx < 0) {
        const regex = /(00+)$/; //是否為全選
        if (regex.test(value)) {
          let left_arr = []; //cht全選後有剩下的名稱
          newC0 = prevState[name].filter((v, i) => {
            const isFilter = v.startsWith(value.split(regex)[0]); //全選濾掉單一的
            !isFilter && left_arr.push(newCht[i]);
            return !isFilter;
          });
          newCht = left_arr;
        }
        newC0.push(value);
        newCht.push(newTitle);
      } else {
        newC0.splice(idx, 1);
        newCht.splice(idx, 1);
      }     
      return { ...prevState, [name]: newC0, [name+"Cht"]:newCht }
    })
  }

  //大類點擊
  const onliClick = (data, no) => {
    setCatMenu(data);
    setmainName(no);
  }

  //中類點擊
  const li2Click = (data) =>{
    setDivName([data.des, data.no]); //加縣市名
    setInput(data.n);
  }

  return (
    <>
      {isloading ? (
        <div className="cat_load">
          <div className="load-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="91.241"
              height="91.275"
              viewBox="0 0 91.241 91.275"
            >
              <g
                id="Group_12249"
                data-name="Group 12249"
                transform="translate(395.423 -674.313) rotate(83)"
              >
                <path
                  id="Subtraction_1"
                  data-name="Subtraction 1"
                  d="M40.673,81.9a40.763,40.763,0,0,1-22.9-6.994A41.068,41.068,0,0,1,2.939,56.892,40.632,40.632,0,0,1,0,45.769H13.8A27.3,27.3,0,1,0,40.673,13.651V0a40.76,40.76,0,0,1,22.9,6.994A41.07,41.07,0,0,1,78.406,25.011a40.9,40.9,0,0,1-3.776,38.837A41.07,41.07,0,0,1,56.613,78.685,40.7,40.7,0,0,1,40.673,81.9Z"
                  transform="translate(631.279 394)"
                  fill="#e0e4eb"
                />
                <path
                  id="Intersection_2"
                  data-name="Intersection 2"
                  d="M.279,45.769A41.541,41.541,0,0,1,0,40.952a40.76,40.76,0,0,1,6.994-22.9A41.07,41.07,0,0,1,25.011,3.218,40.7,40.7,0,0,1,40.952,0V13.651A27.315,27.315,0,0,0,14.076,45.769Z"
                  transform="translate(631 394)"
                  fill="#e4e9f1"
                  opacity="0.45"
                />
              </g>
            </svg>
          </div>
        </div>
      ) : (
        ""
      )}

      <p className="catmenu_title">
        <span
          className={
            name == "c0"
              ? "icon-map-marker-alt-solid icon font-red"
              : "icon-briefcase icon font-green"
          }
        ></span>
        <Title name={name} API={API} inputClick={inputClick} state={state}/>
      </p>
      <div className="row">
      <div id="cat-menu_lev1" style={{ borderBottom: "1px solid #DDDDDD" }}>
      { !isloading ?<Col1 stateNum={state[name]} mainName={mainName} onliClick={onliClick} datas={API}/>:""}
      </div>

    
      <div id="cat-menu_lev2" style={{ borderBottom: "1px solid #DDDDDD" }}>
         <Col2 li2Click={li2Click} catMenu={catMenu} current={divName[1]} stateNum={state[name]}/>
      </div>

      <ul
        id="cat-menu_lev3"
        className={`col ${state[name].includes(divName[1]) ? "nclick" : ""}`}>
         <Swiper
            // spaceBetween={0}
            slidesPerView={'auto'}
            mousewheel={true}
            direction={"vertical"}
            freeMode= {true}
            shortSwipes={false}
            scrollbar={ {el: '.swiper-scrollbar', draggable: true ,hide:false }}
          >
          <SwiperSlide>
            <ul className="row gutters">
              {input.length > 0 ? <Inputs title={divName[0]} data={{ no: divName[1], des: "全選" }} inputClick={inputClick} state={state}/> : ""}
              <div style={{ flex: " 0 0 67%" }}></div>
              <Col3 catCity={divName[0]} datas={input} inputClick={inputClick} state={state}/>
            </ul>
          </SwiperSlide>
          <div className="swiper-scrollbar"></div>
        </Swiper>
      </ul>   
    </div>
    <div className="cat-search">
        {getDirection()=="vertical"&&<ResultAmount state={state} isNav={isNav}/>}
        <button type="button" id="cat-submit" onClick={() => goSearch(state,name,isNav,changeMenuOpen)}>
          {isNav ? '搜尋' : '選取'}
        </button>
        <button type="button" id="cat-delete" className={state[name].length==0?"font-gray":""} onClick={() => cleanAll()}>
          全部清除
        </button> 
    </div>
    </>
  );
}
