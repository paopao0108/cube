<template>
  <div id="app">
    <Cube></Cube>
  </div>
</template>

<script>
import Cube from './components/Cube.vue';

export default {
  name: 'app',
  components: {
    Cube,
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  width: 100vw;
  height: 100vh;
}
</style>
