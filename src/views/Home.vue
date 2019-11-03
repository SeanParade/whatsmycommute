<template>
  <div>
    <b-container fluid>
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
  }
</script>
<style>
  .container-fluid{
    width: 100%
  }
  .row {
    width: 100%;
  }
</style>