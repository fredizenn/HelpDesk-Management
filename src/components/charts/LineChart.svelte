<script lang="ts">
    import * as echarts from "echarts"
	import { onMount } from "svelte";

    // export let text: any = ""

    onMount(async () => {
    echarts.init(document.getElementById("main")!).setOption({
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
      xAxis: {},
      yAxis: {},
      series: [
        {
          type: "line",
          smooth: true,
          data: [[12, 5], [24, 20], [36, 36], [48, 10], [60, 10], [72, 20]]
        }
      ]
    });
  });
  
</script>

<div id="main" style="width: 550px;height:550px;"></div>