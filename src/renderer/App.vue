<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import 'font-awesome/scss/font-awesome.scss';
import { ipcAction } from './helpers/ipc';
import { mapActions } from 'vuex';

export default {
  async mounted() {
    // Starts the proxy server.
    await ipcAction('proxy.server.start');

    // Hydrate the Vuex store from IPC GET.
    this.updateProxyServerStatus();
    this.updateProxyServerAddress();

    // Start event listeners to dispatch Vuex actions on update.
    this.listenProxyServerStatus();
    this.listenProxyServerAddress();
  },
  methods: {
    // Map actions from Vuex.
    ...mapActions([
      'updateProxyServerStatus',
      'updateProxyServerAddress',
      'listenProxyServerStatus',
      'listenProxyServerAddress',
    ]),
  },
};
</script>

<style lang="scss">
@import '~bulma/sass/utilities/_all';
$menu-item-color: $grey;
$menu-item-hover-background-color: transparent;
$menu-item-hover-color: $grey-light;
$menu-item-active-background-color: transparent;

@import '~bulma/bulma.sass';

html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
