<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      uiFlags: 'webphone/getUIFlags',
      callInfo: 'webphone/getCallInfo',
    }),
  },
  methods: {
    openWebphone() {
      this.$store.dispatch('webphone/updateWebphoneVisible', {
        isOpen: true,
      });
    },
  },
};
</script>
<style scoped>
@tailwind components;
@layer components {
  /* Radar ping animation */
  @keyframes ping {
    75%,
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
  .radar-ping-animation {
    animation: ping 1s ease infinite;
  }
}
</style>

<template>
  <button
    v-if="!uiFlags.isOpen && callInfo.id"
    class="text-slate-600 dark:text-slate-100 w-10 h-10 my-2 p-0 flex items-center justify-center rounded-lg hover:bg-slate-25 dark:hover:bg-slate-700 dark:hover:text-slate-100 hover:text-slate-600 relative"
    @click="openWebphone"
  >
    <fluent-icon icon="call" />
    <div
      class="radar-ping-animation absolute top-0 right-0 -mt-1 -mr-1 rounded-full w-3 h-3 bg-woot-500 dark:bg-woot-500"
    />
    <div
      class="absolute top-0 right-0 -mt-1 -mr-1 rounded-full w-3 h-3 bg-woot-500 dark:bg-woot-500 opacity-50"
    />
  </button>
</template>
