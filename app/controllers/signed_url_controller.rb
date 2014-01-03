class SignedUrlController < ApplicationController
  before_filter :authenticate_user!
  respond_to :json

  def index
    raise "ENV MISSING: 'AWS_ACCESS_KEY_ID'" unless ENV['AWS_ACCESS_KEY_ID'] && ENV['AWS_S3_BUCKET']
    render json: {
      policy:    s3_upload_policy,
      signature: s3_upload_signature,
      key:       ENV['AWS_ACCESS_KEY_ID']
    }
  end

  protected

  def s3_upload_policy
    @policy ||= create_s3_upload_policy
  end

  def create_s3_upload_policy
    Base64.encode64(
    {
      "expiration" => 1.hour.from_now.utc.xmlschema,
      "conditions" => [
        { "bucket" =>  ENV['AWS_S3_BUCKET']},
        [ "starts-with", "$key", "" ],
        { "acl" => "public-read" },
        [ "starts-with", "$Content-Type", "" ],
        [ "content-length-range", 0, 10 * 1024 * 1024 ]
      ]
      }.to_json).gsub(/\n/,'')
  end

  def s3_upload_signature
    Base64.encode64(OpenSSL::HMAC.digest(OpenSSL::Digest::Digest.new('sha1'), ENV['AWS_SECRET_ACCESS_KEY'], s3_upload_policy)).gsub("\n","")
  end
end