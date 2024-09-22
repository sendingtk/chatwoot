import * as types from '../mutation-types';
import Wavoip from 'wavoip-api';
import { useAlert } from 'dashboard/composables';
const findRecordById = ($state, id) =>
  $state.records.find(record => record.id === Number(id)) || {};
const defaultState = {
  records: [],
  uiFlags: {
    isOpen: true,
    isFetching: false,
    isFetchingItem: false,
    isUpdating: false,
    isCheckoutInProcess: false,
  },
  call: {
    id: null,
    duration: 0,
    tag: null,
    phone: null,
    picture_profile: null,
    status: null,
    direction: null,
    whatsapp_instance: null,
    active_start_date: null,
    chat_id: null,
    inbox_name: null,
  },
  wavoip: {},
};
export const getters = {
  getAccount: $state => id => {
    return findRecordById($state, id);
  },
  getUIFlags($state) {
    return $state.uiFlags;
  },
  getCallInfo($state) {
    return $state.call;
  },
  getWavoip($state) {
    return $state.wavoip;
  },
};
export const actions = {
  startWavoip: async ({ commit, state }, { inboxName, token }) => {
    if (state.wavoip[token] && token) {
      return;
    }
    const WAV = new Wavoip();
    let whatsapp_instance;
    try {
      whatsapp_instance = WAV.connect(token);
    } catch (error) {
      console.error('Error connecting to Wavoip:', error);
      useAlert(i18n.t('WEBPHONE.CONNECTION_FAILED'));
      return;
    }
    commit(types.default.ADD_WAVOIP, {
      token: token,
      whatsapp_instance: whatsapp_instance,
      inboxName: inboxName,
    });
    whatsapp_instance.socket.on('connect', () => {});
    whatsapp_instance.socket.on('disconnect', () => {});
  },
  outcomingCall: async ({ commit, state, dispatch }, callInfo) => {
    let { phone, contact_name, chat_id } = callInfo;
    let instances = callInfo.instances ?? Object.keys(state.wavoip);
    if (!instances || instances.length === 0) {
      throw new Error(i18n.t('WEBPHONE.NO_AVAILABLE_INSTANCES'));
    }
    let token = callInfo.token ?? instances[0];
    let wavoip = state.wavoip[token].whatsapp_instance;
    let inbox_name = state.wavoip[token].inbox_name;
    let offerResponse;
    if (wavoip) {
      offerResponse = await wavoip
        .callStart({
          whatsappid: phone,
        })
        .then(response => {
          let output;
          if (response.type === 'success') {
            let profile_picture = response?.result?.profile_picture;
            output = {
              profile_picture: profile_picture,
            };
          } else {
            output = {
              error: true,
              message: response?.result,
            };
          }
          return output;
        })
        .catch(response => {
          return {
            error: true,
            message: response?.result,
          };
        });
    } else {
      offerResponse = {
        error: true,
      };
    }
    if (offerResponse.error) {
      let remainingInstances = instances.filter(instance => instance !== token);
      if (offerResponse.message === i18n.t('WEBPHONE.NUMBER_NOT_FOUND')) {
        throw new Error(offerResponse.message);
      } else if (offerResponse.message === 'Limite de ligações atingido') {
        useAlert(i18n.t('WEBPHONE.DAILY_LIMIT_REACHED'));
      }
      if (remainingInstances.length > 0) {
        dispatch('outcomingCall', {
          ...callInfo,
          instances: remainingInstances,
          token: null,
        });
      } else {
        throw new Error(i18n.t('WEBPHONE.LINE_BUSY_TRY_AGAIN'));
      }
      return;
    }
    commit(types.default.SET_WEBPHONE_CALL, {
      id: token,
      duration: 0,
      tag: contact_name,
      phone: phone,
      picture_profile: offerResponse?.profile_picture,
      status: 'outcoming_calling',
      direction: 'outcoming',
      whatsapp_instance: token,
      inbox_name: inbox_name,
      chat_id: chat_id,
    });
    commit(types.default.SET_WEBPHONE_UI_FLAG, {
      isOpen: true,
    });
  },
  incomingCall: async ({ commit, state, rootGetters, dispatch }, callInfo) => {
    try {
      const userStatus = rootGetters.getCurrentUserAvailability;
      if (state.call.id || userStatus !== 'online') {
        dispatch('rejectCall', callInfo.token);
        return;
      }
      let { phone, contact_name, profile_picture, token } = callInfo;
      let inbox_name = state.wavoip[token].inbox_name;
      commit(types.default.SET_WEBPHONE_CALL, {
        id: token,
        duration: 0,
        tag: contact_name,
        phone: phone,
        picture_profile: profile_picture,
        status: 'offer',
        direction: 'incoming',
        whatsapp_instance: token,
        inbox_name: inbox_name,
        chat_id: null,
      });
      commit(types.default.SET_WEBPHONE_UI_FLAG, {
        isOpen: true,
      });
    } catch (error) {
      throw new Error(error);
    }
  },
  updateCallStatus: ({ commit }, status) => {
    commit(types.default.SET_WEBPHONE_CALL, {
      status: status,
    });
    if (status === 'accept') {
      commit(types.default.SET_WEBPHONE_CALL, {
        active_start_date: Date.now()
      });
    }
  },
  acceptCall: async ({ state, dispatch }) => {
    try {
      const wavoip_token = state.call.whatsapp_instance;
      const wavoip = state.wavoip[wavoip_token].whatsapp_instance;
      await wavoip.acceptCall();
      dispatch('updateCallStatus', 'accept');
    } catch (error) {
      // Ignore error
    }
  },
  rejectCall: async ({ state, dispatch }, token) => {
    try {
      const wavoip_token = token ?? state.call.whatsapp_instance;
      const wavoip = state.wavoip[wavoip_token].whatsapp_instance;
      wavoip.rejectCall();
      dispatch('resetCall');
    } catch (error) {
      // Ignore error
    }
  },
  endCall: async ({ state }) => {
    try {
      const wavoip_token = state.call.whatsapp_instance;
      const wavoip = state.wavoip[wavoip_token].whatsapp_instance;
      wavoip.endCall();
    } catch (error) {
      // Ignore error
    }
  },
  resetCall: async ({ commit }) => {
    commit(types.default.SET_WEBPHONE_CALL, {
      id: null,
      duration: 0,
      tag: null,
      phone: null,
      picture_profile: null,
      status: null,
      direction: null,
      whatsapp_instance: null,
      active_start_date: null,
      inbox_name: null,
      chat_id: null,
    });
  },
  updateWebphoneVisible: ({ commit }, { isOpen }) => {
    commit(types.default.SET_WEBPHONE_UI_FLAG, {
      isOpen: isOpen,
    });
  },
};
export const mutations = {
  [types.default.SET_WEBPHONE_UI_FLAG]($state, data) {
    $state.uiFlags = {
      ...$state.uiFlags,
      ...data,
    };
  },
  [types.default.ADD_WAVOIP]($state, data) {
    $state.wavoip = {
      ...$state.wavoip,
      [data.token]: {
        whatsapp_instance: data.whatsapp_instance,
        inbox_name: data.inboxName,
      },
    };
  },
  [types.default.SET_WEBPHONE_CALL]($state, data) {
    $state.call = {
      ...$state.call,
      ...data,
    };
  },
};
export default {
  namespaced: true,
  state: defaultState,
  getters,
  actions,
  mutations,
};
