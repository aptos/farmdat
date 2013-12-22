class SessionsController < ApplicationController

  def new
    if params[:provider]
      provider = params[:provider]
      auth_url = "/auth/#{provider}"
      redirect_to auth_url
    else
      logger.info "no provider provided"
    end
  end

  def create
    auth = request.env["omniauth.auth"]
    logger.info "++++ Successful Sign In with #{params[:provider]} INFO: #{auth['info'].inspect}"

    user = User.find(auth['info']['email'])
    unless user
      user = User.create_with_omniauth(auth)
      logger.info "New User Created: #{user.inspect}"

      # UserMailer.welcome_email(user.id).deliver
    end
    user.visits += 1
    user.save!

    url = session[:return_to] || root_path
    session[:return_to] = nil
    url = root_path if url.eql?('/signout')

    session[:user_id] = user.id
    redirect_to url
  end

  def destroy
    reset_session
    redirect_to root_url
  end

  def failure
    message = "Unknown Error"
    if params[:message]
      message = params[:message].humanize
    end
    redirect_to root_url, :alert => "Authentication error: #{message}"
  end

end