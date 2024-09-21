class AddExternalTokenToInbox < ActiveRecord::Migration[7.0]
  def change
    add_column :inboxes, :external_token, :string
  end
end
