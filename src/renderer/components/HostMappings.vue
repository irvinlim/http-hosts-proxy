<template>
  <div>
    <header>
      <h1 class="title is-3">Host Mappings</h1>
    </header>

    <section class="main">
      <article class="message">
        <div class="message-header">
          <p>Instructions</p>
          <button class="delete" aria-label="delete"></button>
        </div>
        <div class="message-body">
          <p class="is-size-7">Enter the hostnames that you wish to resolve using DNS Switcher Proxy. The address can be either an IP address or domain name.</p>
          <p class="is-size-7">You may use * as a wildcard to resolve a range of hostnames, e.g. <code>*.mywebsite.local</code>. Absolute hostname mappings are matched first, followed by wildcard hostnames.</p>
          <p class="is-size-7">
            <em>You can view these instructions again anytime by clicking the <span class="icon"><i class="fa fa-question-circle"></i></span> icon.</em>
          </p>
        </div>
      </article>

      <div class="columns" v-for="(mapping, index) in mappings" :key="index">
        <div class="column">
          <div class="field">
            <div class="control">
              <input
                :class="['input is-small', { 'is-danger': errors.has(`hostname[${index}]`) }]"
                :name="'hostname[' + index + ']'"
                type="text"
                placeholder="Hostname (e.g. google.com)"
                v-model="mapping.hostname"
                v-validate="{ required: true, valid_hostname: true }"
                data-vv-as="hostname"
                >
            </div>
            <p class="help is-danger" v-if="errors.has(`hostname[${index}]`)">{{ errors.first(`hostname[${index}]`) }}</p>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <div class="control">
              <input
                :class="['input is-small', { 'is-danger': errors.has(`address[${index}]`) }]"
                :name="'address[' + index + ']'"
                type="text"
                placeholder="Address to resolve to (e.g. 8.8.8.8)"
                v-model="mapping.address"
                v-validate="{ required: true, valid_address: true }"
                data-vv-as="address"
                >
            </div>
            <p class="help is-danger" v-if="errors.has(`address[${index}]`)">{{ errors.first(`address[${index}]`) }}</p>
          </div>
        </div>
        <div class="column edit-actions">
          <div class="columns is-gapless">
            <div class="column">
              <button class="button is-small" @click="handleClickDelete(index)">
                <span class="icon">
                  <i class="fa fa-trash"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <button class="button is-small add-new" @click="handleClickAddNew()">
            <span class="icon">
              <i class="fa fa-plus-circle"></i>
            </span>
            <span>Add New</span>
          </button>
        </div>
      </div>
    </section>

    <footer>
      <button class="button is-primary" @click="handleClickSave()" v-if="!isSaving">Save</button>
      <button class="button" disabled v-else>Saving...</button>
    </footer>
  </div>
</template>

<script>
import { ipcGet, ipcPut } from '../helpers/ipc';

export default {
  data: () => ({
    // Local state.
    isSaving: false,

    // Form data.
    mappings: [],
  }),

  async mounted() {
    // Load mappings on mount.
    await this.loadMappings();
  },

  methods: {
    /**
     * Load mappings from memory, which was pre-loaded from storage.
     */
    async loadMappings() {
      // Reset mappings.
      this.mappings = [];

      // Fetch mappings via IPC.
      const mappings = await ipcGet('proxy.storage.getMappings');

      // Convert dictionary into an array of objects.
      for (let hostname in mappings) {
        this.mappings.push({ hostname, address: mappings[hostname] });
      }
    },

    /**
     * Handler for delete button click.
     */
    handleClickDelete(index) {
      this.mappings.splice(index, 1);
    },

    /**
     * Handler for add new button click.
     */
    handleClickAddNew() {
      this.mappings.push({
        hostname: '',
        address: '',
      });
    },

    /**
     * Handler for save button click.
     */
    async handleClickSave() {
      // Prevent saving if there are validation errors.
      if (this.errors.any()) {
        this.showToast('Please fix errors before saving.', 'times');
        return;
      }

      // Change the saving state and revert once done.
      this.isSaving = true;

      // Save changes to disk.
      await this.saveMappings();

      // Revert the saving state.
      this.isSaving = false;

      // Show the saved notification.
      this.showToast('Saved!', 'check');
    },

    /**
     * Saves mapping to storage.
     */
    async saveMappings() {
      // Convert back to a dictionary.
      const newMappings = {};

      // Iterate through all mapping objects.
      for (let mapping of this.mappings) {
        const { hostname, address } = mapping;

        // Skip any entries which have missing values.
        if (!hostname || !address) {
          continue;
        }

        newMappings[hostname] = address;
      }

      // Push via IPC.
      await ipcPut('proxy.storage.putMappings', newMappings);

      // Reload mappings from storage/memory.
      await this.loadMappings();
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
section.main {
  width: 100%;
  padding: 20px 0;
}

button.button.add-new {
  width: 100%;
}

.edit-actions {
  flex-grow: 0;
}
</style>

