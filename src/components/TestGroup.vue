<template>
    <div class="tilerow" v-if="sortedTests.length>0 && accessGranted">
        <div class="grouplabeltest" @click="maximized=!maximized">
            <div class="grouplabel">
                <span class="vertical-text">Level {{level}} - {{sortedTests.length}} tests</span>
            </div>
            <!--<div class="labeltext">
                Level {{level}} - {{sortedTests.length}} tests
            </div>-->
        </div>
        <div class="tilegroup" v-if="maximized">
            <TestTile v-for="test in sortedTests" v-bind:test="test" :selector="selector" :result="result" :key="test.type+test.id" :popup="popup"></TestTile>
        </div>
    </div>
</template>

<script>
import TestTile from '@/components/TestTile'
import _ from 'lodash'

  export default {
    props: ['group','selector','result','level','popup'],
    data(){
      return {
          maximized:true
      }
    },
    computed:{
        filteredTests(){
            const testFilter=this.$store.getters.selectorFilter
            return this.group.filter(function(el){
                return el.name.toLowerCase().includes(testFilter)
            })
        },
        sortedTests(){
            var tests = _.orderBy(this.filteredTests,[
                function (item) { return item.type=='datetime';},
                function (item) { return item.status; },
                function (item) { return item.display_name; }
            ],["desc","desc","asc"])
            return tests
        },
        apiURL(){
            return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
        },
        accessGranted(){
            if(this.$store.getters.user.role.number<501){
                return true
            }else if(this.$store.getters.user.role.number==600){
                if (this.level<3){
                    return true
                } else {
                    return false
                }
            }else if(this.$store.getters.user.role.number==700){
                if (this.level<2){
                    return true
                } else {
                    return false
                }
            }
        }
    },

    components: {
        TestTile,
    },
  }
</script>

<style scoped>
.grouplabel{
  display:flex;
  flex-direction:column;
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

.tilerow{
  display:flex;
  flex-direction:row;
  flex-wrap:no-wrap;
  width:100%;
}

.tilerow:nth-child(even){
    background-color: #0c111b;
}

.tilerow:nth-child(odd){
    background-color: #101622;
}

.tilegroup{
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
}
</style>
