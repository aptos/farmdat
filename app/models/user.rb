class User < CouchRest::Model::Base
  property :email, type: String
  property :provider, type: String
  property :name, String
  property :info, Hash
  property :visits, Integer, default: 1

  unique_id :email
  timestamps!

  def self.create_with_omniauth(auth)
    create! do |user|
      user.email = auth['info']['email']
      user.name = auth['info']['name']
      user.info = auth['info']
    end
  end

  design do
    view :by_email
  end

end
