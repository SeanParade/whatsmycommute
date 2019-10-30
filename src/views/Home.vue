<template>
  <div class="hello">
      <section>
        <list></list>
      </section>
  </div>
</template>

<script>
// @ is an alias to /src
import list from '@/components/list.vue';

export default {
  name: "home",
  components: {
    list
  }
};
</script>

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}