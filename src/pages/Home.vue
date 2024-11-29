<template>
    <div ref="viewerRef" w-full h-screen></div>
    <div fixed top-0 left-0 size-20 bg-black @click="flyHome">111</div>
</template>

<script setup lang="ts">
import { CesiumBox } from '@/assets/ts';
const viewerRef = ref(null)
const tdtKey = '2fad0ff3b2a3043f59d78b4b575e3bca'
const cesiumBox = new CesiumBox().setOptions({
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    shadows: true,
})
cesiumBox.withTDTToken(tdtKey).useVecBasicLayer().useVecLayerTags()
const flyHome = () => {
    cesiumBox.resetDefaultCamPosition()
}
onMounted(() => {
    cesiumBox.init(viewerRef.value!)
})
</script>
