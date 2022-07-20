import React from 'react';

const Inputs = React.memo(({name,data,title,setState,state}) => {
  function inputClick(name,title, e) {
    const value = e.target.value; //編號
    const city = e.target.name;
    const newTitle =
      title === "全選" ? city : name === "c0" ? city + title : title; //Cht名稱
    // 1. 是要新增還是刪除
    // 2. 是新增的話，全選要要把子類別刪掉 (遞迴)
    // 3. 修改的都放到newXXX裡在回傳
    // 4. 如果有cht上述也要同步進行
    const change = () => {
      const hasCht = state[name + "Cht"] !== undefined;
      let newC0 = state[name];
      let newCht = state[name + "Cht"];
      const idx = state[name].findIndex((v) => v === value); // < 0:新增選取, >=0: 取消選取
      if (idx < 0) {
        const regex = /(00+)$/; //是否為全選
        if (regex.test(value)) {
          let left_arr = []; //cht全選後有剩下的名稱
          newC0 = state[name].filter((v, i) => {
            const isFilter = v.startsWith(value.split(regex)[0]);
            hasCht && !isFilter && left_arr.push(newCht[i]);
            return !isFilter;
          });
          newCht = left_arr;
        }
        newC0.push(value);
        hasCht && newCht.push(newTitle);
      } else {
        newC0.splice(idx, 1);
        hasCht && newCht.splice(idx, 1);
      }
      return hasCht
        ? { [name]: newC0, [name + "Cht"]: newCht }
        : { [name]: newC0 };
    }   
    setState({ ...state, ...change() });
  }
  return( 
  <li 
  className={state[name].includes(data.no) ? "canc" : ""}
  >
    <input
      type="checkbox"
      value={data.no}
      id={"sel_" + data.no}
      onChange={(e) => inputClick(name,data.des, e)}
      checked={state[name].includes(data.no)}
      name={title} //海外地區使用匯入參數title，其他中類用divName
    />
    <label
      htmlFor={"sel_" + data.no}
      className={data.des == "全選" ? "chs-all" : ""}
    >
      <span>{data.des.replace(/／/g, "/")}</span>
      <span className="icon-checkmark"></span>
    </label>
  </li>
)},areEqual
)

function areEqual(prevProps, nextProps) {
  return true;
  return prevProps.state[prevProps.name].includes(prevProps.data.no) == nextProps.state[prevProps.name].includes(prevProps.data.no)
}

export default React.memo(({name,data,divName,state,setState,catCity})=>{
//  console.log(state)
    return (
        <React.Fragment key={ data.no}>
          { data.n !== undefined &&  data.n.length > 0 ? (
            //海外地區小類
            <div
              className={
                state[name].includes( data.no) ? "nclick cat-sma" : "cat-sma"
              }
            >
              <Inputs name={name} data={ data} title= {divName} state={state} setState={setState}/>
              {
                   data.n.map(data=>{
                      return <Inputs key={data.no} data={data} title={catCity} />
                  })
              }
            </div>
          ) : (
            <Inputs name={name} data={ data} title= {catCity} state={state} setState={setState}/>
            // inputs(dataCallBack, catCity)
          )}
        </React.Fragment>
      );
}, areEqual)
