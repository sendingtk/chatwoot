import InboxTeamsAPI from '../../api/inboxTeams';

export const actions = {
  get(_, { inboxId }) {
    return InboxTeamsAPI.show(inboxId);
  },
  create(_, { inboxId, teamList }) {
    return InboxTeamsAPI.update({ inboxId, teamList });
  },
};

export default {
  namespaced: true,
  actions,
};
