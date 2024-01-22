class EnableSendAgentNameInWhatsappMessage < ActiveRecord::Migration[6.1]
  def change
    Account.find_in_batches do |account_batch|
      account_batch.each do |account|
        account.enable_features('send_agent_name_in_whatsapp_message')
        account.save!
      end
    end
  end
end
