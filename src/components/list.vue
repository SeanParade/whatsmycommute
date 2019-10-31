<template>
    <div>
        <table id="routeTable">
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
    #routeTable{
        width: 100%;
        margin-left: auto;
        margin-right: auto 
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
</style>