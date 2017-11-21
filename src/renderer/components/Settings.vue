<template>
  <div>
    <header>
      <h1 class="title is-3">Settings</h1>
    </header>

    <section class="main">
      <div class="box">
        <div class="columns">
          <div class="column">
            <p class="title is-5">Proxy Server</p>

            <p class="subtitle is-6">
              The proxy server is
              <strong :class="{ 'is-success': isProxyRunning, 'is-danger': !isProxyRunning }">{{ !isProxyRunning && 'not' || '' }} running</strong>.
            </p>

            <div class="columns is-gapless">
              <div class="column is-one-quarter">
                <p class="input-label is-size-7">Listening Port</p>
              </div>
              <div class="column is-one-quarter">
                <input
                  class="input is-small"
                  type="text"
                  name="proxyPortNumber"
                  placeholder="5060"
                  v-model="settings.proxyPortNumber"
                  >
              </div>
            </div>
          </div>
          <div class="column is-one-fifth">
            <div class="vert-button-group">
              <button class="button is-primary" v-if="!isProxyRunning">Start</button>
              <button class="button is-danger" v-if="isProxyRunning">Stop</button>
              <button class="button" v-if="isProxyRunning">Restart</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data: () => ({
    // Local state.
    isSaving: false,

    // Form data.
    settings: {},
    isProxyRunning: false,
  }),
  async mounted() {
    // Load mappings on mount.
    await this.loadSettings();
  },
  methods: {
    /**
     * Load settings from main process via IPC.
     */
    async loadSettings() {
      const ipc = 'settings.storage.getSettings';

      // Reset mappings.
      this.mappings = [];

      // Request mappings via IPC.
      this.$electron.ipcRenderer.send(ipc);

      // Fetch mappings via IPC.
      this.settings = await new Promise(resolve => {
        this.$electron.ipcRenderer.once(`${ipc}.data`, (event, data) =>
          resolve(data)
        );
      });
    },

    /**
     * Displays a saved toast notification.
     */
    showToast(message, icon) {
      this.$toasted.show(message, {
        icon,
        iconPack: 'fontawesome',
        position: 'bottom-right',
        duration: 3000,
      });
    },
  },
};
</script>

<style lang="scss">
p.input-label {
  line-height: 1.7rem;
}

.vert-button-group {
  display: flex;
  flex-direction: column;

  button:not(:last-child) {
    margin-bottom: 0.5rem;
  }
}
</style>

