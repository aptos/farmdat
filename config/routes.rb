Farmdat::Application.routes.draw do
	root :to => "pages#home"

  # Authentications
  match '/auth/:provider/callback' => 'sessions#create', via: [:get, :post]
  get '/signin' => 'sessions#new'
  get '/signin/:provider' => 'sessions#new'
  get '/signout' => 'sessions#destroy'
  get '/auth/failure' => 'sessions#failure'

  resources :identities

  # Must be admin to check the resque status
  mount SecureResqueServer.new, :at => '/resque'

  # Catch any other routes and display our own 404
  get "*path", :to => "application#routing_error", via: [:get, :post]
end