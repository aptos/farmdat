source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.0.0'

# server
gem 'unicorn'

# Abort requests that are taking too long; a Rack::Timeout::Error will be raised.
# unicorn or other thread-safe server must be used.
gem "rack-timeout"

# cache
gem 'dalli'
gem 'memcachier'

# db is couch
gem 'couchrest_model', '2.0.1'

# javascript assets
gem 'underscore-rails'
gem 'jquery-rails'

# Use SCSS for stylesheets
gem 'sass-rails', '~> 4.0.0'
gem 'quiet_assets', :group => :development

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 1.2'

# add redis and resque for email delivery
gem 'redis'
gem 'resque'
gem 'resque_mailer'

# emails must inline style elements
gem 'premailer-rails'
gem 'nokogiri'

# use mailgun, my version. Updated from this fork - https://github.com/jonyt/mailgun
gem 'mailgun', :path => 'lib/mailgun'

# geoip to get country of requester
gem 'geoip'

# Storage on S3
gem 'aws-sdk', '~> 1.0'

# Use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

group :test, :development do
	gem "rspec-rails", "~> 2.8"
	gem 'debugger'
	gem "factory_girl_rails", "~> 4.0"
	gem 'faker'
	gem 'poltergeist'
	gem 'simplecov', :require => false
	gem 'dotenv-rails'
end

group :test do
	gem 'resque_spec'
end
