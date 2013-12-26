# removed ' rw_nus' from provider :scope with removal of linkedin share button. Once less item to scare away new users.

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, ENV["GOOGLE_KEY"], ENV["GOOGLE_SECRET"], {name: "google_login", approval_prompt: ''}
	provider :linkedin, ENV["LINKEDIN_KEY"], ENV["LINKEDIN_SECRET"], :scope => 'r_basicprofile r_emailaddress', :fields => ["id", "email-address", "first-name", "last-name", "picture-url"]
  provider :facebook, ENV['FACEBOOK_KEY'], ENV['FACEBOOK_SECRET']
  provider :identity, :fields => [:email, :name], :on_failed_registration => AccountsController.action(:create)
end

OmniAuth.config.on_failure = Proc.new { |env|
  OmniAuth::FailureEndpoint.new(env).redirect_to_failure
}