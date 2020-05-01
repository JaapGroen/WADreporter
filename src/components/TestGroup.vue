<template>
    <div class="tilerow" v-if="sortedTests.length>0 && accessGranted">
        <div class="grouplabeltest" @click="maximized=!maximized">
            <div class="labeltext">
                Level {{level}} - {{sortedTests.length}} tests
            </div>
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

<style>
.grouplabeltest{
  display:flex;
  flex-direction:column;        /* added for add report... */
  align-items:center;
  justify-content:center;
  background:#323b47;
  height:250px;
  width:50px;
  border-radius:25px;
  margin:20px;
  cursor:pointer;
}

.labeltext{
  transform: rotate(270deg);
  white-space: nowrap;
}

.labelicon{
  position:relative;
}




</style>
