import { Line } from 'vue-chartjs'
import ChartJSPluginZoom from 'chartjs-plugin-zoom'

export default {
  extends: Line,
  props: {
    chartdata: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null,
    }
  },
  mounted () {
    this.renderChart(this.chartdata, this.options)
  },
  methods:{
      resetZoom(){
          this.$data._chart.resetZoom()
      },
      reloadGraph(){
          this.renderChart(this.chartdata, this.options)  
      }
  }
}