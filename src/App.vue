<template>
  <div id="app">
    <link rel="stylesheet" 
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" 
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" 
        crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
  import Graph from './components/Graph'
  import store from './store/store'
  import router from './router'
  import {HTTP} from './main'

  export default {
    name: 'app',
    data(){
      return {
      }
    },
    components: { 
    },
    created: function () {
      HTTP.interceptors.response.use(undefined, err => {
        return new Promise(function (resolve, reject) {
          if ((err.response.status === 401 || err.response.status === 422) && err.config && !err.config.__isRetryRequest) {
            store.dispatch('logout')
            .then(() => {
              router.push('/login')
            })
          }
          throw err;
        });
      });
    },
  }
</script>

<style>
html, body{
  margin: 0;
  height: 100%;
  min-height: 100%;
  font-family: 'Roboto', sans-serif;
  color:#FFFFFF;
  background-color: #0c111b;
}

body{
  display: flex;
  flex-direction: column;
}

.overlaycontent{
  display:flex;
  flex-direction:row;
  width:100%;
  justify-content:center;
  max-height:calc(100% - 80px);
  background:#141a26;
  box-sizing: border-box;
  position: relative;
  overflow-y:auto;
  flex-wrap:wrap;
}
.overlayfooter{
  display:flex;
  justify-content:space-between;
  align-items:center;
  box-sizing: border-box;
  padding-left:20px;
  padding-right:20px;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  background:#323b47;
  height:30px;
  font-size:12px;
  width:100%;
}
.overlaytop{
  height:50px;
  width:100%;
  background:#323b47;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
  padding: 15px;
  display:flex;
  flex-direction:row;
  box-sizing: border-box;
  justify-content:space-between;
  align-items:center;
}
.pageoverlay{
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:center;
  background-color:rgba(0, 0, 0, 0.5);
  height:100%;
  width:100%;
  z-index:75;
  position:fixed;
  top:0px;
  left:0px;
}
.pointer{
  cursor:pointer;
}

.bgc3{background:#d8513f;}
.bgc2{background:#eab63e;}
.bgc1{background:#58a55c;}
.bgc0{background:#4a89e8;}
.c3{color:#d8513f;}
.c2{color:#eab63e;}
.c1{color:#58a55c;}
.c0{color:#4a89e8;}

.btn{
    border-radius: 5px;
    border: none;
    cursor:pointer;
    background-color:#acb3bf;
    margin-right:2px;
    margin-left:2px;
}
.btn-small{
    font-size: 10px;  
    height:20px;
    
}
.btn-large{
    font-size: 15px;
    height:30px;
}

.block{
  height:250px;
/*   min-height:250px; */
  width:250px;
/*   min-width:250px; */
  margin: 20px;
/*   padding: 0px; */
  /* box-sizing: border-box; */
  display:flex;
  flex-direction:column;
}

.item_title{
  height:40px;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
  padding-left: 15px;
  padding-right: 15px;
  display:flex;
  align-items:center;
}

.item_content{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:space-around;
  height:190px;
  background:#141a26;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
}

.item_footer{
  display:flex;
  /* justify-content:space-between; */
  align-items:center;
  /* box-sizing: border-box; */
  padding-left:20px;
  padding-right:20px;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  background:#323b47;
  height:30px;
  font-size:12px;
}

.grid{
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  top:100px;
  height:calc(100% - 100px);
  overflow: auto;
  position:fixed;
  width:100%;
}

.overlaybox{
  display:flex;
  flex-direction:column;
  height:70%;
  width:70%;
  box-sizing: border-box;
  align-items:center;
  justify-content:center;
}

.img_large{
  height:100%;
}

.thumbnails{
    display:flex;
    flex-direction:row;
    flex-wrap:wrap;
}

.thumbnailblock{
    display:flex;
    flex-direction:column;
    margin:5px;
    cursor: pointer;
}

.thumbnailblock:hover {
    background-color:lightblue;
}

.thumbnail{
    height:100px;
}

.loginbox{
  display:flex;
  flex-direction:column;
  height:300px;
  width:300px;
  box-sizing:border-box;
  align-items:center;
  justify-content:center;
}

.loginform{
  display:flex;
  flex-direction:column;
  justify-content:space-around;
  min-height:175px;
  width:100%;
  box-sizing:border-box;
  padding-left:5px;
  padding-right:5px;
}

.header{
  display:flex;
  flex-direction:row;
  height:100px;
  align-items:center;
  box-sizing: border-box;
  padding:20px;
  justify-content:space-between;
  border-bottom:2px solid #FFFFFF;
  position:fixed;
  width:100%;
}

h1 span{
    font-size:16px;
}

.menuitem{
  display:flex;
  flex-direction:row;
  margin:2px;
  align-items:center;
}

.menuitem i{
  padding-right:5px;
}

.menu{
  display:flex;
  flex-direction:row;
}

.inputWithIcon{
    position: relative;
}

.inputWithIcon i {
  position: absolute;
  right: 0;
  padding-right: 10px;
  color:#FFFFFF;
}

.overlaycontentsub-v{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:space-around;
  height:100%;
  width:50%;
}

.overlaycontentsub-h{
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:space-around;
  height:50%;
  min-height:250px;
  width:100%;
}
.tablerow{
  display:flex;
  flex-direction:row;
  width:100%;
  justify-content:space-around;
  cursor:pointer;
}

.tablerow:nth-child(even){
    background-color: #0c111b;
}

.tablerow:nth-child(odd){
    background-color: #101622; 
}

.tilerow:nth-child(even){
    background-color: #0c111b;
}

.tilerow:nth-child(odd){
    background-color: #101622;
}

.tablecell{
    width:33%;
    padding-left:10px;
}

.overlaybox{
  display:flex;
  flex-direction:column;
  height:70%;
  width:70%;
  box-sizing: border-box;
  align-items:center;
  justify-content:center;
}
.tablehead{
  display:flex;
  flex-direction:row;
  width:100%;
  justify-content:space-around;
  background:#323b47;
}

.tableheader{
  width:33%;
  padding-left:10px;
}

.textbox{
  border:none;
  background-color:#323b47;
  width:100%;
  height:30px;
  border-bottom:3px solid #3c6eb9;
  color:white;
  font-family: 'Roboto', sans-serif;
  border-radius: 5px;
}

.dot{
  position:absolute;
  width:14px;
  height:14px;
  border-radius:50%;
  z-index: 50;
}

.tdot{
  position:absolute;
  right:150px;
  padding-left:15px;
  word-break: break-word;
}

.tlimit{
  position:absolute;
  left:150px;
}

.line{
  position:absolute;
  width:5px;
}

.item_img{
  width:160px;
  height:160px;
}

.date_select{
    background:#323b47;
    border:none;
    color:white;
}

.fa-rotate-45 {
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
}

.fade-enter-active, .fade-leave-active{
    transition: opacity 0.25s ease-out;
}

.fade-enter, .fade-leave-to{
    opacity: 0;
}

.first_item{
    order:1;
}

.tilerow{
  display:flex;
  flex-direction:row;
  flex-wrap:no-wrap;
  width:100%;
}

.tilegroup{
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
}

.grouplabel{
  display:flex;
  flex-direction:column;        /* added for add report... */
  align-items:center;
  justify-content:space-around;
  background:#323b47;
  height:250px;
  width:50px;
  border-radius:25px;
  margin:20px;
}

.vertical-text{
  transform: rotate(270deg);
  white-space: nowrap;
}

.UserMenu{
  z-index:500;
  width:100px;
  position:absolute;
  right:35px;
  display:flex;
  flex-direction:column;
  border-radius:5px;
  background-color:#DDDDDD;
  color:#000000;
}

.MenuItem{
  display:flex;
  flex-direction:row;
  flex-wrap:no-wrap;
  justify-content:flex-start;
  align-items:center;
  height:30px;
  padding:5px;
}
</style>

