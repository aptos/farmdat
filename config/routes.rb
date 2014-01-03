Farmdat::Application.routes.draw do
	root :to => "pages#home"

  # Authentications
  match '/auth/:provider/callback' => 'sessions#create', via: [:get, :post]
  get '/signin' => 'sessions#new'
  get '/signin/:provider' => 'sessions#new'
  get '/signout' => 'sessions#destroy'
  get '/auth/failure' => 'accounts#password_recovery'
  resources :identities

  # Accounts
  get "/accounts/signin_page" => 'accounts#signin_page'
  match "/accounts/password_recovery" => 'accounts#password_recovery', via: [:get, :post]
  get "/accounts/password_reset/:token" => 'accounts#password_reset'
  post "/accounts/password_update/:token" => 'accounts#password_update'
  get "/accounts/create" => 'accounts#create'

  # Vineyards CRUD
  resources :vineyards

  # S3 upload signature server
  resources :signed_url, only: :index

  # Must be admin to check the resque status
  mount SecureResqueServer.new, :at => '/resque'

  # Catch any other routes and display our own 404
  get "*path", :to => "application#routing_error", via: [:get, :post]
end