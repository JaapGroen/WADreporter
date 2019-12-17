<template>
  <div>
  <div class="block">
    <div class="item_title" v-bind:class="bgc_class">{{item.test.display_name || item.test.name}}</div>
    
    <div class="item_content" v-if="item.test.type=='float'" @click="showPopUp">
      <div class="tlimit" v-bind:style="{top:(calctop.max_limit-9)+'px'}" v-if="item.test.limit">
        {{item.test.limit[3]}}
      </div>
      <div class="tlimit" v-bind:style="{top:(calctop.high_limit-9)+'px'}" v-if="item.test.limit">
        {{item.test.limit[2]}}
      </div>
      <div class="tlimit" v-bind:style="{top:((calctop.low_limit-9)-9)+'px'}" v-if="item.test.limit">
        {{item.test.limit[1]}}
      </div>
      <div class="tlimit" v-bind:style="{top:((calctop.min_limit-9)-9)+'px'}" v-if="item.test.limit">
        {{item.test.limit[0]}}
      </div>
      <div v-if="item.test.limit" class="line bgc2" v-bind:style="{top:calctop.max_limit+'px',height:((calctop.high_limit)-(calctop.max_limit))+'px'}"></div>
      <div v-if="item.test.limit" class="line bgc1" v-bind:style="{top:(calctop.high_limit)+'px',height:((calctop.low_limit)-(calctop.high_limit))+'px'}"></div>
      <div v-if="item.test.limit" class="line bgc2" v-bind:style="{top:(calctop.low_limit)+'px',height:((calctop.min_limit)-(calctop.low_limit))+'px'}"></div>
      <div v-if="item.test.limit && item.test.value>item.test.limit[3]" class="line bgc3" v-bind:style="{top:(calctop.value)+'px',height:((calctop.max_limit)-(calctop.value))+'px'}"></div>
      <div v-if="item.test.limit && item.test.value<item.test.limit[0]" class="line bgc3" v-bind:style="{top:(calctop.min_limit)+'px',height:((calctop.value)-(calctop.min_limit))+'px'}"></div>
      <div class="dot" v-bind:class="bgc_class" v-bind:style="{top:(calctop.value-7)+'px'}"></div>
      <div class="tdot" v-bind:class="c_class" v-bind:style="{top:(calctop.value-9)+'px'}">
        {{item.test.value | decimals}} {{item.test.units}}
      </div>
    </div>
    
    <div class="item_content" v-if="item.test.type=='string'" @click="showPopUp">
      <div class="tlimit" v-bind:style="{top:'82px'}" v-if="item.test.limit">
        {{item.test.limit}}
      </div>
      <div class="dot" v-bind:class="bgc_class"> </div>
      <div class="tdot" v-bind:class="c_class">{{item.test.value}}</div>
    </div>
    
    <div class="item_content" v-if="item.test.type=='datetime'" @click="showPopUp">
      <div class="tlimit" v-bind:style="{top:(calctop.today-9)+'px'}">{{today | isodate}}</div>
      <div class="tlimit" v-bind:style="{top:(calctop.limitday-9)+'px'}">{{(today-item.test.limit*24*3600*1000) | isodate}}</div>
      <div class="line bgc1" v-bind:style="{top:(calctop.today)+'px',height:(calctop.limitday)-(calctop.today)+'px'}"></div>
      <div v-if="item.test.status==3" class="line bgc3" v-bind:style="{top:(calctop.limitday)+'px',height:(calctop.value)-(calctop.limitday)+'px'}"></div>
      <div class="dot" v-bind:class="bgc_class" v-bind:style="{top:(calctop.value)-9+'px'}"></div>
      <div class="tdot" v-bind:class="c_class" v-bind:style="{top:(calctop.value)-9+'px'}">{{item.test.value | isodate}}</div>
    </div>
    
    <div class="item_content" v-if="item.test.type=='object'" @click="showPopUp">
      <img class="item_img" v-bind:src="'data:image/jpg;base64,'+item.test.value"/>
    </div>
    
    <div class="item_footer">
        <div class="item_date" v-if="item.test.type=='datetime'">
            <i v-if="loading_results" class="fas fa-sun fa-spin"></i>
            <select class="date_select" @change="change_result()" v-model="selected_result">
                <option v-for="result in allresults" :value="result">{{result.date | isodate}}</option>
            </select>
        </div>       
    </div>

  </div>
  <transition name="fade">
    <graph v-if="PopUpVisible && (item.test.type=='datetime' || item.test.type=='float')" v-on:closePopUp="closePopUp" v-bind:items="[item]" :key="item.test.id"></graph>
    <imageview v-if="PopUpVisible && item.test.type=='object'" v-on:closePopUp="closePopUp" v-bind:item="[item]" :key="item.test.id"></imageview>
    <tableview v-if="PopUpVisible && item.test.type=='string'" v-on:closePopUp="closePopUp" v-bind:item="[item]" :key="item.test.id"></tableview>
  </transition>
  </div>
</template>


<script>
 import graph from '../components/Graph'
 import imageview from '../components/ImageView'
 import tableview from '@/components/TableView'
 import {HTTP} from '../main'

 export default {
  props: ['selector','result','test','popup'],
  data(){
      return {
        componentKey: 0,
        today:new Date(),
        GraphVisible:false,
        ImageVisible:false,
        TableVisible:false,
        PopUpVisible:false,
        item:{selector:this.$props.selector,
            result:this.$props.result,
            test:this.$props.test
        },
        loading_results:true,
        allresults:[],
        hover:{footer:false,title:false},
        selected_result:'',
      }
  },
  created(){
      if (this.popup == this.item.test.name || this.popup == this.item.test.display_name){
          this.PopUpVisible=true
      }
      if(this.item.test.type=='datetime'){
          HTTP.get(this.apiURL+'/selectors/'+this.item.selector.id+'/results')
          .then(resp =>{
              this.allresults=resp.data.results
              this.allresults.sort((a, b) => new Date(b.date) - new Date(a.date))
              for (let i=0;i<this.allresults.length;i++){
                  if(this.allresults[i].id==this.item.result.id){
                      this.selected_result=this.allresults[i]
                  }
              }
              this.loading_results=false;
          })
      }
  },
  methods:{
    forceRerender(){
      this.componentKey += 1;
    },
    closePopUp(){
        this.PopUpVisible=false
    },
    showPopUp(){
        this.PopUpVisible=true;
    },
/*     showImage(){
        this.ImageVisible=true;
    },
    showTable(){
        this.TableVisible=true;
    },
    closeGraph(){
        this.GraphVisible=false;
    },
    closeImage(){
        this.ImageVisible=false;
    },
    closeTable(){
        this.TableVisible=false;
    }, */
    enter_footer(){
        this.hover.footer=true;
    },
    leave_footer(){
        this.hover.footer=false;
    },
    change_result(){
        this.$router.push({name:'Tests',params:{idSelector:this.item.selector.id,idResult:this.selected_result.id}})
    },
  },
  computed:{
    bgc_class: function(){
      return 'bgc'+this.test.status
    },
    c_class: function(){
      return 'c'+this.test.status
    },
    apiURL(){
        return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
    },
    calctop:function(){
        var item = this.test;
        var ypos={};
        if(item.type=='string'){
            ypos.value=90;
        } else if (item.type=='float'){
            if(item.limit){
                var temp = item.limit;
                var temp2 = item.value;
                temp.push(temp2)
                var arr = temp;
                var maxV = Math.max.apply(Math,arr)
                var minV = Math.min.apply(Math,arr)
                var range = maxV-minV;
                var rico = 160/range;
                var xaxis = minV*rico+170;
                ypos.value = -rico*item.value+xaxis
                ypos.max_limit = -rico*item.limit[3]+xaxis
                ypos.high_limit = -rico*item.limit[2]+xaxis
                ypos.low_limit = -rico*item.limit[1]+xaxis
                ypos.min_limit = -rico*item.limit[0]+xaxis
            } else {
                ypos.value=90;
            }
        } else if (item.type=='datetime'){
            if (item.limit){
                var imageday=item.value;
                if (typeof imageday=='string'){
                    imageday = Date.parse(imageday);
                }
                var today = new Date();
                today = today.getTime();
                var limitday = today - (item.limit*1000*60*60*24);
                var limitdaydate = new Date(limitday)
                var arr=[today,imageday,limitday]
                var maxV = Math.max.apply(Math,arr)
                var minV = Math.min.apply(Math,arr)
                var range = maxV-minV;
                var rico = 160/range;
                var xaxis = minV*rico+170;
                ypos.value = -rico*imageday+xaxis
                ypos.today = -rico*today+xaxis
                ypos.limitday = -rico*limitday+xaxis
            } else {
                ypos.value=90;
            }
        }
        return ypos
    },   
  },
  filters:{
    prettydate: timestamp =>{
      let currentDate = new Date();
      let toFormat = new Date(timestamp);
      if(!timestamp){
        return '?'
      }
      if(toFormat.getDate() == currentDate.getDate() && toFormat.getMonth() == currentDate.getMonth() && toFormat.getFullYear() == currentDate.getFullYear() ) {
        return 'Today'
      }
      if(toFormat.getDate() == (currentDate.getDate() - 1) && toFormat.getMonth() == currentDate.getMonth() && toFormat.getFullYear() == currentDate.getFullYear()) {
        return 'Yesterday'
      }
      let time_diff = Math.abs(toFormat.getTime() - currentDate.getTime());
      let diff_days = Math.ceil(time_diff / (1000 * 3600 * 24));
      return diff_days + ' days ago'
    },
    decimals: value =>{
        return Math.round(value * Math.pow(10, 2)) / Math.pow(10, 2);
    },
    isodate: timestamp =>{
        let d = new Date(timestamp);
        return d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear()
    },
    msdate: timestamp =>{
        let d = new Date(timestamp);
        return d.getTime()
    }
  },
  components:{
      'graph':graph,
      'imageview':imageview,
      'tableview':tableview
  }
}
</script>

<style>
</style>
