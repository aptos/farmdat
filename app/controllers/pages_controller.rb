class PagesController < ApplicationController

  def home
    @country = request_country
    if request.user_agent =~ /MSIE [6789]/
      @access_problem = "Rats! We think your browser might not work with TaskIT. Please try MSIE Version 10, Chrome, Firefox or Safari"
    end
  end

  def index
    home
  end

end
