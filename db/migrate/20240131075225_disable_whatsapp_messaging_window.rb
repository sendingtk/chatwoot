class DisableWhatsappMessagingWindow < ActiveRecord::Migration[6.1]
    def change
      Account.find_in_batches do |account_batch|
        account_batch.each do |account|
          unless ActiveModel::Type::Boolean.new.cast(ENV.fetch('WHATSAPP_MESSAGE_WINDOW_ENABLED', 'true'))
            account.enable_features('disable_whatsapp_messaging_window')
            account.save!
          end
        end
      end
    end
  end