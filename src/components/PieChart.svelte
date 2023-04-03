<script lang="ts">
    import * as echarts from "echarts"
	import { onMount } from "svelte";

    // export let text: any = ""

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
          data: [[12, 5], [24, 20], [36, 36], [48, 10]]
        }
      ]
    });
  });
  
</script>

<div id="pie" style="width: 550px;height:550px;"></div>