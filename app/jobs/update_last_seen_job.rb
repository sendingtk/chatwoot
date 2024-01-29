class UpdateLastSeenJob < ApplicationJob
  queue_as :default

  def perform(conversation_id, user, agent_last_seen_at)
    conversation = Conversation.find(conversation_id)
    
    key = "conversation:last_seen:#{conversation_id}:#{user.id}"
    unless ::Redis::Alfred.get(key)
      ::Redis::Alfred.setex(key, true, 1.hour)
      params = {
        message_type: :activity,
        content_type: :text,
        content: "Conversa visualizada por #{user.id} - #{user.name}"
      }
      Messages::MessageBuilder.new(user, conversation, params).perform
    end

    return unless conversation.account.feature_enabled?('read_message')
    
    messages = conversation.messages.to_read(agent_last_seen_at)
    Rails.logger.debug { "Conversation #{conversation_id} with #{messages.size} message(s) to update status to read" }
    messages.each do |message|
      Rails.logger.debug { "Update message id #{message.id} source #{message.source_id} status to read" }
      message.update(status: :read)
    end
  end
end
