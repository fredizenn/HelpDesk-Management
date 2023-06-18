<script lang="ts">
    import * as echarts from "echarts"
	import { onMount } from "svelte";

    // export let text: any = ""

    export let totalOpen: any;
    export let totalResolved: any;
    export let totalCancelled: any;
    export let totalOnHold: any;

    onMount(async () => {
    echarts.init(document.getElementById("pie")!).setOption({
      title: { text: "" },
      tooltip: {},
      toolbox: {
        feature: {
          dataView: {},
          saveAsImage: {
            pixelRatio: 2
          },
          restore: {}
        }
      },
    //   xAxis: {},
    //   yAxis: {},
      series: [
        {
          type: "pie",
          smooth: true,
          data: [{name: "Open Tickets", value: totalOpen},
          {name: "Cancelled Tickets", value: totalCancelled},
          {name: "Tickets On Hold", value: totalOnHold},
          {name: "Resolved Tickets", value: totalResolved},
        ]
        }
      ]
    });
  });
  
</script>

<div id="pie" style="width: 550px;height:550px;"></div>