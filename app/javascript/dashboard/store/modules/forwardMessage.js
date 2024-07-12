const state = {
  selectedMessageIds: [],
  conversationId: null,
  isShowForwardModal: false,
};

export const mutations = {
  SET_SELECTED_MESSAGE_IDS($state, payload) {
    $state.selectedMessageIds = payload;
  },
  ADD_SELECTED_MESSAGE_ID($state, messageId) {
    if (!$state.selectedMessageIds.includes(messageId)) {
      $state.selectedMessageIds.push(messageId);
    }
  },
  REMOVE_SELECTED_MESSAGE_ID($state, messageId) {
    $state.selectedMessageIds = $state.selectedMessageIds.filter(
      id => id !== messageId
    );
  },
  CLEAR_MESSAGE_IDS($state) {
    $state.conversationId = null;
    $state.selectedMessageIds = [];
  },
  SET_CONVERSATION_ID($state, payload) {
    $state.conversationId = payload;
  },
  REMOVE_CONVERSATION_ID($state) {
    $state.conversationId = null;
  },
  SET_SHOW_FORWARD_MODAL($state, payload) {
    $state.isShowForwardModal = payload;
  },
};

export const actions = {
  setSelectedMessageIds({ commit }, payload) {
    commit('SET_SELECTED_MESSAGE_IDS', payload);
  },
  addSelectedMessageId({ commit }, messageId) {
    commit('ADD_SELECTED_MESSAGE_ID', messageId);
  },
  removeSelectedMessageId({ commit }, messageId) {
    commit('REMOVE_SELECTED_MESSAGE_ID', messageId);
  },
  clearImmediately({ commit }) {
    commit('CLEAR_MESSAGE_IDS', []);
    commit('SET_SHOW_FORWARD_MODAL', false);
  },
  setConversationId({ commit }, payload) {
    commit('SET_CONVERSATION_ID', payload);
  },
  RemoveConversationId({ commit }) {
    commit('REMOVE_CONVERSATION_ID');
  },
  // Show forward modal
  showForwardModal({ commit }) {
    commit('SET_SHOW_FORWARD_MODAL', true);
  },
  // Hide forward modal
  hideForwardModal({ commit }) {
    commit('SET_SHOW_FORWARD_MODAL', false);
  },
};

export const getters = {
  getSelectedMessageIds: $state => $state.selectedMessageIds,
  getConversationId: $state => $state.conversationId,
  isShowForwardModal: $state => $state.isShowForwardModal,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
