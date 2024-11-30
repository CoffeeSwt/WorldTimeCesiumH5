<template>
    <div ref="viewerRef" w-full h-screen></div>
</template>

<script setup lang="ts">
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import worldTimeGeojson from '@/assets/Time_Zones.geo.json'
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
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
onMounted(() => {
    const map = new mapboxgl.Map({
        container: viewerRef.value!, // container ID
        style: 'mapbox://styles/mapbox/standard', // style URL
        center: [116.3912757, 39.906217], // starting position [lng, lat]
        zoom: 9, // starting zoom
        attributionControl: false,
    });
    let hoveredPolygonId: string | number | null | undefined = null;
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
                console.log(zone)
                // debugger
                if (hoveredPolygonId !== null) {
                    map.setFeatureState(
                        { source: 'worldtime', id: hoveredPolygonId! },
                        { hover: false }
                    );
                }
                hoveredPolygonId = e.features![0].id;
                map.setFeatureState(
                    { source: 'worldtime', id: hoveredPolygonId! },
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
            hoveredPolygonId = null;
        });
    });
})

</script>
