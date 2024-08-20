class Whatsapp::Providers::UnoapiService < Whatsapp::Providers::WhatsappCloudService
  def validate_provider_config?
    url = "#{business_account_path}/message_templates?access_token=#{GlobalConfigService.load('UNOAPI_AUTH_TOKEN', whatsapp_channel.provider_config['api_key'])}"
    return Whatsapp::UnoapiWebhookSetupService.new.perform(whatsapp_channel) if HTTParty.get(url).success?
  end
end
