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
                        v-model="startLocation"
                    >
                </b-col>
                <b-col sm="4">
                    <b-button 
                        class="my-3" 
                        variant="info"
                        id="getDirection"
                        @click = "getDirection"
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
                    v-model="destination"
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
        import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
        let mapComponent, map, directionsService, directionsRenderer
        
        let resolveGmapsPromise, rejectGmapsPromise;
        const gmapsPromise = new Promise((resolve, reject) => {
            resolveGmapsPromise = resolve;
            rejectGmapsPromise = reject;
        })

        //Callback from Google Map Script
        window.initMap = function(){
            let myOptions = { 
                zoom: 15,
                center: new google.maps.LatLng(
                    parseFloat(mapComponent.$store.state.lat), 
                    parseFloat(mapComponent.$store.state.long)
                )
            }
            this.map = new window.google.maps.Map(document.getElementById("map"), myOptions)
            //Create instance of Directions API
            directionsService = new google.maps.DirectionsService();
            directionsRenderer = new google.maps.DirectionsRenderer({
                map: map
            });
            resolveGmapsPromise = true;
        }
        export default {
            name: "maps",
            data(){
                return {
                    startLocation : '',
                    destination: '',
                }
            },
            watch: {
                startLocation: function(val){
                    this.$store.commit('set_startLocation',val);
                },
                destination: function(val){
                    this.$store.commit('set_destination',val);
                }
            },
            created(){
                mapComponent = this;
                //Set geolocation information
                navigator.geolocation.getCurrentPosition(function(position){
                    mapComponent.$store.state.lat = position.coords.latitude;
                    mapComponent.$store.state.long = position.coords.longitude;
                    //Append Google Maps API 
                    let mapScript = document.createElement('script');
                    mapScript.async = true;
                    mapScript.defer = true;
                    mapScript.sensor = false;
                    mapScript.onerror = rejectGmapsPromise;
                    mapScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTFd6UTZ6sUOcSRLrRCPCEOAYmfrEz-Zg&callback=initMap&libraries=places';
                    document.body.append(mapScript)
                })
            },
            mounted() {
                async function scriptLoader(){
                    try{
                        let gmapsLoaded = await gmapsPromise;
                        this.wrapper();
                    }
                    catch(e){
                        console.log(e)
                    }
                }
                scriptLoader();
            },
            methods: {
                wrapper: function(){
                    if($cookies.get("direction")){
                        console.log("loading saved directions")
                        this.loadSavedDirections();
                    }
                },
                getDirection: function(){
                    directionsService.route(
                        {
                            origin: {query: this.$store.state.startLocation},
                            destination: {query: this.$store.state.destination},
                            travelMode: 'TRANSIT'
                        },
                        function(response, status) {    
                            if(status === 'OK') {
                                let directions = response.routes[0].legs[0];
                                mapComponent.processDirection(directions, response);
                            }
                            else{
                                window.alert('Directions request failed due to ' + status)
                            }
                        }
                    )
                },
                loadSavedDirections: function(){
                    let savedStartLoc = $cookies.get("direction").origin;
                    let savedDestination = $cookies.get("direction").destination;
                    directionsService.route(
                        {
                            origin: {query: savedStartLoc},
                            destination: {query: savedDestination},
                            travelMode: 'TRANSIT'
                        },
                        function(response, status) {    
                            if(status === 'OK') {
                                let directions = response.routes[0].legs[0];
                                mapComponent.processDirection(directions);
                            }
                            else{
                                window.alert('Directions request failed due to ' + status)
                            }
                        }
                    )
                },
                processDirection: function(dir, response){
                    mapComponent.$store.commit('set_Arrival',dir.arrival_time.text);
                    mapComponent.$store.commit('set_Departure', dir.departure_time.text);
                    mapComponent.$store.commit('set_Duration',dir.duration.text);
                    mapComponent.$store.commit('set_Steps',dir.steps);  
                    directionsRenderer.setDirections(response);
                    $cookies.set(
                        "direction",
                        {
                            origin: mapComponent.$store.state.startLocation,
                            destination: mapComponent.$store.state.destination
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