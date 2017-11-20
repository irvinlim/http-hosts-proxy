<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
    name: 'electron-vue',
};
</script>

<style>
@import '~bulma';
html,
body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

#app {
    display: flex;
    height: 100%;
    flex-direction: row;
    align-items: stretch;
}
</style>
