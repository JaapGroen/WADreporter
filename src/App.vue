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

.pointer{
  cursor:pointer;
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

.bgc3{background:#d8513f;}
.bgc2{background:#eab63e;}
.bgc1{background:#58a55c;}
.bgc0{background:#3c6eb9;}
.c3{color:#d8513f;}
.c2{color:#eab63e;}
.c1{color:#58a55c;}
.c0{color:#3c6eb9;}

.button{
  border-radius: 5px;
  border: none;
  font-size: 15px;  
  height:30px;
  cursor:pointer;
  background-color:#acb3bf;
}

.smbutton{
  border-radius: 5px;
  border: none;
  font-size: 10px;  
  height:20px;
  cursor:pointer;
  background-color:#acb3bf;
}

.block{
  height:250px;
  min-height:250px;
  width:250px;
  min-width:250px;
  margin: 20px;
  padding: 0px;
  box-sizing: border-box;
  display:flex;
  flex-direction:column;
}

.item_title{
  height:40px;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
  display:flex;
  justify-content:space-between;
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
</style>

