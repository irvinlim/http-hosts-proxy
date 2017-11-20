<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import 'font-awesome/scss/font-awesome.scss';

export default {
  name: 'dns-switcher-proxy',
};
</script>

<style lang="scss">
@import '~bulma/sass/utilities/_all';
$menu-item-color: $grey-lighter;
$menu-item-hover-background-color: $white-ter;

@import '~bulma/bulma.sass';

html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
