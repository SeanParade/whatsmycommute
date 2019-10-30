<template>
<div>
    <b-container>
        <b-row></b-row>
        <b-row>
            <b-col sm="2"></b-col>
            <b-col sm="8" id="tableContainer">  
                <table>
                    <tr>
                        <th>Route Number</th>
                        <th>Route Name</th>
                        <th>Direction</th>
                        <th>Time Until</th>
                    </tr>
                    <template v-for="(busSchedule, index) in busData">
                            <list-item :key="index" :scheduleData="busSchedule"></list-item>
                    </template>
                </table>        
            </b-col>
            <b-col sm="2"></b-col>
        </b-row>
    </b-container>
</div>
</template>



<script>
/**
Grab data from API for bus schedule
Read users preferences for bus choice
Pass list data -> ListItem
*/

import ListItem from './ListItem.vue'
export default{
    name: 'List',
    components:{
        ListItem
    },
    data(){
        return {
            busData: [
                {
                    routeNumber : '1',
                    routeName : 'A',
                    direction : 'North',
                    timeUntil : ['15']
                },
                {
                    routeNumber : '2',
                    routeName : 'B',
                    direction : 'West',
                    timeUntil : ['35']
                },
                {
                    routeNumber : '3',
                    routeName : 'C',
                    direction : 'East',
                    timeUntil : ['55', '76', '100']
                },
            ]
        }
    },
    methods: {
        getUserPreferences: function(){

        },
        getBusData: function(){

        }
    },
    created(){

    },
    mounted(){

    }
}

</script>
<style>
    #tableContainer table{
        width: 100%;
        margin-left: auto;
        margin-right: auto 
    }
    #tableContainer table tr{
        width: 100%
    }
    #tableContainer table tr:first-child{
        background-color:#7aaeff;
    }
    #tableContainer table tr:nth-child(even){
        background-color:#bfd8ff;
    }
    #tableContainer table tr th:nth-child(n+1):not(:last-child){
        width: 20%;
        text-align: center
    }
    #tableContainer table tr th:last-child{
        width: 40%;
        text-align: center;
    }
</style>