<template>
    <tr id="directionDataRows">
        <td>{{Departure}}</td>
        <td>{{Arrival}}</td>
        <td>{{Duration}}</td>
        <td>
            <b-row id="steps">
            <span v-for="(step, index) in Steps" :key="index">
                {{index + 1}} - {{Steps[index]|formatSteps}}
            </span>
            </b-row>
        </td>
    </tr>
</template>
<script>
    import { mapState } from 'vuex'
    export default{
        name: 'direction-list-item',
        computed: {
            ...mapState([
                'Arrival',
                'Departure',
                'Duration',
                'Steps'
            ])
        },
        filters: {
            // If the step involves transit show line name, departure stop, and arrival stop
            formatSteps: function(steps){
                //console.log(steps)
                return steps.travel_mode === "TRANSIT" ?
                    'Take ' + steps.transit.line.name + ' from ' + 
                    steps.transit.departure_stop.name + ' to ' +
                    steps.transit.arrival_stop.name :
                    steps.instructions
            }
        }
    }
</script>
<style>
   #steps span{
       display: inline-block;
       text-align: left;
    }
</style>