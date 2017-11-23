<template>
  <div class="container is-fluid">
    <header>
      <h1 class="title is-3">Settings</h1>
    </header>

    <section class="main">
      <div class="box">
        <div class="columns">
          <div class="column is-6 is-4-widescreen is-3-fullhd">
            <p class="title is-5">Proxy Server</p>

            <server-status-tag></server-status-tag>

            <div class="field is-horizontal is-small-field">
              <div class="field-label is-small is-normal">
                <label for="listeningAddress" class="label">Listening address:</label>
              </div>

              <div class="field-body">
                <div class="field">
                  <p class="control">
                    <input
                      class="input is-small"
                      type="text"
                      name="listeningAddress"
                      placeholder="localhost"
                      v-model="settings.listeningAddress"
                      >
                  </p>
                </div>
              </div>
            </div>

            <div class="field is-horizontal is-small-field">
              <div class="field-label is-small is-normal">
                <label for="listeningPort" class="label">Port number:</label>
              </div>

              <div class="field-body">
                <div class="field">
                  <p class="control">
                    <input
                      class="input is-small"
                      type="text"
                      name="listeningPort"
                      placeholder="5060"
                      v-model="settings.listeningPort"
                      >
                  </p>
                </div>
              </div>
            </div>

          </div>
          <div class="column is-3 is-offset-3 is-2-widescreen is-offset-6-widescreen is-2-fullhd is-offset-7-fullhd">
            <div class="vert-button-group">
              <button
                v-if="!isProxyRunning"
                :class="['button', 'is-primary', 'is-outlined', { 'is-loading': isStarting }]"
                :disabled="isSaving"
                @click="handleClickStart()"
                >
                Start
              </button>
              <button
                v-if="isProxyRunning"
                :class="['button', 'is-danger', 'is-outlined', { 'is-loading': isStopping }]"
                :disabled="isSaving"
                @click="handleClickStop()"
                >
                Stop
              </button>
              <button
                v-if="isProxyRunning"
                :class="['button', 'is-info', 'is-outlined', { 'is-loading': isRestarting }]"
                :disabled="isSaving"
                @click="handleClickRestart()"
                >
                Restart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ipcGet, ipcAction, ipcPut } from '../helpers/ipc';
import ServerStatusTag from './ServerStatusTag';
import { mapState } from 'vuex';

export default {
  components: {
    ServerStatusTag,
  },

  data: () => ({
    // Local state.
    isSaving: false,
    isStarting: false,
    isStopping: false,
    isRestarting: false,

    // Form data.
    settings: {},
  }),

  async mounted() {
    // Load mappings on mount.
    await this.loadSettings();
  },

  computed: mapState({
    isProxyRunning: state => state.ProxyServer.isRunning,
  }),

  methods: {
    async loadSettings() {
      this.settings = await ipcGet('settings.storage.getSettings');
    },

    async saveListeningAddress() {
      // Construct data to save.
      const data = {
        key: 'listeningAddress',
        value: this.settings.listeningAddress,
      };

      await ipcPut('settings.storage.saveSetting', data);
    },

    async saveListeningPort() {
      // Only allow integer port numbers.
      this.settings.listeningPort = parseInt(this.settings.listeningPort) || '';

      // Construct data to save.
      const data = {
        key: 'listeningPort',
        value: this.settings.listeningPort,
      };

      await ipcPut('settings.storage.saveSetting', data);
    },

    async handleClickStart() {
      // Update saving state.
      this.isSaving = true;
      this.isStarting = true;

      // Save the address and port.
      await this.saveListeningAddress();
      await this.saveListeningPort();

      // Send the event to the main process.
      try {
        await ipcAction('proxy.server.start');
        this.showToast('Server started!', 'check');
      } catch (err) {
        const address = this.settings.listeningAddress || 'localhost';
        const port = this.settings.listeningPort;
        const errorMessage = `Could not start server at ${address}:${port}.`;
        this.showToast(errorMessage, 'times');
      }

      // Restore saving state.
      this.isSaving = false;
      this.isStarting = false;
    },

    async handleClickStop() {
      // Update saving state.
      this.isSaving = true;
      this.isStopping = true;

      // Send the event to the main process.
      await ipcAction('proxy.server.stop');

      // Restore saving state.
      this.isSaving = false;
      this.isStopping = false;

      // Show toast.
      this.showToast('Server stopped!', 'check');
    },

    async handleClickRestart() {
      // Update saving state.
      this.isSaving = true;
      this.isRestarting = true;

      // Save the address and port.
      await this.saveListeningAddress();
      await this.saveListeningPort();

      // Send the event to the main process.
      try {
        await ipcAction('proxy.server.restart');
        this.showToast('Server restarted!', 'check');
      } catch (err) {
        const address = this.settings.listeningAddress || 'localhost';
        const port = this.settings.listeningPort;
        const errorMessage = `Could not start server at ${address}:${port}.`;
        this.showToast(errorMessage, 'times');
      }

      // Restore saving state.
      this.isSaving = false;
      this.isRestarting = false;
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

