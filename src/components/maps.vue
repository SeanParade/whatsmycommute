<template>
    <div id="map"></div>
</template>
<script>
    //prettier-ignore
    function initMap (){

        var myOptions = {
            zoom: 2,
            center: new window.google.maps.LatLng(39.9388838,116.3974589),
        };
        var map = new window.google.maps.Map(document.getElementById("map"), myOptions);
        let script = document.createElement('script')
        script.async = true;
        script.defer = true;
        script.src = '';
        document.getElementsByTagName('head')[0].appendChild(script);
        console.log('appended')
    }

    console.log(initMap)

    export default {
        name: "maps",
        methods: {

        },
        mounted() {
            let mapScript = document.createElement('script')
            mapScript.async = true;
            mapScript.defer = true;
            mapScript.src = 'https://maps.googleapis.com/maps/api/js?key=$AIzaSyDTFd6UTZ6sUOcSRLrRCPCEOAYmfrEz-Zg&callback=initMap';
            this.$el.parentElement.append(mapScript)
        },
    }
</script>