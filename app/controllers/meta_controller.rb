class MetaController < ApplicationController
  respond_to :json

  def index
    @meta = { 'timestamp' => Time.now }

    @meta['months'] = Global.months.names
    @meta['month_select'] = {}
    @meta['months'].each_with_index do |item, index|
      @meta['month_select'][sprintf("%02d",index+1)] = sprintf("%02d",index+1) + "-" + item
    end

    @meta['states'] = Global.states.names
    @meta['avas'] = Global.avas.names

    @meta['red_grapes'] = Global.red_grapes.names
    @meta['white_grapes'] = Global.white_grapes.names

    @meta['jobs'] = Global.jobs.names
    if admin?
      @meta['admin'] = true
    end
    render :json => @meta
  end
end