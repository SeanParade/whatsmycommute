<template>
    <div>
        <div class="row">
            <div class="col-12 mt-4 mb-2">
                <span class="optionLabels">
                    Bus Route: 
                </span>
                <!--busRoute.tag is like the id for bus routes-->
                <!--v-model uses this tag to get a list of bus stops in the selected route-->

                <!--use data and watch instead-->
                <select id="busRouteList" v-model="getbusStops">
                    <template v-for="(busRoute,index) in busRouteOptions"> 
                        <option :key="index" :value="busRoute.tag">{{busRoute.title}}</option>
                    </template>
                </select>
            </div>
            <div class="col-12 my-2">
                <span class="optionLabels">
                    Bus Stops: 
                </span>
                <!--V-model sets state.stopTag = busStop.tag which is like the id for bus stops-->
                <!--We need a combination of bus route tag and bus stop tag to get bus info later-->

                <!--use data and watch instead-->
                <select id="busStopList" v-model="getStopId">
                    <template v-for="(busStop,index) in busStopOptions">
                        <option :key="index" :value="busStop.tag">{{busStop.title}}</option>
                    </template>
                </select>
            </div>
            <div class="col-12">
                <b-button class="my-4" 
                    variant="info" 
                    id="getBusButton" 
                    @click="set_busData">
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
                    <template v-for="busSchedule in Object.values(busData)">
                        <bus-list-item :key="busSchedule.uniquekey" :scheduleData="busSchedule"></bus-list-item>
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
    computed: {
        getbusStops:{
            get(){
                return this.busTag
            },
            set(val){
                this.$store.commit("set_busStops", val)
            }
        },
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
            //Called when user clicks on Get Bus Info button. Retrieves bus information. 
            "set_busData"
        ]),
    },
    mounted(){
        this.set_busRoutes();
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