import React,{useEffect,useLayoutEffect} from "react";
import {ContextStore} from "./ContextStore.jsx";
import SwiperCore, { Scrollbar,Navigation ,Mousewheel} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import getDirection from './getDirection.jsx';

  //name: 選單種類如c0,mainName: 大類資訊
export default ({ mainName ,datas, onliClick,stateNum}) => {
  SwiperCore.use([ Scrollbar,Navigation,Mousewheel]);

  const {name} = React.useContext(ContextStore);
  const c0_arr = [];
  const pushOversea = (data) => {
    c0_arr.push(data);
  };

   //第一列的scrollbar 更新
   useEffect(() => {
    const mySwiper=  document.querySelector('#cat-menu_lev1 .swiper-container').swiper;
    mySwiper.update();
    mySwiper.scrollbar.updateSize()

  }, [mainName]);

  useLayoutEffect(()=>{
    const changeSwiperDirect = () => {
      document.querySelector('#cat-menu_lev1 .swiper-container').swiper.changeDirection(getDirection());
    }
    window.addEventListener("resize",changeSwiperDirect)
   return( ()=> window.removeEventListener("resize",changeSwiperDirect))
  },[])

  
  const list = datas.map((data) => {
      const isOversea= name === "c0" && data.no > 10000 ;
      if(isOversea) pushOversea(data);
      let chkNum = ~~(data.no/10000);  
      let hasInclude = chkNum>1&&stateNum.find(v=> v.startsWith(chkNum));
    return (    
        !isOversea &&(
          <SwiperSlide key={data.no}>
          <li
            onClick={() => onliClick(data.n, data.no)}
            className={mainName == data.no ? "bdl" : ""}
          >
            <span className={"cat_lit" + (hasInclude?" font-blue":"")} > {data.des.replace(/／|╱/g, "/")}</span>
            <span className="icon-chevron-right"></span>
          </li>
          </SwiperSlide>        
        )
  
    );
  });
  return (   
    <Swiper
    slidesPerView={'auto'}
    mousewheel={{ forceToAxis: true}}
    direction={getDirection()}
    freeMode= {true}
    navigation={ {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }}
    scrollbar={ {el: '.swiper-scrollbar', draggable: true,hide:false }}
  >  
      {list}
      {name=="c0"&&<SwiperSlide ><li
        onClick={() => onliClick(c0_arr, 6)}
        className={mainName == 6 ? "bdl" : ""}
      >
        <span className="cat_lit"> 海外地區</span>
       
        <span className="icon-chevron-right"></span>
      </li></SwiperSlide>}
     
      <div className="swiper-scrollbar"></div>
      <span
        className="swiper-button-prev icon-angle-left"

      ></span>
      <span
        className="swiper-button-next icon-angle-right"
        
      ></span>
    </Swiper> 
  );
};


