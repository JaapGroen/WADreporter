<template>
  <div class="block">    
    <div class="item_title" v-bind:class="bgc_class">{{test.display_name || test.name}}</div>
    
    <router-link :to="{name:test.type,params:{id_test:test.id}}" tag="div" class="item_content" v-if="test.type=='float'">
      <div class="tlimit" v-bind:style="{top:(calctop.max_limit-9)+'px'}" v-if="test.limit">
        {{test.limit[3]}}
      </div>
      <div class="tlimit" v-bind:style="{top:(calctop.high_limit-9)+'px'}" v-if="test.limit">
        {{test.limit[2]}}
      </div>
      <div class="tlimit" v-bind:style="{top:((calctop.low_limit-9)-9)+'px'}" v-if="test.limit">
        {{test.limit[1]}}
      </div>
      <div class="tlimit" v-bind:style="{top:((calctop.min_limit-9)-9)+'px'}" v-if="test.limit">
        {{test.limit[0]}}
      </div>
      <div v-if="test.limit" class="line bgc2" v-bind:style="{top:calctop.max_limit+'px',height:((calctop.high_limit)-(calctop.max_limit))+'px'}"></div>
      <div v-if="test.limit" class="line bgc1" v-bind:style="{top:(calctop.high_limit)+'px',height:((calctop.low_limit)-(calctop.high_limit))+'px'}"></div>
      <div v-if="test.limit" class="line bgc2" v-bind:style="{top:(calctop.low_limit)+'px',height:((calctop.min_limit)-(calctop.low_limit))+'px'}"></div>
      <div v-if="test.limit && test.value>test.limit[3]" class="line bgc3" v-bind:style="{top:(calctop.value)+'px',height:((calctop.max_limit)-(calctop.value))+'px'}"></div>
      <div v-if="test.limit && test.value<test.limit[0]" class="line bgc3" v-bind:style="{top:(calctop.min_limit)+'px',height:((calctop.value)-(calctop.min_limit))+'px'}"></div>
      <div class="dot" v-bind:class="bgc_class" v-bind:style="{top:(calctop.value-7)+'px'}"></div>
      <div class="tdot" v-bind:class="c_class" v-bind:style="{top:(calctop.value-9)+'px'}">
        {{test.value | decimals}} {{test.units}}
      </div>
    </router-link>
    
    <router-link :to="{name:test.type,params:{id_test:test.id}}" tag="div" class="item_content" v-else-if="test.type=='string'">
      <div class="tlimit" v-bind:style="{top:'82px'}" v-if="test.limit">
        {{test.limit}}
      </div>
      <div class="dot" v-bind:class="bgc_class"> </div>
      <div class="tdot" v-bind:class="c_class">{{test.value}}</div>
    </router-link>
    
    <router-link :to="{name:test.type,params:{id_test:test.id}}" tag="div" class="item_content" v-else-if="test.type=='datetime'">
      <div class="tlimit" v-bind:style="{top:(calctop.today-9)+'px'}">{{today | isodate}}</div>
      <div class="tlimit" v-bind:style="{top:(calctop.limitday-9)+'px'}">{{(today-test.limit*24*3600*1000) | isodate}}</div>
      <div class="line bgc1" v-bind:style="{top:(calctop.today)+'px',height:(calctop.limitday)-(calctop.today)+'px'}"></div>
      <div v-if="test.status==3" class="line bgc3" v-bind:style="{top:(calctop.limitday)+'px',height:(calctop.value)-(calctop.limitday)+'px'}"></div>
      <div class="dot" v-bind:class="bgc_class" v-bind:style="{top:(calctop.value)-9+'px'}"></div>
      <div class="tdot" v-bind:class="c_class" v-bind:style="{top:(calctop.value)-9+'px'}">{{test.value | isodate}}</div>
    </router-link>
    
    <router-link :to="{name:test.type,params:{id_test:test.id}}" tag="div" class="item_content" v-else-if="test.type=='object'">
      <img class="item_img" v-bind:src="'data:image/jpg;base64,'+test.value"/>
    </router-link>
    
    <router-link :to="{name:test.type,params:{id_test:test.id}}" tag="div" class="item_content" v-else-if="test.type=='bool'">
      <div class="tlimit" v-bind:style="{top:'82px'}" v-if="test.limit">
        {{test.limit}}
      </div>
      <div class="dot" v-bind:class="bgc_class"> </div>
      <div class="tdot" v-bind:class="c_class">{{test.value}}</div>
    </router-link>
    
    <div class="item_footer">
        <div class="item_date" v-if="test.type=='datetime'">
            <i v-if="loading_results" class="fas fa-sun fa-spin"></i>
            <select class="date_select" @change="gotoResult()" v-model="selected_result">
                <option v-for="result in ordered_results" :value="result" :key="result.id">{{result.date | isodate}}</option>
            </select>
        </div>       
    </div>


  </div>
</template>


<script>
import _ from 'lodash'
import {HTTP} from '../main'

 export default {
  props: ['test'],
  data(){
      return {
        componentKey: 0,
        loading:true,
        loading_results:true,
        today:new Date(),
        results:[],
        selected_result:{}
      }
  },
  created(){
      this.loadResults()
  },
    methods:{
        loadResults(){
            HTTP.get(this.apiURL+'/selectors/'+this.$route.params.id_selector+'/results').then((resp)=>{
                this.results = resp.data.results
                for (let i=0;i<this.results.length;i++){
                    if (this.results[i].id == this.$route.params.id_result){
                        this.selected_result = this.results[i]
                    }
                }
                this.loading_results = false
            })
        },
        gotoResult(){
            this.$router.push('/selectors/'+this.$route.params.id_selector+'/results/'+this.selected_result.id)
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
            var xaxis, range, maxV, minV, arr, rico
            var ypos={};
            if(item.type=='string'){
                ypos.value=90;
            } else if (item.type=='float'){
                if(item.limit){
                    var temp = item.limit;
                    var temp2 = item.value;
                    temp.push(temp2)
                    arr = temp;
                    maxV = Math.max.apply(Math,arr)
                    minV = Math.min.apply(Math,arr)
                    range = maxV-minV;
                    rico = 160/range;
                    xaxis = minV*rico+170;
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
                    // var limitdaydate = new Date(limitday)
                    arr=[today,imageday,limitday]
                    maxV = Math.max.apply(Math,arr)
                    minV = Math.min.apply(Math,arr)
                    range = maxV-minV;
                    rico = 160/range;
                    xaxis = minV*rico+170;
                    ypos.value = -rico*imageday+xaxis
                    ypos.today = -rico*today+xaxis
                    ypos.limitday = -rico*limitday+xaxis
                } else {
                    ypos.value=90;
                }
            }
            return ypos
        },
        ordered_results(){
            return _.orderBy(this.results, 'date','desc')
        }
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

  }
}
</script>

<style scoped>
.tlimit{
  position:absolute;
  left:150px;
}

.line{
  position:absolute;
  width:5px;
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

.item_img{
  width:160px;
  height:160px;
}

.date_select{
    background:#323b47;
    border:none;
    color:white;
}
</style>
