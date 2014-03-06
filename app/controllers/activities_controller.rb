class ActivitiesController < ApplicationController
  before_filter :authenticate_user!
  respond_to :json

  def index
    @activities = Activity.by_vineyard_id.stale('update_after').all
    render :json => @activities
  end

  def mine
    @vineyards = Vineyard.by_owner.key(current_user.email).all

    @activities = []
    @vineyards.each do |vineyard|
      @activities += Activity.by_vineyard_id.key(vineyard._id).all
    end
    begin
      @sorted_activities = @activities.sort { |a, b| [a['date'], a['vineyard_name']] <=> [b['date'], b['vineyard_name']]}
    rescue
      @sorted_activities = @activities
    end

    render :json => @activities
  end

  def show
    @activity = Activity.find(params[:id])
    unless @activity
      render :json => { error: "activity not found: #{params[:id]}" }, :status => 404 and return
    end
    render :json => @activity
  end

  def create
    @activity = Activity.new(params[:activity])
    @activity.owner ||= current_user.email
    @activity.owner_name ||= current_user.name
    begin
      @activity.save
    rescue Exception => e
      status = 400
      if e.message.include? "Conflict"
        status = 409
      end
      render :json => { error: e.message, activity: @activity }, :status => status and return
    end
    render :json => @activity
  end

  def update
    @activity = Activity.find(params[:id])
    unless @activity
      render :json => { error: "activity not found: #{params[:id]}" }, :status => 404 and return
    end

    @activity.attributes = params[:activity]
    if @activity.save
      render :json => @activity
    else
      respond_with(@activity.errors, status: :unprocessable_entity)
    end
  end

  def delete_photo
    index = params[:index]

    if photo = params[:activity]['album'][index.to_i]
      logger.info("delete photo! #{photo.inspect}")
      s3_delete photo['uri']
      s3_delete photo['thumb']
    end

    @activity = Activity.find(params[:id])
    # Removed photos from existing activity
    if @activity
      @activity.attributes = params[:activity]
      if @activity.save
        render :json => @activity
      else
        respond_with(@activity.errors, status: :unprocessable_entity)
      end
    else
      # Removed photos for unsaved (new) activity
      render :json => { status: 'Deleted' }
    end
  end

  def destroy
    @activity = Activity.find(params[:activity])

    @activity.destroy
    render :json => { status: 'Deleted' }
  end

end
