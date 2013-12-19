module ApplicationHelper
	#
	# about our user
	#
	def current_user
		@current_user ||= User.find(session[:user_id]) if session[:user_id]
	end

	def user_signed_in?
		return true if current_user
	end

	def request_country
		@geoip ||= GeoIP.new("#{Rails.root}/db/GeoIP.dat")
		request.remote_ip
		return "US" if request.remote_ip == "127.0.0.1"
		country = @geoip.country(request.remote_ip).country_code2 rescue "Unknown"
		return country
	end

	def mobile_device?
		logger.info "**** Mobile? #{request.user_agent}"
    if params[:mobile_override]
    	params[:mobile_override] == "1"
    else
    	(request.user_agent =~ /Mobile|webOS/) && (request.user_agent !~ /iPad/)
    end
	end

	#
	# access restrictions
	#
	def restricted
		unless current_user and current_user.admin
			raise ActionController::RoutingError.new("You should not be here. That page")
			# redirect_to(root_url, :alert => "Access denied.") and return
		end
	end

	def admin?
		current_user.admin
	end

	def correct_user?
		@user = User.find(params[:id])
		unless current_user == @user
			redirect_to root_url, :alert => "Access denied."
		end
	end

	def authenticate_user!
		if !(current_user || auth_with_token)
			redirect_to root_url, :alert => 'You need to sign in for access to this page.'
		end
	end

	def auth_with_token
		authenticate_with_http_token do |token, options|
			session[:user_id] = Setting.find(token).uid rescue nil
			logger.warn "AUTH_WITH_TOKEN: '#{token}'"
		end
		return true if session[:user_id]
	end

	#
	# Email List related methods
	#
	def mailgun
		@mailgun ||= Mailgun()
	end

end
