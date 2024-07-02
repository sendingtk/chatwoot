/* global axios */
import ApiClient from './ApiClient';

class InboxTeams extends ApiClient {
  constructor() {
    super('inbox_teams', { accountScoped: true });
  }

  update({ inboxId, teamList }) {
    return axios.patch(this.url, {
      inbox_id: inboxId,
      team_ids: teamList,
    });
  }
}

export default new InboxTeams();
