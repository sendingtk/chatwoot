<template>
  <div class="home-page--container">
    <div v-if="defaultUrl" class="home-page--list">
      <LoadingState v-if="loading" />
      <iframe
        v-show="!loading"
        :src="defaultUrl"
        @load="onIframeLoad"
        ref="iframe"
        class="iframe-hidden"
      ></iframe>
    </div>
  </div>
</template>

<script>
import LoadingState from '../../../../components/widgets/LoadingState.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    LoadingState,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      eventData: this.formatEventData(),
      redirected: true,
      loading: true
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
      const dashboardApp = this.dashboardApps.find(dashboardApp => dashboardApp.title === "crm");
      return dashboardApp?.content[0]?.url || '';
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
      if (typeof e.data !== 'string' || e.data !== 'chatwoot-dashboard-app:fetch-info') {
        return;
      }
      this.onIframeLoad();
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
    onIframeLoad() {
      const frameElement = this.$refs.iframe;
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
            this.loading = false;
          }, 1500);
          
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
