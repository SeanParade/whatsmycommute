<template>
    <div class="row">
        <div class="col-2">
            <stong>{{routeNumber}}</stong>
        </div>
        <div class="col-4">{{routeName}}</div>
        <div class="col-2">{{direction}}</div>
        <div class="col-4">
            <template v-for="(time,index) in timeUntil">
                <span :key="time + index">
                    {{time|formatDisplayTime}}
                </span>
            </template>
        </div>    
    </div>
</template>
<script>
    export default{
        name: 'list-item',
        data(){
            return {
                routeNumber : '',
                routeName : '',
                direction : '',
                timeUntil : []
            }
        },
        computed: {
            renderOrder: function(){
                return null
            }
        },
        filters: {
            formatDisplayTime: function(time){
                var Time = parseInt(time);
                return Time < 60 ? 
                    Time + ' min' :
                    Math.floor(Time / 60) == 1 ?
                        Math.floor(Time / 60) + ' hr' + (time % 60) + ' min':
                        Math.floor(Time / 60) + ' hrs' + (time % 60) + ' min'
            }
        },
        created(){
            this.routeNumber = '1';
            this.routeName = 'test';
            this.direction = 'north';
            this.timeUntil = ['100','15','20'];
        }
    }
</script>