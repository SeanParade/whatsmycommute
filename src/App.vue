<template>
  <div id="app" class="py-4">
    <div class="bg">
      <span class="Title">WHAT'S MY COMMUTE</span>
    </div>
    <router-view />
  </div>
</template>


<style lang="scss">

  #app, .bg {
    position: absolute;
  }
  #app {
    width: 100%;
    height: 100%;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    z-index: 1;
  }
  .bg{
    width: 100%;
  }
  body {
    /* Full height */
    background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('./assets/Toronto_Ontario.jpg');
    background-size: cover;
    z-index: 0;
  }
  .Title{
    color: white;
    width: 100%;
    font-size: 56px;
    font-family: Aileron;
    text-decoration: underline;
    text-underline-position: under;
  }
</style>
