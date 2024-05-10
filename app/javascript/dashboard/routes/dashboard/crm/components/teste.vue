<template>
  <div class="home-page--container">
    <div v-for="(configItem, index) in config" :key="index" class="home-page--list">
      <iframe
        v-if="configItem.type === 'frame'"
        :id="`home-page--frame-${index}`"
        :src="defaultUrl"
        @load="() => onIframeLoad(index)"
        ref="iframes"
        class="iframe-hidden"
      ></iframe>
    </div>
  </div>
</template>

<script>
//
import LoadingState from '../../../../components/widgets/LoadingState.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    LoadingState,
  },
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
      //defaultUrl: 'https://crm.inovechat.com/apps/chatwoots/embedding?token=ccb8c849011c909c905a',
      //defaultUrl: this.dashboardApps.find(dashboardApp => dashboardApp.title === "crm")?.content[0]?.url || '',

      config: [{ type: 'frame', url: 'example.com' }],
      eventData: this.formatEventData(),
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
      const dashboardApp = this.dashboardApps.find(dashboardApp => dashboardApp.title === "crm");
      console.log("TESTE2: ",dashboardApp)
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
   
    //console.log("TESTANDO", this.defaultUrl);

    console.log(this.dashboardApps)
    // const abc = this.dashboardApps.map(dashboardApp => ({
    //   name: dashboardApp.title,
    // }))

    const abc = this.dashboardApps
  .filter(dashboardApp => dashboardApp.title === "crm")
  .map(dashboardApp => ({
    name: dashboardApp.title,
    url: dashboardApp.content.length > 0 ? dashboardApp.content[0].url : '',
  }));
  
git 
  


    window.onmessage = e => {
      if (typeof e.data !== 'string' || e.data !== 'chatwoot-dashboard-app:fetch-info') {
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
          //currentAgent: { id: 100, name: 'Douglas', email: 'doug.fsg@gmail.com' },
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
            //frameElement.contentWindow.location.href = 'https://crm.inovechat.com/';
            const urlParts = this.defaultUrl.split('apps'); // Divide a URL em duas partes: antes e depois de 'apps'
        frameElement.contentWindow.location.href = urlParts[0];
            setTimeout(() => {
              //frameElement.contentWindow.location.href = 'https://crm.inovechat.com/';
              const urlParts = this.defaultUrl.split('apps'); // Divide a URL em duas partes: antes e depois de 'apps'
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
