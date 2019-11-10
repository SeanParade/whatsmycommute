<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col sm="4"><maps></maps></b-col>
        <b-col sm="6"><list></list></b-col>
        <b-col sm="2"><weather></weather></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import list from '@/components/list.vue';
import weather from '@/components/weather.vue';
import maps from '@/components/maps.vue';

export default {
    name: "home",
    components: {
        list,
        weather,
        maps
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