class AccountsController < ApplicationController

  def signin_page
    # nothing to say
  end

  def create
    if env['omniauth.identity']
      @identity = env['omniauth.identity']
      logger.error "registration_failed: #{@identity.inspect}, #{@identity.errors.inspect}"
      @messages = @identity.errors.messages.map{|m| "<strong>#{m[0].to_s.titleize}:</strong> #{m[1].to_sentence}"}
    end
  end

  def password_recovery
    if params[:auth_key]
      @email = params[:auth_key]
      logger.warn "User needs password_recovery: #{@email}"
      @recovery_mail_sent = true
    end
  end

end
