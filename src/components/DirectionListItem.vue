<template>
    <tr id="directionDataRows">
        <td>{{Departure}}</td>
        <td>{{Arrival}}</td>
        <td>{{Duration}}</td>
        <td>
            <span v-for="(step, index) in Steps" :key="index">
                {{Steps[index].instructions}}
            </span>
        </td>
    </tr>
</template>
<script>
    export default{
        name: 'direction-list-item',
        props:{
            direction: Object,
        },
        data(){
            return {
                Arrival : this.direction.arrival.text,
                Departure : this.direction.departure.text,
                Duration : this.direction.duration.text,
                Steps : this.direction.steps
            }
        }
    }
</script>