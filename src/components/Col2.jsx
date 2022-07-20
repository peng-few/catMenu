import React ,{ useLayoutEffect,useEffect} from 'react';
import SwiperCore, { Scrollbar,Navigation ,Mousewheel} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import getDirection from './getDirection.jsx';

export default ({catMenu,li2Click,current,stateNum}) => {
    SwiperCore.use([ Scrollbar,Navigation,Mousewheel]);
    useLayoutEffect(()=>{
      const changeSwiperDirect = () => {
        document.querySelector('#cat-menu_lev2 .swiper-container').swiper.changeDirection(getDirection());
      } 
      window.addEventListener("resize",changeSwiperDirect)
     return( ()=> window.removeEventListener("resize",changeSwiperDirect))
    },[])

      //第二欄更換時第三欄也要換
      useEffect(() => {
        const mySwiper=  document.querySelector('#cat-menu_lev2 .swiper-container').swiper;
        mySwiper.update();
        mySwiper.scrollbar.updateSize();      
      }, [catMenu]);

    const list =catMenu.map((data) => {
    let ttt = data.no.match(/(\d+?)(?:00){1,}$/)[1];
    
    let sel_num = stateNum.filter(num=>num.startsWith(ttt)).length;
    return( 
    <SwiperSlide key={data.no}>
      <li
        key={data.no}
        onClick={() => li2Click(data)}
        className={current == data.no ? "current" : ""}
      >
        <span className="cat_lit"> {data.des.replace(/／|╱/g, "/")}
        {sel_num>0?`\(${sel_num}\)`:''}
        </span>
        <span
          className= "icon-angle-right li-r"
        ></span>
      </li>
      </SwiperSlide>)
    });


    return(
    <Swiper
      // spaceBetween={0}
      slidesPerView={'auto'}
      mousewheel={true}
      direction={getDirection()}
      freeMode= {true}
      scrollbar={ {el: '.swiper-scrollbar',draggable: true ,hide:false}}
      navigation={ {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }}
    >
      <SwiperSlide> {list} </SwiperSlide>
      <div className="swiper-scrollbar"></div>
      <span
        className="swiper-button-prev icon-angle-left"></span>
      <span
        className="swiper-button-next icon-angle-right"></span>
    </Swiper>)
}
