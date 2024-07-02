import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({ teams: 'teams/getTeams', myTeams: 'teams/getMyTeams' }),
    hasAnAssignedTeam() {
      return !!this.currentChat?.meta?.team;
    },
    teamsList() {
      if (this.hasAnAssignedTeam) {
        return [
          {
            id: 0,
            name: 'None',
          },
          ...this.teams,
        ];
      }
      return this.teams;
    },
    myTeamsList() {
      return this.myTeams;
    },
  },
};
