class Webhooks::Trigger
  SUPPORTED_ERROR_HANDLE_EVENTS = %w[message_created message_updated].freeze

  def initialize(url, payload, webhook_type, method, headers)
    @url = url
    @payload = payload
    @webhook_type = webhook_type
    @method = method
    @headers = headers
  end

  def self.execute(url, payload, webhook_type, method = :post, headers = { content_type: :json, accept: :json })
    new(url, payload, webhook_type, method, headers).execute
  end

  def execute
    perform_request
  rescue StandardError => e
    handle_error(e)
    Rails.logger.warn "Exception: Invalid webhook URL #{@url} : #{e.message}"
  end

  private

  def perform_request
    Rails.logger.debug { "Webhook Trigger @method: #{@method} @url #{@url}  @payload #{ @payload.to_json} @headers #{@headers}" }
    RestClient::Request.execute(
      method: @method,
      url: @url,
      payload: @payload.to_json,
      headers: @headers,
      timeout: ENV.fetch('WEBHOOKS_TRIGGER_TIMEOUT', '5').to_i
    )
  end

  def handle_error(error)
    return unless should_handle_error?
    return unless message

    update_message_status(error)
  end

  def should_handle_error?
    @webhook_type == :api_inbox_webhook && SUPPORTED_ERROR_HANDLE_EVENTS.include?(@payload[:event])
  end

  def update_message_status(error)
    message.update!(status: :failed, external_error: error.message)
  end

  def message
    return if message_id.blank?

    @message ||= Message.find_by(id: message_id)
  end

  def message_id
    @payload[:id]
  end
end
