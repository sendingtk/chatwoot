<template>
  <div class="home-page--container">
    <div
      v-for="(configItem, index) in config"
      :key="index"
      class="home-page--list"
    >
      <iframe
        v-if="configItem.type === 'frame'"
        :id="`home-page--frame-${index}`"
        ref="iframes"
        :src="defaultUrl"
        class="iframe-hidden"
        @load="() => onIframeLoad(index)"
      />
    </div>
  </div>
</template>

<script>
// import LoadingState from '../../../../components/widgets/LoadingState.vue';
import { mapGetters } from 'vuex';

export default {
  // components: {
  //   LoadingState,
  // },
  props: {
    currentChat: {
      type: Object,
      default: () => ({}),
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      redirected: true,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
      dashboardApps: 'dashboardApps/getRecords',
    }),
    dashboardAppContext() {
      return {
        contact: this.eventData.data.contact,
        currentAgent: this.currentAgent,
      };
    },
    contactId() {
      return this.eventData?.meta?.sender?.id;
    },
    currentAgent() {
      const { id, name, email } = this.currentUser;
      return { id, name, email };
    },
    defaultUrl() {
      const selectedDashboardApp = this.dashboardApps.find(
        dashboardApp => dashboardApp.title === 'crm'
      );
      return selectedDashboardApp?.content[0]?.url || '';
    },
  },
  watch: {
    isVisible() {
      if (this.isVisible) {
        this.hasOpenedAtleastOnce = true;
      }
    },
  },
  mounted() {
    window.onmessage = e => {
      if (
        typeof e.data !== 'string' ||
        e.data !== 'chatwoot-dashboard-app:fetch-info'
      ) {
        return;
      }
      this.onIframeLoad(null, 0);
    };
  },
  methods: {
    formatEventData() {
      return {
        event: 'appContext',
        data: {
          contact: { id: 1 },
        },
      };
    },
    getFrameId(index) {
      return `dashboard-app--frame-${index}`;
    },
    onIframeLoad(index) {
      const frameElement = this.$refs.iframes[index];
      const eventData = { event: 'appContext', data: this.dashboardAppContext };

      if (frameElement) {
        frameElement.contentWindow.postMessage(JSON.stringify(eventData), '*');

        frameElement.onload = () => {
          if (this.redirected) {
            const urlParts = this.defaultUrl.split('apps');
            frameElement.contentWindow.location.href = urlParts[0];
            setTimeout(() => {
              frameElement.contentWindow.location.href = urlParts[0];
            }, 1000);
            this.redirected = false;
          }

          setTimeout(() => {
            frameElement.classList.remove('iframe-hidden');
          }, 1000);
        };
      }
    },
  },
};
</script>

<style scoped>
.home-page--container,
.home-page--list,
.home-page--list iframe {
  height: 100%;
  width: 100%;
}

.home-page--list iframe {
  border: 0;
}

.iframe-hidden {
  display: none;
}
</style>
