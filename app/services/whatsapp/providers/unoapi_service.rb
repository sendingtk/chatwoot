class Whatsapp::Providers::UnoapiService < Whatsapp::Providers::WhatsappCloudService
  def validate_provider_config?
    return Whatsapp::UnoapiWebhookSetupService.new.perform(whatsapp_channel) if super
  end
end
