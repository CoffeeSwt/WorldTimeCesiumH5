<template>
    <div w-full h-screen flex flex-col relative font-exo2>
        <div ref="viewerRef" size-full></div>
        <div absolute bottom-0 class="left-1/2 translate-x--1/2" backdrop-blur-3 shadow-lg rounded-t-4 w-full lg:w-120
            flex flex-col items-center p-4 cursor-pointer text-gray-8>
            <div hover:text-main-blue w-full flex flex-col items-center @click="changeShow" transition-all box-border
                duration-150 cursor-pointer>
                <div text-7xl>{{ timeStore.currentTime }}</div>
                <div text-3xl m-2>{{ timeStore.currentDate }}</div>
            </div>
            <div w-full v-show="show" flex items-center justify-center gap-4>
                <div size-16 i-ic-outline-access-time></div>
                <div flex flex-col items-center>
                    <div text-2xl flex items-center>{{ timeStore.currentTimeChoosen }}</div>
                    <div text-lg flex items-center>{{ timeStore.currentDateChoosen }}</div>
                </div>
                <div text-2xl h-16 flex items-center>UTC{{ timeStore.timeZone }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import mapboxgl from 'mapbox-gl';
import worldTimeGeojson from '@/assets/Time_Zones.geo.json'
import { useTimeStore } from '@/store/timeStore';
//@ts-ignore
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
const timeStore = useTimeStore()
const show = ref(true)
const changeShow = () => {
    document.startViewTransition(() => {
        show.value = !show.value
    })

}
const withID = (json: any) => {
    const features = json.features as []
    const featuresWithId = features.map((item: any, index: number) => {
        return {
            id: index + 1,
            ...item
        }
    })
    return {
        type: 'FeatureCollection',
        features: featuresWithId
    }
}
const viewerRef = ref(null)
const hoveredPolygonId = ref<number | null>(null)
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
onMounted(() => {
    const map = new mapboxgl.Map({
        container: viewerRef.value!, // container ID
        style: 'mapbox://styles/coffeesw/cm45824h300dq01s6dr3w3iap', // style URL
        center: [116.3912757, 39.906217], // starting position [lng, lat]
        zoom: 4, // starting zoom
        attributionControl: false,
    });

    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    });
    // Add the control to the map.
    map.addControl(geocoder, 'top');
    // map.addControl(new mapboxgl.NavigationControl(),'top');

    map.on('style.load', () => {

        map.addSource('worldtime', {
            'type': 'geojson',
            'data': withID(worldTimeGeojson) as any
        });

        map.addLayer({
            'id': 'worldtime-fills',
            'type': 'fill',
            'source': 'worldtime',
            'layout': {},
            'paint': {
                'fill-color': '#627BC1',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.2,
                    0
                ]
            }
        });

        map.addLayer({
            'id': 'worldtime',
            'type': 'line',
            // This property allows you to identify which `slot` in
            // the Mapbox Standard your new layer should be placed in (`bottom`, `middle`, `top`).
            'slot': 'middle',
            'source': 'worldtime',
            'layout': {},
            'paint': {
                'line-color': '#627BC1',
                'line-width': 2
            }
        });


        // When the user moves their mouse over the state-fill layer, we'll update the
        // feature state for the feature under the mouse.
        map.on('mousemove', 'worldtime-fills', (e) => {
            // console.log(e)
            const features = map.queryRenderedFeatures(e.point);

            if (features!.length > 0) {
                const zone = features[0].properties!['ZONE']
                // console.log(features[0].properties)
                timeStore.timeZone = zone
                if (hoveredPolygonId.value !== null) {
                    map.setFeatureState(
                        { source: 'worldtime', id: hoveredPolygonId.value! },
                        { hover: false }
                    );
                }
                hoveredPolygonId.value = e.features![0].id as number;
                map.setFeatureState(
                    { source: 'worldtime', id: hoveredPolygonId.value! },
                    { hover: true }
                );
            }
        });

        // When the mouse leaves the state-fill layer, update the feature state of the
        // previously hovered feature.
        map.on('mouseleave', 'worldtime-fills', () => {
            if (hoveredPolygonId !== null) {
                map.setFeatureState(
                    //@ts-ignore
                    { source: 'worldtime', id: hoveredPolygonId },
                    { hover: false }
                );
            }
            hoveredPolygonId.value = null;
        });
    });
})

</script>
