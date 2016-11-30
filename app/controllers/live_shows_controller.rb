class LiveShowsController < ApplicationController
  def index
    @live_shows = LiveShow.order("id DESC").includes(:user)
  end

  def show
    unless current_user
      redirect_to live_shows_path
      flash[:alert] = "請先登入"
    end
    @live_show = LiveShow.find(params[:id])
    @user = @live_show.user
    @live_shows = @user.live_shows
    @question = Question.new
  end

end
