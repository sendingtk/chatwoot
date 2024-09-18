# https://docs.360dialog.com/whatsapp-api/whatsapp-api/media
# https://developers.facebook.com/docs/whatsapp/api/media/

class Whatsapp::IncomingMessageWhatsappCloudService < Whatsapp::IncomingMessageBaseService
  private

  def set_contact
    contact_params = @processed_params[:contacts]&.first
    return if contact_params.blank?

    super

    return unless group_message?

    @sender = outgoing_message_type? ? nil : @contact

    contact_inbox = ::ContactInboxWithContactBuilder.new(
      source_id: contact_params[:group_id],
      inbox: inbox,
      contact_attributes: {
        email: contact_params[:group_id],
        name: contact_params[:group_subject] || contact_params[:group_id],
        avatar_url: contact_params[:group_picture]
      }
    ).perform

    @contact_inbox = contact_inbox
    @contact = contact_inbox.contact
  end

  def processed_params
    @processed_params ||= params[:entry].try(:first).try(:[], 'changes').try(:first).try(:[], 'value')
  end

  def download_attachment_file(attachment_payload)
    return if attachment_payload[:id].blank?
  
    url_response = HTTParty.get(inbox.channel.media_url(attachment_payload[:id]), headers: inbox.channel.api_headers)
    inbox.channel.authorization_error! if url_response.unauthorized?
    return unless url_response.success? && url_response.parsed_response['url'].present?
  
    Down.download(url_response.parsed_response['url'], headers: inbox.channel.api_headers)
  rescue StandardError => e
    Rails.logger.error "Error al descargar el archivo adjunto: #{e.message}"
  end

  def message_content(message)
    content = super(message)
    group_message? && !outgoing_message_type? && @sender ? "*#{@sender.name}*: #{content}" : content
  end

  def group_message?
    @group_message ||= begin
      contact_params = @processed_params[:contacts]&.first
      contact_params.present? && contact_params[:group_id].present?
    end
  end

  def set_message_type
    @message_type = :activity
    return if activity_message_type?

    @message_type = outgoing_message_type? ? :outgoing : :incoming
  end

  def outgoing_message_type?
    message = @processed_params[:messages]&.first
    return if message.blank?

    message[:from] == @processed_params['metadata']['display_phone_number'].sub('+', '')
  end

  def activity_message_type?
    message = @processed_params[:messages]&.first
    return if message.blank?

    contact_params = @processed_params[:contacts]&.first
    return if contact_params.blank?

    !group_message? &&
      @processed_params['metadata']['display_phone_number'].sub('+', '') == contact_params[:wa_id] && contact_params[:wa_id] == message[:from]
  end
end
