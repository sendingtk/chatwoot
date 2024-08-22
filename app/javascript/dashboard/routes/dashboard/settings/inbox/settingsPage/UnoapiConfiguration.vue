<script type="module">
import { io } from 'socket.io-client';
import { useVuelidate } from '@vuelidate/core';
import { useAlert } from 'dashboard/composables';
import inboxMixin from 'shared/mixins/inboxMixin';
import { required } from '@vuelidate/validators';
import { mapGetters } from 'vuex';
// import { createConsumer } from '@rails/actioncable';

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  components: {},
  mixins: [inboxMixin],
  props: {
    inbox: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      apiKey: '',
      url: 'https://unoapi.cloud',
      ignoreGroupMessages: true,
      ignoreHistoryMessages: true,
      webhookSendNewMessages: true,
      sendAgentName: true,
      connect: false,
      disconect: false,
      qrcode: '',
      notice: '',
    };
  },
  computed: {
    ...mapGetters({ uiFlags: 'inboxes/getUIFlags' }),
  },
  validations: {
    apiKey: { required },
    ignoreGroupMessages: { required },
    generateQrcode: { required },
    ignoreHistoryMessages: { required },
    webhookSendNewMessages: { required },
    sendAgentName: { required },
    url: { required },
  },
  watch: {
    inbox() {
      this.setDefaults();
    },
  },
  mounted() {
    this.setDefaults();
    this.listenerQrCode();
  },
  methods: {
    setDefaults() {
      this.apiKey = this.inbox.provider_config.api_key;
      this.url = this.inbox.provider_config.url;
      this.ignoreGroupMessages =
        this.inbox.provider_config.ignore_group_messages;
      this.ignoreHistoryMessages =
        this.inbox.provider_config.ignore_history_messages;
      this.webhookSendNewMessages =
        this.inbox.provider_config.webhook_send_new_messages;
      this.sendAgentName = this.inbox.provider_config.send_agent_name;
      this.connect = false;
      this.disconect = false;
    },
    listenerQrCode() {
      const url = `${this.inbox.provider_config.url}`
        .replace('https', 'wss')
        .replace('http', 'ws');
      const socket = io(url, { path: '/ws' });
      socket.on('broadcast', data => {
        if (data.phone !== this.inbox.provider_config.phone_number_id) {
          this.notice = `Received qrcode from ${data.phone} but the current number in chatwoot is ${this.inbox.provider_config.phone_number_id}`;
          this.qrcode = '';
          // broadcast phone is other
          return;
        }
        if (data.type === 'status') {
          this.notice = data.content;
          this.qrcode = '';
        } else if (data.type === 'qrcode') {
          this.qrcode = data.content;
          this.notice = '';
        }
      });
      // const url = `${this.inbox.provider_config.url}/ws`;
      // const cable = createConsumer(url);
      // cable.subscriptions.create(
      //   {
      //     channel: 'broadcast',
      //     phone_number: this.inbox.provider_config.phone_number_id,
      //   },
      //   {
      //     broadcast: data => {
      //       console.log('broadcast');
      //       this.qrcode = data;
      //     },
      //     connected: () => {
      //       console.log('connected');
      //       this.qrcode = 'waiting for qrcode';
      //     },
      //   }
      // );
    },
    async updateInbox() {
      try {
        const payload = {
          id: this.inbox.id,
          formData: false,
          channel: {
            provider_config: {
              ...this.inbox.provider_config,
              api_key: this.apiKey,
              ignore_history_messages: this.ignoreHistoryMessages,
              ignore_group_messages: this.ignoreGroupMessages,
              send_agent_name: this.sendAgentName,
              webhook_send_new_messages: this.webhookSendNewMessages,
              url: this.url,
              connect: this.connect,
              disconect: this.disconect,
            },
          },
        };
        await this.$store.dispatch('inboxes/updateInbox', payload);
        useAlert(this.$t('INBOX_MGMT.EDIT.API.SUCCESS_MESSAGE'));
      } catch (error) {
        useAlert(this.$t('INBOX_MGMT.EDIT.API.ERROR_MESSAGE'));
      }
    },
  },
};
</script>

<template>
  <div class="my-2 mx-8 text-base">
  <form class="flex flex-col" @submit.prevent="updateInbox()">
    <div class="w-1/4">
      <label :class="{ error: v$.url.$error }">
        {{ $t('INBOX_MGMT.ADD.WHATSAPP.URL.LABEL') }}
        <input
          v-model.trim="url"
          type="text"
          :placeholder="$t('INBOX_MGMT.ADD.WHATSAPP.URL.PLACEHOLDER')"
        />
        <span v-if="v$.url.$error" class="message">
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.URL.ERROR') }}
        </span>
      </label>
    </div>

    <div class="w-1/4">
      <label :class="{ error: v$.apiKey.$error }">
        <span>
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.API_KEY.LABEL') }}
        </span>
        <input
          v-model.trim="apiKey"
          type="text"
          :placeholder="$t('INBOX_MGMT.ADD.WHATSAPP.API_KEY.PLACEHOLDER')"
          @blur="v$.apiKey.$touch"
        />
        <span v-if="v$.apiKey.$error" class="message">
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.API_KEY.ERROR') }}
        </span>
      </label>
    </div>

    <div class="w-3/4 pb-4 config-helptext">
      <label :class="{ error: v$.sendAgentName.$error }" style="display: flex; align-items: center;">
        <woot-switch
          v-model="sendAgentName"
          :value="sendAgentName"
          style="flex: 0 0 auto; margin-right: 10px;"
        />
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.SEND_AGENT_NAME.LABEL') }}
        <span v-if="v$.url.$error" class="message">
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.SEND_AGENT_NAME.ERROR') }}
        </span>
      </label>
    </div>

    <div class="w-3/4 pb-4 config-helptext">
      <label :class="{ error: v$.ignoreGroupMessages.$error }" style="display: flex; align-items: center;">
        <woot-switch
          v-model="ignoreGroupMessages"
          :value="ignoreGroupMessages"
          style="flex: 0 0 auto; margin-right: 10px;"
        />
        {{ $t('INBOX_MGMT.ADD.WHATSAPP.IGNORE_GROUPS.LABEL') }}
        <span v-if="v$.ignoreGroupMessages.$error" class="message">
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.IGNORE_GROUPS.ERROR') }}
        </span>
      </label>
    </div>

    <div class="w-3/4 pb-4 config-helptext">
      <label :class="{ error: v$.ignoreHistoryMessages.$error }" style="display: flex; align-items: center;">
        <woot-switch
          v-model="ignoreHistoryMessages"
          :value="ignoreHistoryMessages"
          style="flex: 0 0 auto; margin-right: 10px;"
        />
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.IGNORE_HISTORY.LABEL') }}
        <span v-if="v$.ignoreHistoryMessages.$error" class="message">
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.IGNORE_HISTORY.ERROR') }}
        </span>
      </label>
    </div>

    <div class="w-3/4 pb-4 config-helptext">
      <label :class="{ error: v$.webhookSendNewMessages.$error }" style="display: flex; align-items: center;">
        <woot-switch
          v-model="webhookSendNewMessages"
          :value="webhookSendNewMessages"
          style="flex: 0 0 auto; margin-right: 10px;"
        />
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.WEBWOOK_SEND_NEW_MESSAGES.LABEL') }}
        <span v-if="v$.webhookSendNewMessages.$error" class="message">
          {{ $t('INBOX_MGMT.ADD.WHATSAPP.WEBWOOK_SEND_NEW_MESSAGES.ERROR') }}
        </span>
      </label>
    </div>

    <div class="w-3/4 pb-4 config-helptext">
      <img v-if="qrcode" :src="qrcode" />
      <div v-if="notice">{{ notice }}</div>
    </div>

    <div class="my-4 w-auto">
      <woot-submit-button
        :loading="uiFlags.isUpdating"
        :button-text="
          $t('INBOX_MGMT.SETTINGS_POPUP.WHATSAPP_SECTION_UPDATE_BUTTON')
        "
      />
      <woot-submit-button
        :loading="uiFlags.isUpdating"
        :button-text="$t('INBOX_MGMT.SETTINGS_POPUP.WHATSAPP_CONNECT')"
        @click="connect = true"
      />
      <!-- <woot-submit-button
        :loading="uiFlags.isUpdating"
        :button-text="$t('INBOX_MGMT.SETTINGS_POPUP.WHATSAPP_DISCONNECT')"
        @click="disconnect = true"
      /> -->
    </div>
  </form>
  </div>
</template>

<style lang="scss" scoped>
.whatsapp-settings--content {
  ::v-deep input {
    margin-bottom: 0;
  }
}
</style>
