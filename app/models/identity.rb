class Identity < CouchRest::Model::Base
  include ::OmniAuth::Identity::Model
  include ::OmniAuth::Identity::SecurePassword

  validates_presence_of :name, :message => "Name is missing"
  validates_uniqueness_of :email, :message => "We already have an account with that Email Address"
  validates_format_of :email, :with => /\A[-a-z0-9_+\.]+\@([-a-z0-9]+\.)+[a-z0-9]{2,4}\z/i, :message => "Email is not valid"
  validates_presence_of :password_digest, :message => "Password is not valid"

  before_create :set_id
  has_secure_password

  property :id, String
  property :email, type: String
  property :password_digest
  property :name, String
  unique_id :id

  timestamps!

  def set_id
    self.id = ['id',self.email].join('-')
  end

  design do
    view :by_email
  end

  def self.auth_key=(key)
    super
    validates_uniqueness_of key, :case_sensitive => false
  end

  def self.locate(search_hash)
    self.find("id-" + search_hash['email'])
  end
end