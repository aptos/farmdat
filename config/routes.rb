Farmdat::Application.routes.draw do
	root :to => "pages#home"
	
  # Must be admin to check the resque status
  mount SecureResqueServer.new, :at => '/resque'

  # Catch any other routes and display our own 404
  match "*path", :to => "application#routing_error", via: [:get, :post]
end