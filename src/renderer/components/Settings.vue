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
              <server-status-tag></server-status-tag>
            </p>

            <div class="columns is-gapless">
              <div class="column is-one-quarter">
                <p class="input-label is-size-7">Listening Port</p>
              </div>
              <div class="column is-one-quarter">
                <input
                  class="input is-small"
                  type="text"
                  name="listeningPort"
                  placeholder="5060"
                  v-model="settings.listeningPort"
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
import { ipcGet, ipcAction, ipcPut, ipcReceive } from '../helpers/ipc';
import ServerStatusTag from './ServerStatusTag';

export default {
  components: {
    ServerStatusTag,
  },
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
    async saveListeningPort() {
      // Only allow integer port numbers.
      this.settings.listeningPort = parseInt(this.settings.listeningPort) || '';

      // Construct data to save.
      const data = {
        key: 'listeningPort',
        value: this.settings.listeningPort,
      };

      await ipcPut(this, 'settings.storage.saveSetting', data);
    },

    async handleClickStart() {
      // Update saving state.
      this.isSaving = true;

      // Save the port number first.
      await this.saveListeningPort();

      // Send the event to the main process.
      try {
        await ipcAction(this, 'proxy.server.start');
        this.showToast('Server started!', 'check');
      } catch (err) {
        const port = this.settings.listeningPort;
        const errorMessage = `Could not start server at port ${port}.`;
        this.showToast(errorMessage, 'times');
      }

      // Restore saving state.
      this.isSaving = false;
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

      // Save the port number first.
      await this.saveListeningPort();

      // Send the event to the main process.
      try {
        await ipcAction(this, 'proxy.server.restart');
        this.showToast('Server restarted!', 'check');
      } catch (err) {
        const port = this.settings.listeningPort;
        const errorMessage = `Could not start server at port ${port}.`;
        this.showToast(errorMessage, 'times');
      }

      // Restore saving state.
      this.isSaving = false;
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

