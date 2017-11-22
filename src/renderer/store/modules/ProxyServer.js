import { ipcGet, ipcReceive } from '../../helpers/ipc';

const state = {
  isRunning: false,
  address: '',
};

const mutations = {
  SET_PROXY_SERVER_STATUS(state, status) {
    state.isRunning = status;
  },
  SET_PROXY_SERVER_ADDRESS(state, address) {
    if (!address) {
      state.address = '';
    } else {
      const { port } = address;
      state.address = `localhost:${port}`;
    }
  },
};

const actions = {
  async updateProxyServerStatus({ commit }) {
    const status = await ipcGet('proxy.server.isListening');
    commit('SET_PROXY_SERVER_STATUS', status);
  },
  async updateProxyServerAddress({ commit }) {
    const address = await ipcGet('proxy.server.getAddress');
    commit('SET_PROXY_SERVER_ADDRESS', address);
  },
  listenProxyServerStatus({ commit }) {
    ipcReceive('proxy.server.isListening', async data => {
      commit('SET_PROXY_SERVER_STATUS', data);
    });
  },
  listenProxyServerAddress({ commit }) {
    ipcReceive('proxy.server.getAddress', async data => {
      commit('SET_PROXY_SERVER_ADDRESS', data);
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
