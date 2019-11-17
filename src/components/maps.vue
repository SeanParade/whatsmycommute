<template>
    <b-container fluid class="col-12">
        <b-row>
            <b-row id="startContainer">
                <b-col sm="8">
                    <b-row>
                        <span>
                            Origin: 
                        </span>
                    </b-row>
                    <input id="start"
                        type = "text"
                        :value="startLocation"
                    >
                </b-col>
                <b-col sm="4">
                    <b-button 
                        class="my-3" 
                        variant="info"
                        id="getDirection"
                        @click = "getRoute"
                    >
                        Get Direction          
                    </b-button>
                </b-col>
            </b-row>
            <b-row id="endContainer">
                <b-row>
                    <span>
                        Destination : 
                    </span>
                </b-row>
                <input id="start"
                    type = "text"
                    v-model="endLocation"
                >
            </b-row>
            <b-row id="note">
                <span>
                *Address and coordinates are both accepted
                </span>
            </b-row>
        </b-row>
        <div id="map"></div>
    </b-container>
</template>

<script>
        //prettier-ignore
        // Question = how to access variable defined in data inside window.initMap
        // Question = error: You have included Google Maps JS API Multiple times in this page. How to check if scripts included and only append once
        window.initMap = function(){
            navigator.geolocation.getCurrentPosition(function(position){
                let lat = position.coords.latitude;
                let long = position.coords.longitude;
                let myOptions = { 
                    zoom: 15,
                    center:  new google.maps.LatLng(lat, long)
                }
                let map = new window.google.maps.Map(document.getElementById("map"), myOptions);
                //Show Bus Stops
                let transitLayer = new google.maps.TransitLayer();
                transitLayer.setMap(map);
            })
        }
        export default {
            name: "maps",
            methods: { 
                // when I put methods here and call from 
                // inside initMap, I get methods is not defined at eval
            },
            data(){
                return{
                    lat: "",
                    long: "",
                    startLocation : "",
                    endLocation : "",
                    directionData : []
                }
            },
            mounted() {
                this.setOrigin();
                let mapScript = document.createElement('script')
                mapScript.async = true;
                mapScript.defer = true;
                mapScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTFd6UTZ6sUOcSRLrRCPCEOAYmfrEz-Zg&callback=initMap&libraries=places';
                this.$el.parentElement.append(mapScript)
            },
            methods: {
                setOrigin: function(){
                    let self = this;
                    navigator.geolocation.getCurrentPosition(function(position){
                        self.lat = position.coords.latitude;
                        self.long = position.coords.longitude;
                        self.startLocation = self.lat + ',' + self.long;
                    })
                },
                getRoute: function(){
                    let self = this; // What's the best way to get around
                    var directionsService = new google.maps.DirectionsService();
                    var directionsRenderer = new google.maps.DirectionsRenderer();
                    directionsService.route(
                       {
                           origin: {query: this.startLocation},
                           destination: {query: this.endLocation},
                           travelMode: 'TRANSIT'
                       },
                       function(response, status) {
                           if(status === 'OK') {
                               let directionInfo = response.routes[0].legs[0]
                               console.log(response.routes[0].legs[0])
                               self.$root.$emit('processDirection', directionInfo) // best practices ? doing self.emit and creating <map @processDirection></map> in list.vue did not work
                           }
                           else{
                               window.alert('Directions request failed due to ' + status)
                           }
                       }
                   )
                } 
            }
        }
</script>
<style>
  #map {
    height: 100%;
    width: 100%;
    position: absolute;
  }
  #startContainer input{
    margin-left: 10px;
  }
  #endContainer{
    margin: 15px 10px 15px 10px;
  }
  #startContainer span{
    color: white;
    font-style: Courier;
    font-size: 16px;
    margin-left: 25px;
  }
  #endContainer span{
    color: white;
    font-style: Courier;
    font-size: 16px;
    margin-left: 15px;
    margin-right: 15px;
  }
  #startContainer input{
      width: 100%
  }
  #endContainer input{
    width: 60%
  }
  #note span{
    color: white;
    font-style: Courier;
    font-size: 12px;
    margin-left: 25px;
    margin-right: 15px;
    margin-bottom: 10px;
  }
  #getDirection{
     margin-top: 24px;
  }
</style>