<template>
  <span :class="['tag', { 'is-primary': isProxyRunning, 'is-danger': !isProxyRunning }]">
    {{ isProxyRunning ? `Running on ${proxyAddressString}` : 'Stopped' }}
  </span>
</template>

<script>
import { ipcGet, ipcReceive } from '../helpers/ipc';

export default {
  data: () => ({
    isProxyRunning: false,
    proxyAddressString: '',
  }),
  async mounted() {
    await this.loadProxyStatus();
    await this.loadProxyAddress();
  },
  methods: {
    async loadProxyAddress() {
      this.proxyAddress = await ipcGet(this, 'proxy.server.getAddress');
      ipcReceive(this, 'proxy.server.getAddress', data => {
        const { address, family, port } = data;

        if (family.toLowerCase() === 'ipv6') {
          this.proxyAddressString = `[${address}]:${port}`;
        } else {
          this.proxyAddressString = `${address}:${port}`;
        }
      });
    },
    async loadProxyStatus() {
      this.isProxyRunning = await ipcGet(this, 'proxy.server.isListening');
      ipcReceive(this, 'proxy.server.isListening', data => {
        this.isProxyRunning = data;
      });
    },
  },
};
</script>
