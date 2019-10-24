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
                    {{time | formatDisplayTime}}
                </span>
            </template>
        </div>    
    </div>
</template>
<script>
    export default{
        name: 'list-item',
        data(){
            return{
                routeNumber : '',
                routeName : '',
                direction : '',
                timeUntil : []
            }
        },
        computed: {
            renderOrder: function(){

            }
        },
        filters: {
            formatDisplayTime: function(time){
                return 
                    parseInt(time) < 60 ? 
                        time + ' min' : 
                        Math.floor(time / 60) == 1 ? 
                            Math.floor(time / 60) + ' hr' + (time % 60) + ' min' :
                            Math.floor(time / 60) + ' hrs' + (time % 60) + ' min'
            }
        },
        created(){
            this.routeNumber = '1';
            this.routeName = 'test';
            this.direction = 'north';
            this.timeUntil = ['10','15','20'];
        }
    }
</script>