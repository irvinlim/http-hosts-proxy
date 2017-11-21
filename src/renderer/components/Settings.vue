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

            <p class="subtitle">
              <span :class="['tag', { 'is-primary': isProxyRunning, 'is-danger': !isProxyRunning }]">{{ isProxyRunning ? 'Running' : 'Stopped' }}</span>
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
              <button class="button is-primary is-outlined" v-if="!isProxyRunning" @click="handleClickStart()" :disabled="isSaving">Start</button>
              <button class="button is-danger is-outlined" v-if="isProxyRunning" @click="handleClickStop()" ::disabled="isSaving">Stop</button>
              <button class="button is-info is-outlined" v-if="isProxyRunning" @click="handleClickRestart()" ::disabled="isSaving">Restart</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ipcGet, ipcAction, ipcReceive } from '../helpers/ipc';

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
    await this.loadProxyStatus();
  },
  methods: {
    async loadSettings() {
      this.settings = await ipcGet(this, 'settings.storage.getSettings');
    },
    async loadProxyStatus() {
      this.isProxyRunning = await ipcGet(this, 'proxy.server.isListening');
      ipcReceive(this, 'proxy.server.isListening', data => {
        this.isProxyRunning = data;
      });
    },

    async handleClickStart() {
      // Update saving state.
      this.isSaving = true;

      // Send the event to the main process.
      await ipcAction(this, 'proxy.server.start');

      // Restore saving state.
      this.isSaving = false;

      // Show toast.
      this.showToast('Server started!', 'check');
    },

    async handleClickStop() {
      // Update saving state.
      this.isSaving = true;

      // Send the event to the main process.
      await ipcAction(this, 'proxy.server.stop');

      // Restore saving state.
      this.isSaving = false;

      // Show toast.
      this.showToast('Server stopped!', 'check');
    },

    async handleClickRestart() {
      // Update saving state.
      this.isSaving = true;

      // Send the event to the main process.
      await ipcAction(this, 'proxy.server.restart');

      // Restore saving state.
      this.isSaving = false;

      // Show toast.
      this.showToast('Server restarted!', 'check');
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

