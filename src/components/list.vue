<template>
    <div>
        <div class="row">
            <div class="col-12 mt-4 mb-2">
                Bus Route: 
                <select id="busRouteList" name="busRouteList" @change="getBusStops"></select>
            </div>
            <div class="col-12 my-2">
                Bus Stops: 
                <select id="busStopList" name="busStopList" @change="setStopTag"></select>
            </div>
            <div class="col-12 my-2">
                Direction: 
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
                        <th>Route Number</th>
                        <th>Route Name</th>
                        <th>Direction</th>
                        <th>Time Until</th>
                    </tr>
                    <template v-for="(busSchedule, index) in busData" >
                        <list-item :key="index" :scheduleData="busSchedule"></list-item>
                    </template>
                </table>        
            </template>
        </div>
    </div>
</template>



<script>
/**
Grab data from API for bus schedule
Read users preferences for bus choice
Pass list data -> ListItem
*/
import axios from 'axios';
import ListItem from './ListItem.vue'
import $ from 'jquery'

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
            stopTag: '',
            busRouteOptions: [],
            busStopOptions: [],
            busStopResponseData: [],
            busData: []
        }
    },
    methods: {
        getBusRoutes: function(){
            axios.get('http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a=ttc')
            .then(resp => {
                //resp data format "route": {"title":"route name", "tag":tagNum}
                for(let i=0; i< resp.data.route.length; i++){
                    this.busRouteOptions.push("<option value='" + resp.data.route[i].title + "'>" + resp.data.route[i].title +'</option>')
                }
                $('select#busRouteList').append(this.busRouteOptions)
                this.getBusStops();
            })
            .catch((error) => {
                console.warn(error)
            })
        },
        getBusStops: function(e){
            this.busStopOptions = []
            $('select#busStopList').empty();
            
            e ?
                this.selectedRoute = e.target.options[e.target.options.selectedIndex].value :
                this.selectedRoute = $('select#busRouteList').val();
            
            this.busTag = this.selectedRoute.match(/\d+/g) //eslint-disable-line

            let stopListURL = 'http://webservices.nextbus.com/service/publicJSONFeed?command=routeConfig&a=ttc&r='+this.busTag[0]
            axios.get(stopListURL)
            .then(resp => {
                this.busStopResponseData = resp.data;
                //resp data format "route":{"stop":[{"title":"stopName","stopID": stopID,"tag":tagNum}]}
                for (let i=0; i<resp.data.route.stop.length; i++){
                    this.busStopOptions.push("<option value='" + resp.data.route.stop[i].title.replace(/'/g,'&#x27;') + "'>" + resp.data.route.stop[i].title.replace(/'/g,'&#x27;') + '</option>')
                }
                $('select#busStopList').append(this.busStopOptions);
                //Set Initial Value of stopTag
                this.stopTag = this.stopTag === '' ? 
                    this.busStopResponseData.route.stop.filter(index => index.title === $("select#busStopList").val())[0].tag :
                    ''
            })
            .catch((error) => {
                console.log(error)
            })
        },
        //Used to set stopTag to call prediction later
        setStopTag: function(e){
            this.stopName = e.target.options[e.target.options.selectedIndex].value
            for (let i=0; i<this.busStopResponseData.route.stop.length; i++){
                this.busStopResponseData.route.stop[i].title === this.stopName ?
                this.stopTag = this.busStopResponseData.route.stop[i].tag  :
                ''
            }
        },
        getUserPreferences: function(){

        },
        getBusData: function(){
            axios.get('http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=ttc&r='+this.busTag+'&s='+this.stopTag+'&useShortTitles=true')
            .then(resp => {
                let returnedBusSchedule = resp.data.predictions;
                // If the service returns no predicitons
                if(returnedBusSchedule.dirTitleBecauseNoPredictions){
                    console.log(returnedBusSchedule.dirTitleBecauseNoPredictions + 
                    " is either out of service or does not go in this direction");
                } 
                else if (returnedBusSchedule.direction){
                    // Formatting the bus data the way the component expects it
                    this.busData.push({
                        routeNumber : returnedBusSchedule.routeTitle,
                        routeName : '', //May not need this property afterall
                        direction : returnedBusSchedule.direction.title.split(" ")[0],

                        // looping through the prediciton object and only returning the minutes
                        // since that's all we need here
                        timeUntil : returnedBusSchedule.direction.prediction.map( t => t.minutes),
                    });
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