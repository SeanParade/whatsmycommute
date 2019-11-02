<template>
  <div>
    <b-container>
      <b-row>
        <b-col sm="2"></b-col>
        <b-col sm="8"><list></list></b-col>
        <b-col sm="2"><weather></weather></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import list from '@/components/list.vue';
import weather from '@/components/weather.vue';

export default {
    name: "home",
    components: {
        list,
        weather
    },
    data(){
      return {
        myOptions: {
          layout: {
            color: 'black',
            backgroundColor: 'lightgray',
            selectedColor: 'white',
            selectedBackgroundColor: 'green',
            borderColor: 'black',
            fontFamily: 'Arial',
            fontWeight: 'normal',
            fontWeightSelected: 'bold',
            squareCorners: false,
            noBorder: false
          },
          size: {
            fontSize: 14,
            height: 34,
            padding: 7,
            width: 100
          },
          items: {
            delay: .4,
            preSelected: 'unknown',
            disabled: false,
            labels: [
              {name: 'C', color: 'white', backgroundColor: 'red'}, 
              {name: 'F', color: 'white', backgroundColor: 'green'}
            ]
          }
        }
      }
    }
  }
</script>

<style>
  .toggleButton{

  }
</style>