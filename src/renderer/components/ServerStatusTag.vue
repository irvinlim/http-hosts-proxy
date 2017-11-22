<template>
  <div class="server-status-tag">
    <p>
      Server status:
      <span :class="['tag', { 'is-primary': isRunning, 'is-danger': !isRunning }]">
        {{ isRunning ? `Running` : 'Stopped' }}
      </span>
    </p>
    <p v-if="isRunning">
      Listening on:
      <span class="tag">
        {{ address }}
      </span>
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: mapState({
    isRunning: state => state.ProxyServer.isRunning,
    address: state => state.ProxyServer.address,
  }),
};
</script>

<style lang="scss">
.server-status-tag {
  p {
    margin-bottom: 5px;
  }
}
</style>

