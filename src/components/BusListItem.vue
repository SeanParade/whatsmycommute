<template>
    <tr id="busDataRows">
        <td>{{routeName}}</td>
        <td>{{stopName}}</td>
        <td>{{direction}}</td>
        <td >
            <span v-for="(time, index) in timeUntil" :key="index">
                {{timeUntil[index]|formatDisplayTime}}
            </span>
        </td>
    </tr>
</template>
<script>
    export default{
        name: 'bus-list-item',
        props:{
            scheduleData: Object,
        },
        data(){
            return {
                routeName : this.scheduleData.routeName,
                stopName : this.scheduleData.stopName,
                direction : this.scheduleData.direction,
                timeUntil : this.scheduleData.timeUntil
            }
        },
        mounted(){
            console.log(this.scheduleData)
        },
        computed: {
            renderOrder: function(){
                return null
            }
        },
        filters: {
            formatDisplayTime: function(time){
                var timeValue = parseInt(time);
                return timeValue < 60 ? 
                    timeValue + ' min' :
                    Math.floor(timeValue / 60) == 1 ?
                        Math.floor(timeValue / 60) + ' hr' + (timeValue % 60) + ' min':
                        Math.floor(timeValue / 60) + ' hrs' + (timeValue % 60) + ' min'
            }
        },
        
        created(){
        }
    }
</script>
<style>
    #busDataRows td:nth-child(n+4){
        text-align: left;
    }
    #busDataRows td span{
        display: inline-block;
        padding: 5px 10px 5px 10px;
    }
</style>