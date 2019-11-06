<template>
    <div>
        <div class="row">
            <div class="col-12 mt-4 mb-2">
                <span>Bus Route:</span>
                <select id="busRouteList"  
                    @change="getBusStops"
                    v-model="busTag">
                    <!--Is there a reason you included index as opposed to v-for="busRoute in busRouteOptions" and omit :key="index"?-->
                    <template v-for="(busRoute,index) in busRouteOptions"> 
                        <option :key="index" :value="busRoute.tag">{{busRoute.title}}</option>
                    </template>
                </select>
            </div>
            <div class="col-12 my-2">
                <span>
                    Bus Stops: 
                </span>
                <select id="busStopList" 
                v-model="selectedRoute">
                    <template v-for="(busStop,index) in busStopOptions">
                        <option :key="index" :value="busStop.tag">{{busStop.title}}</option>
                    </template>
                </select>
            </div>
            <div class="col-12 my-2">
                <span>
                    Direction: 
                </span>
                <select id="directions">
                    <option value="North">North</option>
                    <option value="East">East</option>
                    <option value="South">South</option>
                    <option value="West">West</option>
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
        </div>
        <div class="container-fluid">
            <!-- Hiding the table if there is no bus data -->
            <template v-if="busData.length > 0">
                <table id="routeTable" >
                    <tr>
                        <th>Route Name</th>
                        <th>Stop Name</th>
                        <th>Direction</th>
                        <th>Time Until</th>
                    </tr>
                    <template v-for="(busSchedule,index) in Object.values(busData)" >
                        <list-item :key="index" :scheduleData="busSchedule"></list-item>
                    </template>
                </table>        
            </template>
        </div>
    </div>
</template>



<script>

import axios from 'axios';
import ListItem from './ListItem.vue'

export default{
    name: 'List',
    components:{
        ListItem
    },
    data(){
        return {
            selectedRoute : '',
            busTag: '',
            stopName: '',
            busRouteOptions: [],
            busStopOptions: [],
            busStopResponseData: [],
            busData: [],
            busDataEdited: []
        }
    },
    methods: {
        getBusRoutes: function(){
            axios.get('http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a=ttc')
            .then(resp => {
                let routeList = resp.data.route
                this.busRouteOptions = routeList;
                this.getBusStops();
            })
            .catch((error) => {
                console.warn(error)
            })
        },

        getBusStops: function(){    
            if(!this.busTag){
                return
            } 
            let stopListURL = 'http://webservices.nextbus.com/service/publicJSONFeed?command=routeConfig&a=ttc&r='+this.busTag;
            axios.get(stopListURL)
            .then(resp => {
                this.busStopResponseData = resp.data;
                //resp data format "route":{"stop":[{"title":"stopName","stopID": stopID,"tag":tagNum}]}
                let busStops = resp.data.route.stop;
                this.busStopOptions = busStops;
            })
            .catch((error) => {
                console.log(error)
            })
        },

        getUserPreferences: function(){

        },
        getBusData: function(){
            let predicitionRoute ='http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=ttc&r='+this.busTag+'&s='+this.selectedRoute+'&useShortTitles=true';
            
            axios.get(predicitionRoute)
            .then(resp => { 
                console.log("RESPONSE",resp)
                let returnedBusSchedule = resp.data.predictions;
                // If the service returns no predicitons
                if(returnedBusSchedule.dirTitleBecauseNoPredictions){
                    console.log(returnedBusSchedule.dirTitleBecauseNoPredictions + 
                    " is either out of service or does not go in this direction");
                } 
                else if (returnedBusSchedule.direction){
                    // Formatting the bus data the way the component expects it
                        this.busData[returnedBusSchedule.routeTitle + ' ' + returnedBusSchedule.stopTitle] = {
                        routeName : returnedBusSchedule.routeTitle,
                        stopName : returnedBusSchedule.stopTitle,
                        direction : returnedBusSchedule.direction.title.split(" ")[0],
                        timeUntil : returnedBusSchedule.direction.prediction.map( t => t.minutes)
                    };
                    console.log(Object.values(this.busData))
                }
            })
            .catch((error) => {
                console.warn(error)
                //console.log(error.dresponse.data.message)
            })
        }
    },
    created(){
    },
    mounted(){
        this.getBusRoutes()
    }
}

</script>
<style>
    #routeTable{
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        margin-top: 20px;
    }
    #routeTable tr{
        width: 100%
    }
    #routeTable tr:first-child{
        background-color:#7aaeff;
    }
    #routeTable tr:nth-child(even){
        background-color:#bfd8ff;
    }
    #routeTable tr th:nth-child(n+1):not(:last-child){
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
        width: 30%
    }
    select#busRouteList{
        width: 30%
    }
</style>