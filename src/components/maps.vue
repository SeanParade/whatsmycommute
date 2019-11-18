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
        // Question = how to access variable defined in data inside window.initMap or is this bad practice
        // Question = error: You have included Google Maps JS API Multiple times in this page. How to check if scripts included and only append once
        // Question = sometimes lat: NaN is not an accepted value even though it has value
        var map, lat, long;
        window.initMap = function(){
                let myOptions = { 
                    zoom: 15,
                    center:  new google.maps.LatLng(lat, long)
                }
                map = new window.google.maps.Map(document.getElementById("map"), myOptions)
        }
        export default {
            name: "maps",
            methods: { 
            },
            data(){
                return{
                    startLocation : "",
                    endLocation : "",
                    directionData : []
                }
            },
            mounted() {
                this.setOrigin();
                //Load Google Maps API 
                let mapScript = document.createElement('script');
                mapScript.async = true;
                mapScript.defer = true;
                mapScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTFd6UTZ6sUOcSRLrRCPCEOAYmfrEz-Zg&callback=initMap&libraries=places';
                this.$el.parentElement.append(mapScript)
            },
            methods: {
                // Gets coordinate of current location and assigns it to origin input field
                setOrigin: function(){
                    let self = this;
                    navigator.geolocation.getCurrentPosition(function(position){
                        lat = position.coords.latitude;
                        long = position.coords.longitude;
                        self.startLocation = lat + ',' + long;
                    })
                },
                getRoute: function(){
                    let self = this; 
                    //Get Services to Calculate and Retrieve Data
                    var directionsService = new google.maps.DirectionsService();
                    var directionsRenderer = new google.maps.DirectionsRenderer({map: map});
                    var markerA = new google.maps.Marker({
                        position: this.startLocation,
                        title: "point A",
                        label: "A",
                        map: map
                    })
                    var markerB = new google.maps.Marker({
                        position: this.endLocation,
                        title: "point B",
                        label: "B",
                        map: map
                    })
                    directionsService.route(
                       {
                           origin: {query: this.startLocation},
                           destination: {query: this.endLocation},
                           travelMode: 'TRANSIT'
                       },
                       function(response, status) {
                           if(status === 'OK') {
                               let directionInfo = response.routes[0].legs[0]
                               self.$root.$emit('processDirection', directionInfo) //Revisit
                               //Draws Map Route
                               directionsRenderer.setDirections(response)
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
    height: 60%;
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