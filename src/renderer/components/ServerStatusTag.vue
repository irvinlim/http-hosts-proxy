<template>
  <div class="server-status-tag">

    <div class="field is-horizontal is-small-field">
      <div class="field-label is-small is-normal">
        <label for="listeningPort" class="label">Server status:</label>
      </div>

      <div class="field-body">
        <div class="field">
          <p class="control">
            <span :class="['tag', { 'is-primary': isRunning, 'is-danger': !isRunning }]">
              {{ isRunning ? `Running` : 'Stopped' }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal is-small-field" v-if="isRunning">
      <div class="field-label is-small is-normal">
        <label for="listeningPort" class="label">Listening on:</label>
      </div>

      <div class="field-body">
        <div class="field">
          <p class="control">
            <span class="tag">{{ socketAddress }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: mapState({
    isRunning: state => state.ProxyServer.isRunning,
    socketAddress: state => state.ProxyServer.socketAddress,
  }),
};
</script>

<style lang="scss">
.is-small-field {
  margin-bottom: 0.75rem;

  .field-label {
    margin-right: 0;

    label {
      font-weight: normal;
      text-align: left;
    }
  }

  .field-body {
    flex-grow: 1;
  }
}
</style>

