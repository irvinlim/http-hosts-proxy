<template>
  <div class="container">
    <header>
      <h1>Host Mappings</h1>
    </header>

    <section class="section main">
      <div class="columns" v-for="mapping in mappings" :key="mapping.hostname">
        <div class="column">
          <input type="text" v-model="mapping.hostname">
        </div>
        <div class="column">
          <input type="text" v-model="mapping.address">
        </div>
        <div class="column is-one-fifth">
          <button class="button">
            <i class="fa fa-delete"></i>
          </button>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <button class="button add-new">
            <span class="icon">
              <i class="fa fa-plus-circle"></i>
            </span>
            <span>Add New</span>
          </button>
        </div>
      </div>
    </section>

    <footer>
      <button class="button is-primary">Save</button>
    </footer>
  </div>
</template>

<script>
import proxy from '../../main/lib/proxy';

export default {
  data: () => ({
    mappings: proxy.storage.getMappings(),
  }),
};
</script>

<style lang="scss">
section.main {
  width: 100%;
}

button.button.add-new {
  width: 100%;
}
</style>

