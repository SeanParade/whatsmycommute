<template>
    <div>
        <div class="row">
            <div class="col-12 mt-4 mb-2">
                <span class="optionLabels">
                    Bus Route: 
                </span>
                <select id="busRouteList" v-model="bus">
                    <template v-for="(busRoute,index) in busRouteOptions"> 
                        <option :key="index" :value="busRoute.tag">{{busRoute.title}}</option>
                    </template>
                </select>
            </div>
            <div class="col-12 my-2">
                <span class="optionLabels">
                    Bus Stops: 
                </span>
                <select id="busStopList" v-model="stop">
                    <template v-for="(busStop,index) in busStopOptions">
                        <option :key="index" :value="busStop.tag">{{busStop.title}}</option>
                    </template>
                </select>
            </div>
            <div class="col-12">
                <b-button class="my-4" 
                    variant="info" 
                    id="getBusButton" 
                    @click="setBusData">
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
            <template v-if="Object.values(busData).length > 0"> 
                <span class="tableHeader">Saved Bus Routes</span>
                <table id="routeTable" >
                    <tr>
                        <th>Route Name</th>
                        <th>Stop Name</th>
                        <th>Direction</th>
                        <th>Time Until</th>
                    </tr>
                    <template v-for="busSchedule in busData">
                        <bus-list-item :key="busSchedule.id" :scheduleData="busSchedule"></bus-list-item>
                    </template>
                </table>        
            </template>
        </div>
        <!-- For Displaying Direction Data-->
        <div class="container-fluid" id="directionContainer">
            <!-- Hiding the table if there is no direction data-->
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
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default{
    name: 'List',
    components:{
        BusListItem,
        DirectionListItem
    },
    data(){
        return{
            bus: '',
            stop: ''
        }
    },
    watch: {
        bus: function(val){
            //Get list of bus stops in selected route
            this.$store.commit('set_busStops', val)
        },
        stop: function(val){
            this.$store.commit('set_stopId', val)
        }
    },
    computed: {
        getStopId:{
            get(){
                return this.stopTag
            },
            set(val){
                this.$store.commit("set_stopId",val)
            }
        },
        ...mapState([
            "busTag",
            "stopTag",
            "busRouteOptions",
            "busStopOptions",
            "busData",
            "noResultsError",
            "Departure"
        ]),
    },
    methods: {
        ...mapMutations([
            //Called on mount to render list of bus routes
            "set_busRoutes",
        ]),
        //*SP: When I said "wrapper function", I was just describing a function
        // that's sole purpose was calling other functions for a specific use case
        // so that it enables you to write functions that "only do one thing".
        // You should always name a function for the thing it's trying to do.
        // This should be called something like "loadSavedBusRoutes".
        wrapper: function(){
            if(this.$cookies.get("saved_buses")){
                //this.loadBusinCookie();
            }
        },
        setBusData: function(){
            let predicitionRoute = 'http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=ttc&r='+this.busTag+'&s='+this.stopTag+'&useShortTitles=true';
            axios.get(predicitionRoute)
            .then(resp => { 
                let returnedBusSchedule = resp.data.predictions;
                // If the service returns no predicitons
                if(returnedBusSchedule.dirTitleBecauseNoPredictions){
                    state.noResultsError = returnedBusSchedule.dirTitleBecauseNoPredictions + 
                    " is either out of service or does not go in this direction"
                } 
                else if (returnedBusSchedule.direction){
                    console.log(returnedBusSchedule.direction)
                    //Create unique Id for selected bus route + stop combination
                    let id = returnedBusSchedule.routeTitle + ' ' + returnedBusSchedule.stopTitle;
                    //Format returned bus schedule data
                    let busInfo = {
                        id: id,
                        routeName : returnedBusSchedule.routeTitle,
                        stopName : returnedBusSchedule.stopTitle,
                        direction : returnedBusSchedule.direction.title.split(" ")[0],
                        timeUntil : returnedBusSchedule.direction.prediction.map( t => t.minutes),
                        busTag: this.busTag,
                        stopTag: this.stopTag,
                    }
                    // Get how many buses are currently stored in busData Object
                    let busSaved = this.busData.length;
                    console.log('busData length = ' + busSaved)
                    //Store and Show Max 3 Bus Data with no duplicates
                    if(busSaved < 3 && !this.busData.some(el => el.id == id)) {
                        //this.noResultsError = '';
                        this.busData.push(busInfo)
                        this.$cookies.set(
                            "saved_buses",
                            this.busData
                        )
                    }
                    if(busSaved >= 3 && !this.busData.some(el => el.id == id)){
                        this.busData.shift();
                        this.busData.push(busInfo)
                        this.$cookies.set(
                            "saved_buses",
                            this.busData
                        )
                    }
                };
            })
            .catch((error) => {
                console.warn(error)
            })
        }
    },
    mounted(){
        this.set_busRoutes();
        this.wrapper();
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