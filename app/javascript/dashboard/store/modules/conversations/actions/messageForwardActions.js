import MessageApi from '../../../../api/inbox/message';

export default {
  async forwardMessage(_, { conversationId, messages, contacts }) {
    try {
      await MessageApi.forwardMessage(conversationId, messages, contacts);
    } catch (error) {
      // ignore error
    }
  },
};
