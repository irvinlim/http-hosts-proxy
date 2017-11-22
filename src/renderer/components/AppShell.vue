<template>
  <div id="app-shell">
    <aside id="menu">
      <div class="menu-body">
        <p class="menu-label">
          {{ appName }}
        </p>
        <ul class="menu-list is-dark">
          <li v-for="item in menuItems" :key="item.link">
            <router-link :to="item.link" active-class="is-active">{{ item.label }}</router-link>
          </li>
        </ul>
      </div>
      <div class="menu-footer">
        <server-status-tag class="footer-text" style="margin-bottom: 30px"></server-status-tag>
        <p class="footer-text" v-if="isProduction">
          Version {{ versionNumber }} by <a href="https://irvinlim.com/">Irvin Lim</a>
        </p>
        <p class="footer-text" v-else>
          Development Mode
        </p>
        <p class="footer-text">
          Report any issues on <a href="https://github.com/irvinlim/http-hosts-proxy">GitHub</a>
        </p>
      </div>
    </aside>
    <section id="main">
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import { remote } from 'electron';
import ServerStatusTag from './ServerStatusTag';

export default {
  components: {
    ServerStatusTag,
  },

  data: () => ({
    menuItems: [
      { link: 'host-mappings', label: 'Host Mappings' },
      { link: 'settings', label: 'Settings' },
    ],
    appName: remote.app.getName(),
    versionNumber: remote.app.getVersion(),
    isProduction: remote.getGlobal('process').env.NODE_ENV === 'production',
  }),
};
</script>

<style lang="scss">
@import '~bulma/sass/utilities/_all';

#app {
  display: flex;
  height: 100%;
  align-items: stretch;
}

#app-shell {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

aside#menu {
  padding: 20px;
  width: 240px;
  background-color: $dark;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  .footer-text {
    &,
    label {
      font-size: small;
      color: $grey;
    }

    a:hover {
      color: $grey-light;
    }
  }
}

section#main {
  padding: 30px 40px;
  flex-grow: 1;
  overflow-y: auto;
}
</style>
