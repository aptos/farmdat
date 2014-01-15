class Sample < CouchRest::Model::Base
  property :_id, String
  property :owner, String
  property :owner_name, String
  property :vineyard_id, String
  property :vineyard_name, String
  property :block, String
  property :date, Date
  property :brix, type: Float
  property :ta, type: Float
  property :ph, type: Float
  property :notes, String

  timestamps!

  design do
    view :by_vineyard_id
  end

end