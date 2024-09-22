<script>
import SoundCalling from 'dashboard/assets/audio/calling.mp3';
import SoundRinging from 'dashboard/assets/audio/ring.mp3';

import Thumbnail from '../../widgets/Thumbnail.vue';
import Draggable from './Draggable.vue';

import Microphone from './icons/Microphone.vue';
import MicrophoneSlash from './icons/MicrophoneSlash.vue';
import VideoIcon from './icons/Video.vue';
// import VideoSlash from './icons/VideoSlash.vue';
import PhoneSlash from './icons/PhoneSlash.vue';
import NumpadVue from './icons/Numpad.vue';
import PhoneTransfer from './icons/PhoneTransfer.vue';
import Phone from './icons/Phone.vue';
import { mapGetters } from 'vuex';

// import WavoipInstance from 'wavoip-api';

import parsePhoneNumber from 'libphonenumber-js';
// import { useSound } from '@vueuse/sound';
// import { useChatStore } from 'src/stores/chatStore';

// import useUtils from "src/composables/UseUtils";
// import { useVModel } from 'src/composables/useVModel';

// const CScreensState = {
//   AVAILABLE_SCREEN: 'Pronto', // 0,
//   CALL_SCREEN: 'Chamando', // 1,
//   CONNECTING_DEVICE: 'Conectando', // 2,
//   QRCODE_SCREEN: 'QR Code', // 3,
//   INCOMING_CALL_SCREEN: 'Recebendo', // 4,
//   NO_INTERNET: 'Sem Internet', // 5,
//   TOKEN_INCORRECT: 'Bad Token', // 6,
// };

// const keypadLayout = [
//   { key: '1', letters: '' },
//   { key: '2', letters: 'ABC' },
//   { key: '3', letters: 'DEF' },
//   { key: '4', letters: 'GHI' },
//   { key: '5', letters: 'JKL' },
//   { key: '6', letters: 'MNO' },
//   { key: '7', letters: 'PQRS' },
//   { key: '8', letters: 'TUV' },
//   { key: '9', letters: 'WXYZ' },
//   { key: '*', letters: '' },
//   { key: '0', letters: '+' },
//   { key: '#', letters: '' },
// ];

export default {
  components: {
    Draggable,
    Thumbnail,
    Microphone,
    VideoIcon,
    MicrophoneSlash,
    // VideoSlash,
    Phone,
    PhoneSlash,
    NumpadVue,
    PhoneTransfer,
  },
  props: {},
  emits: ['update:modelValue', 'update:call-state'],
  data() {
    return {
      elapsedTime: 0,
      timer: null,
      isMuted: false,
      callingSound: null,
      ringSound: null,
      localStream: null,
    };
  },
  computed: {
    ...mapGetters({
      uiFlags: 'webphone/getUIFlags',
      callInfo: 'webphone/getCallInfo',
      inboxes: 'inboxes/getInboxes',
      wavoip: 'webphone/getWavoip',
    }),
    username() {
      return this.callInfo.tag ?? this.callInfo.phone ?? '';
    },
    isCallEndDisabled() {
      return [
        'terminate',
        'reject',
        'accept_elsewhere',
        'reject_elsewhere',
      ].includes(this.callInfo.status);
    },
    formattedDuration() {
      const minutes = Math.floor(this.elapsedTime / 60);
      const seconds = this.elapsedTime % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
        2,
        '0'
      )}`;
    },
  },
  watch: {
    inboxes(newInboxes) {
      newInboxes.forEach(inbox => {
        if (inbox.external_token) {
          this.startWavoip(inbox.name, inbox.external_token);
        }
      });
    },
    callInfo(newCallInfo) {
      let instances = this.$store.state.webphone.wavoip;
      Object.keys(instances).forEach(token => {
        this.listenSockets(token, instances[token].whatsapp_instance);
      });

      const status = newCallInfo.status;
      if (status === 'accept') {
        this.startTimer();
      } else if (status === 'terminate') {
        this.stopTimer();
      }

      if (status === 'outcoming_calling') {
        this.playCalling();
      } else {
        this.stopCalling();
      }

      if (status === 'offer') {
        this.playRinging();
      } else {
        this.stopRinging();
      }
    },
    wavoip(newWavoip) {
      Object.keys(newWavoip).forEach(token => {
        this.listenSockets(token, newWavoip[token].whatsapp_instance);
      });
    },
  },
  mounted() {
    // this.$store.dispatch(
    //   'webphone/startWavoip',
    //   'b8018d84-dfed-45a0-9513-1877596ac8c6'
    // );
    // this.$store.dispatch(
    //   'webphone/startWavoip',
    //   'b0d3785b-2ef2-43e3-8d57-fbce592bfb3a'
    // );
  },
  methods: {
    startWavoip(inboxName, token) {
      this.$store.dispatch('webphone/startWavoip', {
        token,
        inboxName,
      });
    },
    startTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      const startDate = this.$store.state.webphone.call.active_start_date;
      if (!startDate) {
        console.error('startDate is undefined');
        return;
      }
      this.timer = setInterval(() => {
        const now = new Date();
        this.elapsedTime = Math.floor((now - startDate) / 1000);
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.elapsedTime = 0;
    },
    closeWebphone() {
      this.$store.dispatch('webphone/updateWebphoneVisible', {
        isOpen: false,
      });
    },
    acceptCall() {
      this.$store.dispatch('webphone/acceptCall');
    },
    rejectCall() {
      this.$store.dispatch('webphone/rejectCall');
    },
    endCall() {
      this.$store.dispatch('webphone/endCall');
    },
    mute() {
      this.isMuted = true;
      if (this.localStream && this.localStream.getAudioTracks().length > 0) {
      this.localStream.getAudioTracks()[0].enabled = false;
      }
    },
    unMute() {
      this.isMuted = false;
      if (this.localStream && this.localStream.getAudioTracks().length > 0) {
      this.localStream.getAudioTracks()[0].enabled = true;
      }
    },
    listenSockets(token, whatsapp_instance) {
      if (!whatsapp_instance || !whatsapp_instance.socket) {
        console.error('whatsapp_instance or whatsapp_instance.socket is undefined');
        return;
      }

      whatsapp_instance.socket.off('signaling');

      whatsapp_instance.socket.on('signaling', (...args) => {
        const data = args[0];

        this.$store.dispatch('webphone/updateCallStatus', data?.tag);

        if (data?.tag === 'offer') {
          const name = data?.content?.from_tag;
          const whatsapp_id = data?.content?.phone;
          const phone =
            parsePhoneNumber(`+${whatsapp_id}`)?.formatInternational() ??
            whatsapp_id;
          const profile_picture = data?.content?.profile_picture;

          this.$store.dispatch('webphone/incomingCall', {
            token: token,
            phone: phone,
            contact_name: name,
            profile_picture: profile_picture,
          });
        } else if (['terminate', 'reject', 'accept_elsewhere', 'reject_elsewhere'].includes(data?.tag)) {
          setTimeout(() => {
            this.$store.dispatch('webphone/resetCall');
          }, 3500);
        }
      });
    },
    playCalling() {
      this.callingSound = new Audio(SoundCalling);
      this.callingSound.loop = true;
      this.callingSound.play();
    },
    stopCalling() {
      if (this.callingSound) {
        this.callingSound.pause();
        this.callingSound.currentTime = 0;
      }
    },
    playRinging() {
      this.ringSound = new Audio(SoundRinging);
      this.ringSound.loop = true;
      this.ringSound.play();
    },
    stopRinging() {
      if (this.ringSound) {
        this.ringSound.pause();
        this.ringSound.currentTime = 0;
      }
    },
  },
};
</script>

<template>
  <Draggable :initial-x="50" :initial-y="50">
    <div
      v-if="uiFlags.isOpen && callInfo.id && callInfo.status !== 'offer'"
      class="flex flex-col h-[315px] w-[250px] bg-white dark:bg-slate-900 opacity-90 border border-gray-500 rounded-xl select-none cursor-grab"
    >
      <div class="flex h-[30px] place-content-between items-center">
        <p class="text-xs text-slate-800 dark:text-slate-100 m-0 px-4">
          {{ callInfo.inbox_name }}
        </p>

        <button
          class="relative m-0 px-4 select-none rounded-lg bg-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-white transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          data-ripple-light="true"
          @click="closeWebphone"
        >
          <span
            class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          >
            <fluent-icon
              icon="dismiss"
              size="14px"
              class="text-slate-800 dark:text-slate-100"
            />
          </span>
        </button>
      </div>
      <div class="flex justify-center align-middle mt-2">
        <thumbnail
          :src="callInfo.picture_profile"
          :username="username"
          status="online"
          should-show-status-always
          size="64px"
        />
      </div>
      <div class="flex flex-col my-6">
        <p
          v-if="callInfo.tag"
          class="text-slate-800 dark:text-slate-100 m-0 text-center"
        >
          {{ callInfo.tag }}
        </p>
        <p v-else class="text-slate-800 dark:text-slate-100 m-0 text-center">
          {{ callInfo.phone }}
        </p>

        <p
          v-if="callInfo.status === 'accept'"
          class="text-lg font-medium text-slate-800 dark:text-slate-100 m-0 text-center"
        >
          {{ formattedDuration }}
        </p>
        <p
          v-if="callInfo.status === 'accept_elsewhere'"
          class="text-lg font-medium text-slate-800 dark:text-slate-100 m-0 text-center"
        >
          {{ $t('WEBPHONE.ACCEPT_ELSEWHERE') }}
        </p>
        <p
          v-if="callInfo.status === 'reject_elsewhere'"
          class="text-lg font-medium text-slate-800 dark:text-slate-100 m-0 text-center"
        >
          {{ $t('WEBPHONE.REJECT_ELSEWHERE') }}
        </p>
        <p
          v-if="callInfo.status === 'terminate'"
          class="text-lg font-medium text-slate-800 dark:text-slate-100 m-0 text-center"
        >
          {{ $t('WEBPHONE.TERMINATE') }}
        </p>
        <p
          v-if="callInfo.status === 'reject'"
          class="text-lg font-medium text-slate-800 dark:text-slate-100 m-0 text-center"
        >
          {{ $t('WEBPHONE.TERMINATE') }}
        </p>
        <p
          v-if="callInfo.status === 'outcoming_calling'"
          class="text-lg font-medium text-slate-800 dark:text-slate-100 m-0 text-center"
        >
          {{ $t('WEBPHONE.CONNECT_CALLING') }}
        </p>
        <p
          v-if="callInfo.status === 'preaccept'"
          class="text-lg font-medium text-slate-800 dark:text-slate-100 m-0 text-center"
        >
          {{ $t('WEBPHONE.CALLING') }}
        </p>
        <p
          v-if="callInfo.status === 'relaylatency'"
          class="text-lg font-medium text-slate-800 dark:text-slate-100 m-0 text-center"
        >
          {{ $t('WEBPHONE.CALLING') }}
        </p>
      </div>
      <div class="flex justify-center align-center gap-x-5 my-2">
        <span
          v-if="!isMuted"
          v-tooltip="$t('WEBPHONE.MUTE')"
          class="cursor-pointer text-slate-800 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300"
          @click="mute"
        >
          <Microphone :size="20" color="currentColor" />
        </span>
        <span
          v-else
          v-tooltip="$t('WEBPHONE.UNMUTE')"
          class="cursor-pointer text-red-300 hover:text-red-500"
          @click="unMute"
        >
          <MicrophoneSlash :size="20" color="currentColor" />
        </span>
        <span
          v-tooltip="$t('WEBPHONE.TURN_ON_VIDEO')"
          class="cursor-no-drop text-slate-600 dark:text-slate-300"
          :disabled="false"
        >
          <VideoIcon :size="20" color="currentColor" />
        </span>
        <span
          v-tooltip="$t('WEBPHONE.NUMPAD')"
          class="cursor-no-drop text-slate-600 dark:text-slate-300"
        >
          <NumpadVue :size="20" color="currentColor" />
        </span>
        <span
          v-tooltip="$t('WEBPHONE.TRANSFER')"
          class="cursor-no-drop text-slate-600 dark:text-slate-300"
        >
          <PhoneTransfer :size="20" color="currentColor" />
        </span>
      </div>
      <div class="flex justify-center align-center my-4">
        <button
          class="relative h-15 max-h-[30px] w-15 max-w-[30px] p-[17px] select-none rounded-full bg-red-500 text-center align-middle font-sans text-xs font-medium uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          data-ripple-light="true"
          :disabled="isCallEndDisabled"
          @click="endCall"
        >
          <span
            class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          >
            <PhoneSlash :size="15" color="white" />
          </span>
        </button>
      </div>
    </div>
    <div
      v-if="uiFlags.isOpen && callInfo.id && callInfo.status === 'offer'"
      class="flex flex-col h-[315px] w-[250px] bg-white dark:bg-slate-900 opacity-90 border border-gray-500 rounded-xl select-none cursor-grab"
    >
      <div class="flex h-[30px] place-content-between items-center">
        <p class="text-xs text-slate-800 dark:text-slate-100 m-0 px-4">
          {{ callInfo.inbox_name }}
        </p>

        <button
          class="relative m-0 px-4 select-none rounded-lg bg-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-white transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          data-ripple-light="true"
          @click="closeWebphone"
        >
          <span
            class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          >
            <fluent-icon
              icon="dismiss"
              size="14px"
              class="text-slate-800 dark:text-slate-100"
            />
          </span>
        </button>
      </div>
      <div class="flex justify-center align-middle mt-2">
        <thumbnail
          :src="callInfo.picture_profile"
          :username="username"
          status="online"
          should-show-status-always
          size="64px"
        />
      </div>
      <div class="flex flex-col my-6">
        <p
          v-if="callInfo.tag"
          class="text-slate-800 dark:text-slate-100 m-0 text-center"
        >
          {{ callInfo.tag }}
        </p>
        <p v-else class="text-slate-800 dark:text-slate-100 m-0 text-center">
          {{ $t('WEBPHONE.UNKNOWN') }}
        </p>

        <p
          class="text-lg font-medium text-slate-800 dark:text-slate-100 m-0 text-center"
        >
          {{ callInfo.phone }}
        </p>
        <p
          v-if="callInfo.status === 'terminate'"
          class="text-lg font-medium text-slate-800 dark:text-slate-100 m-0 text-center"
        >
          {{ $t('WEBPHONE.TERMINATE') }}
        </p>
        <p
          v-if="callInfo.status === 'reject'"
          class="text-lg font-medium text-slate-800 dark:text-slate-100 m-0 text-center"
        >
          {{ $t('WEBPHONE.TERMINATE') }}
        </p>
        <p
          v-if="callInfo.status === 'outcoming_calling'"
          class="text-lg font-medium text-slate-800 dark:text-slate-100 m-0 text-center"
        >
          {{ $t('WEBPHONE.CONNECT_CALLING') }}
        </p>
        <p
          v-if="callInfo.status === 'preaccept'"
          class="text-lg font-medium text-slate-800 dark:text-slate-100 m-0 text-center"
        >
          {{ $t('WEBPHONE.CALLING') }}
        </p>
        <p
          v-if="callInfo.status === 'relaylatency'"
          class="text-lg font-medium text-slate-800 dark:text-slate-100 m-0 text-center"
        >
          {{ $t('WEBPHONE.CALLING') }}
        </p>
      </div>
      <div class="flex justify-center align-center my-4 gap-x-4">
        <button
          class="relative h-15 max-h-[30px] w-15 max-w-[30px] p-[17px] select-none rounded-full bg-green-500 text-center align-middle font-sans text-xs font-medium uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          data-ripple-light="true"
          :disabled="isCallEndDisabled"
          @click="acceptCall"
        >
          <span
            class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          >
            <Phone :size="15" color="white" />
          </span>
        </button>
        <button
          class="relative h-15 max-h-[30px] w-15 max-w-[30px] p-[17px] select-none rounded-full bg-red-500 text-center align-middle font-sans text-xs font-medium uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          data-ripple-light="true"
          :disabled="isCallEndDisabled"
          @click="rejectCall"
        >
          <span
            class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          >
            <PhoneSlash :size="15" color="white" />
          </span>
        </button>
      </div>
    </div>
  </Draggable>
</template>
