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
        let map, directionsService, directionsRenderer

        // *SP: Tied this to a variable and exported that as the default
        // so that we have a reference to the component object for the 
        // outer code. All the inner references that you had to "mapComponent"
        // I've changed to "this" since it doesn't need the reference to the var.
        let mapComponent = {
            name: "maps",
            data(){
                return {
                    startLocation : this.$store.state.startLocation,
                    destination: this.$store.state.destination,
                    //*SP: Using this data prop as a sentinel value for when directionService 
                    // is available
                    directionServiceLoaded: false,
                }
            },
            watch: {
                //*SP: We want to watch for a change on this since when it gets loaded
                // we want to check if a user has save directions
                directionServiceLoaded: function() {
                    this.loadSavedDirections()
                }
            },
            created(){
                let $this = this
                //Set geolocation information
                navigator.geolocation.getCurrentPosition(function(position){
                    $this.$store.state.lat = position.coords.latitude;
                    $this.$store.state.long = position.coords.longitude;

                    let scriptExists = document.getElementById("gmapScript");

                    if (!scriptExists) {
                        //Append Google Maps API 
                        let mapScript = document.createElement('script');
                        mapScript.async = true;
                        mapScript.defer = true;
                        mapScript.id = "gmapScript";
                        mapScript.sensor = false;
                        //*SP: I've removed the promise logic so this should just call a log statement.
                        //mapScript.onerror = rejectGmapsPromise;
                        mapScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTFd6UTZ6sUOcSRLrRCPCEOAYmfrEz-Zg&callback=initMap&libraries=places';
                        document.body.append(mapScript)
                    } else {
                        window.initMap()
                    }
                })
            },
            mounted() {
                //Callback from Google Map Script

                //*SP: I've moved initMap down to the mounted hook since it has
                // data reliant on the component store which doesn't exist until mount.
                let $this = this;
                window.initMap = function(){
                    let myOptions = { 
                        zoom: 15,
                        center: new google.maps.LatLng(
                            parseFloat($this.$store.state.lat), 
                            parseFloat($this.$store.state.long)
                        )
                    }
                    this.map = new window.google.maps.Map(document.getElementById("map"), myOptions)
                    //Create instance of Directions API
                    directionsService = new google.maps.DirectionsService();
                    //*SP: This service is now loaded so we should notify the component
                    // by setting our sentinal to true.
                    $this.directionServiceLoaded = true;

                    directionsRenderer = new google.maps.DirectionsRenderer({
                        map: map
                    });
                }
            },
            computed: {
                // *SP: Adding this as a computed prop since it's used as one
                storedDirectionQuery: ()=> {
                    // *SP: Checking if both props empty
                    /////////////
                    // Sidenote: this is just a fancy way of doing it -- I'm turning the object into an array
                    // so I can call reduce on it and then I'm checking if the sum of the previous(a) and the next(b)
                    // equate to true by calling not not (!!) on it. First ! turns the string into an 
                    // expression (!"value" is false) and the second ! turns it into the non-negative value (since "value" is true)  
                    let hasQueries = Object.values($cookies.get("direction")).reduce((a,b) => (!!a || !!b));
                    return hasQueries ? $cookies.get("direction") : false
                    },
            },
            methods: {
                getDirection: function(){
                    let $this = this
                    this.storeTripQuery()
                    //*SP: Only allowing this to get called once the service is loaded
                    this.directionServiceLoaded 
                        ? directionsService.route(
                            {
                                origin: {query: this.$store.state.startLocation},
                                destination: {query: this.$store.state.destination},
                                travelMode: 'TRANSIT'
                            },
                            function(response, status) {    
                                if(status === 'OK') {
                                    let directions = response.routes[0].legs[0];
                                    $this.renderDirections(directions, response);
                                }
                                else{
                                    window.alert('Directions request failed due to ' + status)
                                }
                            }
                        )
                        : console.log("Still waiting for the Google Maps Direction service to load")
                },
                loadSavedDirections: function(){
                    // *SP: if theres a direction cookie, use that data in the component.
                    // getDirections will store them again so that they will reload.
                    if(this.storedDirectionQuery) {
                        this.startLocation = this.storedDirectionQuery.origin
                        this.destination = this.storedDirectionQuery.destination
                        this.getDirection()
                    } else {
                        console.log("No saved trips found.")
                    }  
                },
                // *SP: Making this function so that we can easily update when
                // we should store a trip query
                storeTripQuery: function() {
                    this.$store.commit('set_startLocation', this.startLocation)
                    this.$store.commit('set_destination', this.destination);
                    
                    this.$cookies.set(
                        "direction",
                        {
                            origin: this.startLocation,
                            destination: this.destination,
                        }
                    ) 
                    
                },
                // *SP: Seperating out this logic so processDirections only does one thing
                storeDirections: function(dir) {
                    this.$store.commit('set_Arrival', dir.arrival_time.text);
                    this.$store.commit('set_Departure', dir.departure_time.text);
                    this.$store.commit('set_Duration', dir.duration.text);
                    this.$store.commit('set_Steps', dir.steps); 
                },
                renderDirections: function(dir, response){
                    this.storeDirections(dir);
                    // *SP: checking against response so that "processDirections"
                    // has some context as to what it needs to do
                    if(response){
                        directionsRenderer.setDirections(response);
                    }           
                }
            }
        }
        // *SP: Script modules require a default export so we've made that the 
        // component var above.
        export default mapComponent;
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