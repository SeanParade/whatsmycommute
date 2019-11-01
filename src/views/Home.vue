<template>
  <div>
    <b-container>
      <b-row>
          <toggle-switch
          :options="myOptions"
          @change="updateMap($event.value)" 
          @selected="selectedMethod()" 
          v-model="selectedMapOption" 
          :value="selectedMapOption" 
          :group="switchGroup"
          /> 
      </b-row>
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
  }
};
</script>
<style>

</style>