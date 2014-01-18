class SamplesController < ApplicationController

  def index
    @samples = Sample.by_vineyard_id.stale('update_after').all
    render :json => @samples
  end

  def mine
    @vineyards = Vineyard.by_owner.key(current_user.email).all

    @samples = []
    @vineyards.each do |vineyard|
      @samples += Sample.by_vineyard_id.key(vineyard._id).all
    end
    # @samples = @samples.sort { |a, b| [a['date'], a['vineyard_name']] <=> [b['date'], b['vineyard_name']]}

    render :json => @samples
  end

  def show
    @sample = Sample.find(params[:id])
    unless @sample
      render :json => { error: "sample not found: #{params[:id]}" }, :status => 404 and return
    end
    render :json => @sample
  end

  def create
    @sample = Sample.new(params[:sample])
    @sample.owner ||= current_user.email
    @sample.owner_name ||= current_user.name
    begin
      @sample.save
    rescue Exception => e
      status = 400
      if e.message.include? "Conflict"
        status = 409
      end
      render :json => { error: e.message, sample: @sample }, :status => status and return
    end
    render :json => @sample
  end

  def update
    @sample = Sample.find(params[:id])
    unless @sample
      render :json => { error: "sample not found: #{params[:id]}" }, :status => 404 and return
    end

    @sample.attributes = params[:sample]
    if @sample.save
      render :json => @sample
    else
      respond_with(@sample.errors, status: :unprocessable_entity)
    end
  end

  def destroy
    @sample = Sample.find(params[:sample])

    @sample.destroy
    render :json => { status: 'Deleted' }
  end

end
