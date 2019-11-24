<template>
    <div>
        <div class="row">
            <div class="col-12 mt-4 mb-2">
                <span class="optionLabels">
                    Bus Route: 
                </span>
                <select id="busRouteList" 
                    v-model="getBusStops"
                    >
                    <template v-for="(busRoute,index) in busRouteOptions"> 
                        <option :key="index" :value="busRoute.tag">{{busRoute.title}}</option>
                    </template>
                </select>
            </div>
            <div class="col-12 my-2">
                <span class="optionLabels">
                    Bus Stops: 
                </span>
                <select id="busStopList" 
                v-model="selectedRoute">
                    <template v-for="(busStop,index) in busStopOptions">
                        <option :key="index" :value="busStop.tag">{{busStop.title}}</option>
                    </template>
                </select>
            </div>
            <div class="col-12">
                <b-button class="my-4" 
                    variant="info" 
                    id="getBusButton" 
                    @click="getBusData">
                        Get Bus Information
                </b-button>
            </div>
            <div>
                <span>
                    {{this.noResultsError}}
                </span>
            </div>
        </div>

        <!-- For Displaying Bus Data-->
        <div class="container-fluid">
            <!-- Hiding the table if there is no bus data -->
            <template v-if="Object.values(this.busData).length > 0"> 
                <span class="tableHeader">Saved Bus Routes</span>
                <table id="routeTable" >
                    <tr>
                        <th>Route Name</th>
                        <th>Stop Name</th>
                        <th>Direction</th>
                        <th>Time Until</th>
                    </tr>
                    <template v-for="busSchedule in Object.values(busData)" >
                        <bus-list-item :key="busSchedule.uniqueKey" :scheduleData="busSchedule"></bus-list-item>
                    </template>
                </table>        
            </template>
        </div>
        
        <!-- For Displaying Direction Data-->
        <div class="container-fluid" id="directionContainer">
            <!-- Hiding the table if there is no bus data-->
            <template v-if="Departure">
                <span class="tableHeader">Saved Trips</span> 
                <table id="directionTable">
                    <tr>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Duration</th>
                        <th>Steps</th>
                    </tr>
                    <template>
                        <direction-list-item></direction-list-item>
                    </template>
                </table>        
            </template>
        </div>
    </div>
</template>

<script>

import axios from 'axios';
import BusListItem from './BusListItem.vue'
import DirectionListItem from './DirectionListItem.vue'
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'

export default{
    name: 'List',
    components:{
        BusListItem,
        DirectionListItem
    },/*
    data(){
        return {
            selectedRoute : '',
            busTag: '',
            busRouteOptions: [],
            busStopOptions: [],
            busData: [], 
            noResultsError: ''
        }
    },*/
    computed: {
        getbusStops:{
            get(){
                return this.$store.state.busTag
            },
            set(val){
                this.$store.commit('set_busStops', val)
            }
        },
        ...mapState([
            "selectedRoute",
            "busTag",
            "busRouteOptions",
            "busStopOptions",
            "busData",
            "noResultsError",
            "Departure"
        ]),
    },
    methods: {
        ...mapGetters([]),
        ...mapMutations([
            "set_busRoutes",
            "set_busStops"
        ]),
        getBusStops(e){    
            if(!this.busTag){
                return
            } 
            this.$store.commit('set_busStops', e.target.value)
            let stopListURL = 'http://webservices.nextbus.com/service/publicJSONFeed?command=routeConfig&a=ttc&r='+this.busTag;
            axios.get(stopListURL)
            .then(resp => {
                //resp data format "route":{"stop":[{"title":stopName,"stopID": stopID,"tag":tagNum}]}
                let busStops = resp.data.route.stop;
                this.busStopOptions = busStops;
            })
            .catch((error) => {
                console.log(error)
            })
        },
        getUserPreferences: function(){
            let cookieKeys = this.$cookies.keys();
            if(cookieKeys.length > 0){
                for(let i = 0; i < cookieKeys.length; i++){
                    if(cookieKeys[i] != "direction"){
                        let storedBusInfo = this.$cookies.get(cookieKeys[i]);
                        this.busData[cookieKeys[i]] = storedBusInfo;
                    }
                    else if(cookieKeys[i] == "direction"){
                        console.log("direction found")
                        this.directionData = []
                        console.log(this.$cookies.get("direction"))
                        this.directionData.push(this.$cookies.get("direction"))
                    }
                }
            }
        },   
        getBusData: function(){
            let predicitionRoute ='http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=ttc&r='+this.busTag+'&s='+this.selectedRoute+'&useShortTitles=true';
            axios.get(predicitionRoute)
            .then(resp => { 
                let returnedBusSchedule = resp.data.predictions;
                // If the service returns no predicitons
                if(returnedBusSchedule.dirTitleBecauseNoPredictions){
                    this.noResultsError = returnedBusSchedule.dirTitleBecauseNoPredictions + 
                    " is either out of service or does not go in this direction"
                } 
                else if (returnedBusSchedule.direction){
                    let busSaved = Object.keys(this.busData);
                    let thisComponent = this;
                    //Show up to 3 bus information. If there is more than three remove the first and add the latest
                    if(busSaved.length < 3) {
                        this.noResultsError = '';
                        this.setBusData(returnedBusSchedule)
                    }
                    else if(busSaved.length >= 3){
                        let firstKey = Object.keys(this.busData)[0]
                        vm.$delete(
                            this.busData,
                            firstKey
                        )
                        this.$cookies.remove(firstKey)
                        this.setBusData(returnedBusSchedule)
                    }
                };
            })
            .catch((error) => {
                console.warn(error)
            })
        },
        setBusData: function(returnedBusSchedule){
            let self = this;
            let busKey = returnedBusSchedule.routeTitle + ' ' + returnedBusSchedule.stopTitle;
            let busInfo = {
                routeName : returnedBusSchedule.routeTitle,
                stopName : returnedBusSchedule.stopTitle,
                direction : returnedBusSchedule.direction.title.split(" ")[0],
                timeUntil : returnedBusSchedule.direction.prediction.map( t => t.minutes),
            }
            self.$set(
                this.busData, 
                "busKey",
                busInfo
            )
            this.$cookies.isKey(busKey) ?
                '':
                this.$cookies.set(
                busKey,
                busInfo
            )
        },
        setDirection: function(e){  
            /*
            console.log('called')
            var directionDetails = {
                arrival: e.arrival_time,
                departure: e.departure_time,
                duration: e.duration,
                steps: e.steps
            }
            */
            console.log(directionDetails)
            //this.directionData.push(directionDetails)
            this.$cookies.set(
                "direction",
                directionDetails
            )
            // Returns Null even though directionDetails is defined
            console.log(this.$cookies.get("direction"))
        }
    },
    created(){
    },
    mounted(){
        this.set_busRoutes();
        this.getUserPreferences();
    }
}

</script>
<style>
    .optionLabels{
        color: white;
        font-style: Courier;
        font-size: 24px;
    }
    #routeTable, #directionTable{
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        margin-top: 20px;
    }
    #routeTable tr, #directionTable tr{
        width: 100%
    }
    #routeTable tr:first-child, #directionTable tr:first-child{
        background-color:#7aaeff;
    }
    #routeTable tr:nth-child(even){
        background-color:#bfd8ff;
    }
    #directionTable tr:nth-child(even){
        background-color:#bfd8ff;
    }
    #routeTable tr:nth-child(odd):not(:first-of-type){
        background-color: white;
        color: black;
    }
    #directionTable tr:nth-child(odd):not(:first-of-type){
        background-color: white;
        color: black;
    }
    
    #routeTable tr th:nth-child(n+1):not(:last-child){
        width: 20%;
        text-align: center
    }
    #directionTable tr th:nth-child(n+1):not(:last-child){
        width: 20%;
        text-align: center
    }
    #tableContainer tr th:last-child{
        width: 40%;
        text-align: center;
    }
    #getBusButton{
        margin-left: 10px
    }
    select#busStopList{
        width: 40%
    }
    select#busRouteList{
        width: 40%
    }
    .tableHeader{
        color: white;
        font-style: Courier;
        font-size: 24px;
    }
    #directionContainer{
        margin-top: 15px;
        margin-bottom: 15px;
    }
</style>