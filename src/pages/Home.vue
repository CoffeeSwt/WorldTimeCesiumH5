<template>
    <div ref="viewerRef" w-full aspect-ratio-2-1></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
//@ts-ignore
import worldGeoJsonZh from '@/assets/world.zh.json'
import worldTimeZone from '@/assets/Time_Zones.geo.json'
import { GeoJSONSourceInput } from 'echarts/types/src/coord/geo/geoTypes.js';
const viewerRef = ref<HTMLDivElement | null>(null)
let myChart: echarts.ECharts | null = null
const options = reactive({
    tooltip: {
        trigger: 'item',
        formatter: '{b}', // 显示区域名称
    },
    geo: {
        map: 'WorldTimeZone',
        roam: true, // 启用缩放和拖拽
        emphasis: {
            itemStyle: {
                areaColor: '#FF9F00', // 高亮颜色
                borderColor: '#FF8C00', // 高亮边框颜色
                borderWidth: 2
            }
        }
    },
    // series: [
    //     {
    //         type: 'map',
    //         map: 'WorldTimeZone',
    //         geoJson: worldTimeZone, // 地图数据
    //         emphasis: {
    //             label: {
    //                 show: true
    //             },
    //             itemStyle: {
    //                 areaColor: '#FF9F00', // 区域高亮颜色
    //                 borderColor: '#FF8C00', // 边框高亮颜色
    //                 borderWidth: 2
    //             }
    //         }
    //     }
    // ]
})
watch(options, () => {
    myChart?.setOption(options);
}, {
    deep: true
})
onMounted(() => {
    myChart = echarts.init(viewerRef.value!);
    echarts.registerMap('World', worldGeoJsonZh as GeoJSONSourceInput);
    echarts.registerMap('WorldTimeZone', worldTimeZone as GeoJSONSourceInput);
    myChart.setOption(options);
})
</script>
