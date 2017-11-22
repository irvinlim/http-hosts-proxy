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
                <label for="listeningPort" class="label">Change port:</label>
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

      // Save the port number first.
      await this.saveListeningPort();

      // Send the event to the main process.
      try {
        await ipcAction('proxy.server.start');
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
      await ipcAction('proxy.server.stop');

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
        await ipcAction('proxy.server.restart');
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

