<template>
  <div id="app">
    <aside id="menu">
      <div class="menu-body">
        <p class="menu-label">
          DNS Switcher Proxy
        </p>
        <ul class="menu-list is-dark">
          <li v-for="item in menuItems" :key="item.link">
            <router-link :to="item.link">{{ item.label }}</router-link>
          </li>
        </ul>
      </div>
      <div class="menu-footer">
        <p class="footer-text" v-if="isProduction">
          Version {{ versionNumber }} by <a href="https://irvinlim.com/">Irvin Lim</a>
        </p>
        <p class="footer-text" v-else>
          Development Mode
        </p>
        <p class="footer-text">
          Report any issues on <a href="https://github.com/irvinlim/dns-switcher-proxy">GitHub</a>
        </p>
      </div>
    </aside>
    <section id="main">
      <slot></slot>
    </section>
  </div>
</template>

<script>
import { remote } from 'electron';

export default {
  data: () => ({
    menuItems: [
      { link: 'host-mappings', label: 'Host Mappings' },
      { link: 'settings', label: 'Settings' },
    ],
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
  flex-direction: row;
  align-items: stretch;
}

aside#menu {
  padding: 20px;
  width: 240px;
  background-color: $dark;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .footer-text {
    font-size: small;
    color: $grey;
    a:hover {
      color: $grey-light;
    }
  }
}

section#main {
  padding: 20px;
}
</style>
