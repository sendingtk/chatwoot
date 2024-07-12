class Conversations::ForwardMessageJob < ApplicationJob
  queue_as :default

  def perform(payload)
    begin
      @user = User.find(payload[:user_id])
      @account = Account.find(payload[:account_id])
      @contacts = payload[:contacts]
      @messages = payload[:messages]

      return if @contacts.blank?

      @messages.each do |message_id|
        begin
          message = Message.find(message_id)
          Rails.logger.info(message)

          @contacts.each do |contact_id|
            begin
              # Garantir que cada iteração trabalhe com um novo objeto de mensagem
              contact_conversation = forward_conversation(contact_id, message)
              Rails.logger.info(contact_conversation)

              new_message = contact_conversation.messages.build(message_params(message))
              Rails.logger.info(new_message)

              process_attachment(new_message, message)
              new_message.save!
            rescue StandardError => e
              Rails.logger.error("Error processing contact ID #{contact_id} for message ID #{message_id}: #{e.message}")
              next
            end
          end

          sleep 0.5

        rescue StandardError => e
          Rails.logger.error("Error processing message ID #{message_id}: #{e.message}")
          raise e
        end
      end
    rescue StandardError => e
      Rails.logger.error("Error in perform method: #{e.message}")
      raise e
    end
  end

  private

  def message_params(message)
    {
      account_id: message.account_id,
      inbox_id: message.inbox_id,
      content: message.content,
      message_type: :outgoing,
      sender: @user
    }
  end

  def create_contact_inbox(contact, message)
    ::ContactInboxBuilder.new(
      contact: contact,
      inbox: message.inbox,
      hmac_verified: true
    ).perform
  end

  def conversation_params(contact, message)
    contact_inbox = create_contact_inbox(contact, message)
    Rails.logger.info contact_inbox
    {
      contact_id: contact,
      contact_inbox_id: contact_inbox.id,
      account_id: message.account_id,
      inbox_id: message.inbox_id,
      assignee_id: @user.id
    }
  end

  def forward_conversation(contact, message)
    contact_conversation = @account.conversations.find_by!(display_id: contact)
  rescue StandardError => e
    contact_conversation = ::Conversation.create!(conversation_params(contact, message))
  end

  def process_attachment(msg, message)
    Rails.logger.info message.attachments
    return if message.attachments.blank?

    message.attachments.each do |attachment|
      Rails.logger.info attachment
      attach_file(msg, attachment)
      attach_location(msg, attachment)
      attach_contact(msg, attachment)
    end
  end

  def attach_file(msg, attachment)
    return if %w[image audio video file].include?(attachment.file_type) == false
    msg.attachments.new(
      account_id: attachment.account_id,
      file_type: attachment.file_type,
      file: attachment.file.blob
    )
  end

  def attach_location(msg, attachment)
    return if attachment.file_type != "location"
    msg.attachments.new(
      account_id: attachment.account_id,
      file_type: attachment.file_type,
      coordinates_lat: attachment.coordinates_lat,
      coordinates_long: attachment.coordinates_long,
      fallback_title: attachment.fallback_title,
      external_url: attachment.external_url
    )
  end

  def attach_contact(msg, attachment)
    return if attachment.file_type != "contact"
    msg.attachments.new(
      account_id: attachment.account_id,
      file_type: attachment.file_type,
      fallback_title: attachment.fallback_title
    )
  end
end
