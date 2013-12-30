class Vineyard < CouchRest::Model::Base
  property :_id, String
  property :name, String
  property :owner, String
  property :owner_name, String
  property :location, String
  property :latlong, Array
  property :description, String
  property :blocks, Array
  property :attachments, Hash
  property :views, Integer, :default => 0

  timestamps!

  design do
    view :by_owner
  end

  def visit
    self.views = 0 unless self.views
    self.views += 1
    self.save
  end
end