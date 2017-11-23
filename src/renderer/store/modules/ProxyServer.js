import { ipcGet, ipcReceive } from '../../helpers/ipc';

const initialState = {
  isRunning: false,
  socketAddress: '',
};

const mutations = {
  SET_PROXY_SERVER_STATUS(state, status) {
    state.isRunning = status;
  },
  SET_PROXY_SERVER_SOCKET_ADDRESS(state, serverAddress) {
    if (!serverAddress) {
      state.socketAddress = '';
    } else {
      let { port, address, family } = serverAddress;
      address = family.toLowerCase() === 'ipv6' ? `[${address}]` : address;
      state.socketAddress = `${address}:${port}`;
    }
  },
};

const actions = {
  async updateProxyServerStatus({ commit }) {
    const status = await ipcGet('proxy.server.isListening');
    commit('SET_PROXY_SERVER_STATUS', status);
  },
  async updateProxyServerAddress({ commit }) {
    const address = await ipcGet('proxy.server.getSocketAddress');
    commit('SET_PROXY_SERVER_SOCKET_ADDRESS', address);
  },
  listenProxyServerStatus({ commit }) {
    ipcReceive('proxy.server.isListening', async data => {
      commit('SET_PROXY_SERVER_STATUS', data);
    });
  },
  listenProxyServerAddress({ commit }) {
    ipcReceive('proxy.server.getSocketAddress', async data => {
      commit('SET_PROXY_SERVER_SOCKET_ADDRESS', data);
    });
  },
};

export default {
  state: initialState,
  mutations,
  actions,
};
