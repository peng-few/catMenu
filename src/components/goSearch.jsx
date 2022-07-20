
export function getUrl(val,name){
  return val.length > 0 ? `&${name}=${val}`:"" 
}

export default (state,name) => {
  window.location = "search.php?page=1&"+name+"="+state[name]+"&"+name+"Cht="+state[name+"Cht"];
}