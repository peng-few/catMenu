export default  () => {
  var direction = window.innerWidth <= 700 ? 'horizontal' : 'vertical';
  return direction;
}