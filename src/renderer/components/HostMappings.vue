<template>
  <div>
    <header>
      <h1>Host Mappings</h1>
    </header>

    <section class="main">
      <div class="columns" v-for="mapping in mappings" :key="mapping.hostname">
        <div class="column">
          <div class="field">
            <div class="control">
              <input class="input is-small" type="text" v-model="mapping.hostname" placeholder="Hostname (e.g. google.com)">
            </div>
          </div>
        </div>
        <div class="column"><div class="field">
            <div class="control">
              <input class="input is-small" type="text" v-model="mapping.address" placeholder="Address to resolve to (e.g. 8.8.8.8)">
            </div>
          </div>
        </div>
        <div class="column edit-actions">
          <div class="columns is-gapless">
            <div class="column">
              <button class="button is-small">
                <span class="icon">
                  <i class="fa fa-copy"></i>
                </span>
              </button>
            </div>
            <div class="column">
              <button class="button is-small">
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
          <button class="button is-small add-new">
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
import proxy from '../../main/lib/proxy';

export default {
  data: () => ({
    // Local state.
    isSaving: false,
    isSaved: false,

    // Form data.
    mappings: [],
  }),
  mounted() {
    // Fetch dictionary of hostname mappings
    const mappings = proxy.storage.getMappings();

    // Convert to array of objects.
    for (let hostname in mappings) {
      this.mappings.push({
        hostname,
        address: mappings[hostname],
      });
    }
  },
  methods: {
    /**
     * Handler for save button click.
     */
    async handleClickSave() {
      // Change the saving state and revert once done.
      this.isSaving = true;

      // Synchronously save to disk.
      await this.saveMappings();

      // Revert the saving state.
      this.isSaving = false;

      // Show the saved icon.
      this.showSavedIcon();
    },

    showSavedIcon() {
      this.isSaved = true;
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
        newMappings[hostname] = address;
      }

      // Save the mapping to storage.
      await proxy.storage.replaceMappings(newMappings);
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

