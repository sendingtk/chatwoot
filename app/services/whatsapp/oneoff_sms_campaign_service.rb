class Whatsapp::OneoffSmsCampaignService
  pattr_initialize [:campaign!]

  def perform
    raise "Invalid campaign #{campaign.id}" unless campaign.one_off?
    raise 'Completed Campaign' if campaign.completed?

    # marks campaign completed so that other jobs won't pick it up
    campaign.completed!
    audience_label_ids = campaign.audience.select { |audience| audience['type'] == 'Label' }.pluck('id')
    audience_labels = campaign.account.labels.where(id: audience_label_ids).pluck(:title)
    process_audience(audience_labels)
  end

  private

  delegate :inbox, to: :campaign
  delegate :channel, to: :inbox

  def process_audience(audience_labels)
    campaign.account.contacts.tagged_with(audience_labels, any: true).each do |contact|
      if contact.phone_number.blank?
        log_info("Skipping contact #{contact.id} due to missing phone number")
        next
      end
      send_message(inbox.name, to: contact.phone_number, content: campaign.message)
      delay = rand(1..30)
      sleep delay
    end
  end

  def send_message(inbox_name, to:, content:)
    api_key = ENV.fetch('API_KEY_EVOLUTION', nil)
    uri = URI("https://wappapi.botbuzz.com.br/message/sendText/#{inbox_name}")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = (uri.scheme == 'https')
    request = Net::HTTP::Post.new(uri.path, { 'Content-Type' => 'application/json', 'apikey' => api_key })
    body = {
      'number' => to,
      'options' => {
        'presence' => 'composing'
      },
      'textMessage' => {
        'text' => content
      }
    }
    request.body = body.to_json
    response = http.request(request)
    return if response.is_a?(Net::HTTPSuccess)

    raise "Failed to send message: #{response.body}"
  end

  def log_info(message)
    Rails.logger.info("[Whatsapp::OneoffSmsCampaignService] #{message}")
  end
end
