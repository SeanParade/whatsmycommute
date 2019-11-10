<template>
    <div id="map"></div>
</template>

<script>
    export default {
        name: "maps",
        mounted() {
            this.loadGmap();
        },
        methods: {
            loadGmap: function(){
                let script = document.createElement('script')
                script.async = true;
                script.defer = true;
                script.src = 'https://maps.googleapis.com/maps/api/js?key=$AIzaSyDTFd6UTZ6sUOcSRLrRCPCEOAYmfrEz-Zg&callback=mapInit';
                window.mapinit = () => {
                    document.getElementsByTagName('head')[0].appendChild(script);
                    console.log('appended')
                }
            this.createMap();
            },
            createMap: function(){
                // If I include below, I get 'google' is not defined error which makes me think that the script is not loaded? 
                /*
                var myOptions = {
                    zoom: 2,
                    center: new google.maps.LatLng(39.9388838,116.3974589),
                };
                var map = new google.maps.Map(document.getElementById("map"), myOptions);
                */
            }
        }
    }
</script>