# removed ' rw_nus' from provider :scope with removal of linkedin share button. Once less item to scare away new users.

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, ENV["GOOGLE_KEY"], ENV["GOOGLE_SECRET"], {name: "google_login", approval_prompt: ''}
	provider :linkedin, ENV["LINKEDIN_KEY"], ENV["LINKEDIN_SECRET"], :scope => 'r_basicprofile r_emailaddress', :fields => ["id", "email-address", "first-name", "last-name", "picture-url"]
  provider :facebook, ENV['FACEBOOK_KEY'], ENV['FACEBOOK_SECRET']
end

OmniAuth.config.on_failure = PagesController.action(:oauth_failure)