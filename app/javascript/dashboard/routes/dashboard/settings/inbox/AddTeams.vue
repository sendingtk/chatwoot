<template>
  <div
    class="border border-slate-25 dark:border-slate-800/60 bg-white dark:bg-slate-900 h-full p-6 w-full max-w-full md:w-3/4 md:max-w-[75%] flex-shrink-0 flex-grow-0"
  >
    <form class="mx-0 flex flex-wrap" @submit.prevent="addTeams()">
      <div class="w-full">
        <page-header
          :header-title="$t('INBOX_MGMT.ADD.TEAMS.TITLE')"
          :header-content="$t('INBOX_MGMT.ADD.TEAMS.DESC')"
        />
      </div>
      <div class="w-3/5">
        <div class="w-full">
          <label :class="{ error: $v.selectedTeams.$error }">
            {{ $t('INBOX_MGMT.ADD.TEAMS.TITLE') }}
            <multiselect
              v-model="selectedTeams"
              :options="teamList"
              track-by="id"
              label="name"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              :hide-selected="true"
              selected-label
              :select-label="$t('FORMS.MULTISELECT.ENTER_TO_SELECT')"
              :deselect-label="$t('FORMS.MULTISELECT.ENTER_TO_REMOVE')"
              :placeholder="$t('INBOX_MGMT.ADD.TEAMS.PICK_TEAMS')"
              @select="$v.selectedTeams.$touch"
            />
            <span v-if="$v.selectedTeams.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.TEAMS.VALIDATION_ERROR') }}
            </span>
          </label>
        </div>
        <div class="w-full">
          <woot-submit-button
            :button-text="$t('INBOX_MGMT.TEAMS.BUTTON_TEXT')"
            :loading="isCreating"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
/* eslint no-console: 0 */
import { mapGetters } from 'vuex';

import InboxTeamsAPI from '../../../../api/inboxTeams';
import router from '../../../index';
import PageHeader from '../SettingsSubPageHeader.vue';
import alertMixin from 'shared/mixins/alertMixin';

export default {
  components: {
    PageHeader,
  },
  mixins: [alertMixin],

  validations: {
    selectedTeams: {
      isEmpty() {
        return !!this.selectedTeams.length;
      },
    },
  },

  data() {
    return {
      selectedTeams: [],
      isCreating: false,
    };
  },

  computed: {
    ...mapGetters({
      teamList: 'teams/getTeams',
    }),
  },

  mounted() {
    this.$store.dispatch('teams/get');
  },

  methods: {
    async addTeams() {
      this.isCreating = true;
      const inboxId = this.$route.params.inbox_id;
      const selectedTeams = this.selectedTeams.map(x => x.id);

      try {
        await InboxTeamsAPI.update({ inboxId, teamList: selectedTeams });
        router.replace({
          name: 'settings_inboxes_add_agents',
          params: {
            page: 'new',
            inbox_id: this.$route.params.inbox_id,
          },
        });
      } catch (error) {
        this.showAlert(error.message);
      }
      this.isCreating = false;
    },
  },
};
</script>
