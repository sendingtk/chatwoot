class Whatsapp::UnoapiWebhookSetupService
  def perform(whatsapp_channel)
    return disconnect(whatsapp_channel) if whatsapp_channel.provider_config['disconnect']
    return connect(whatsapp_channel) if whatsapp_channel.provider_config['connect']

    true
  end

  private

  def disconnect(whatsapp_channel)
    phone_number = whatsapp_channel.provider_config['business_account_id']
    Rails.logger.debug { "Disconnecting #{phone_number} from unoapi" }
    response = HTTParty.post("#{url(whatsapp_channel)}/deregister", headers: headers(whatsapp_channel))
    if response.success?
      true
    else
      whatsapp_channel.errors.add(:provider_config, response.body)
      false
    end
  end

  def connect(whatsapp_channel)
    phone_number = whatsapp_channel.provider_config['business_account_id']
    Rails.logger.debug { "Connecting #{phone_number} from unoapi" }
    body = {
      ignoreGroupMessages: whatsapp_channel.provider_config['ignore_group_messages'],
      ignoreBroadcastStatuses: whatsapp_channel.provider_config['ignore_broadcast_statuses'],
      ignoreBroadcastMessages: whatsapp_channel.provider_config['ignore_broadcast_messages'],
      ignoreHistoryMessages: whatsapp_channel.provider_config['ignore_history_messages'],
      ignoreOwnMessages: whatsapp_channel.provider_config['ignore_own_messages'],
      ignoreYourselfMessages: whatsapp_channel.provider_config['ignore_yourself_messages'],
      sendConnectionStatus: whatsapp_channel.provider_config['send_connection_status'],
      notifyFailedMessages: whatsapp_channel.provider_config['notify_failed_messages'],
      composingMessage: whatsapp_channel.provider_config['composing_message'],
      rejectCalls: whatsapp_channel.provider_config['reject_calls'],
      messageCallsWebhook: whatsapp_channel.provider_config['message_calls_webhook'],
      webhooks: [
        sendNewMessages: whatsapp_channel.provider_config['webhook_send_new_messages'],
        id: 'default',
        urlAbsolute: "#{ENV.fetch('FRONTEND_URL', nil)}/webhooks/whatsapp/#{phone_number}",
        token: whatsapp_channel.provider_config['webhook_verify_token'],
        header: :Authorization
      ],
      sendReactionAsReply: whatsapp_channel.provider_config['send_reaction_as_reply'],
      sendProfilePicture: whatsapp_channel.provider_config['send_profile_picture'],      
      authToken: whatsapp_channel.provider_config['api_key']
    }
    response = HTTParty.post("#{url(whatsapp_channel)}/register", headers: headers(whatsapp_channel), body: body.to_json)
    Rails.logger.debug { "Response #{response}" }
    return send_message(whatsapp_channel) if response.success?

    whatsapp_channel.errors.add(:provider_config, response.body)
    true
  end

  def send_message(whatsapp_channel)
    phone_number = whatsapp_channel.provider_config['business_account_id']
    Rails.logger.debug { "Save #{phone_number} configuration unoapi" }
    body = {
      messaging_product: :whatsapp,
      to: phone_number,
      type: :text,
      text: {
        body: 'connect...'
      }
    }
    Rails.logger.debug { "Sending message to #{phone_number} unoapi" }
    response = HTTParty.post("#{url(whatsapp_channel)}/messages", headers: headers(whatsapp_channel), body: body.to_json)
    Rails.logger.debug { "Response #{response}" }
    return true if response.success?

    whatsapp_channel.errors.add(:provider_config, response.body)
    false
  end

  def url(whatsapp_channel)
    "#{whatsapp_channel.provider_config['url']}/v15.0/#{whatsapp_channel.provider_config['business_account_id']}"
  end

  def headers(whatsapp_channel)
    {
      Authorization: GlobalConfigService.load('UNOAPI_AUTH_TOKEN', whatsapp_channel.provider_config['api_key']),
      'Content-Type': 'application/json'
    }
  end
end
