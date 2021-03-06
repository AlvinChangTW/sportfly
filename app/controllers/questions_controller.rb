class QuestionsController < ApplicationController
	before_action :set_live_show,only:[:show, :like, :unlike]
  # GET /questions
  # GET /questions.json
  def index
    @questions = Question.all
  end

  # GET /questions/1
  # GET /questions/1.json
  def show
    # @love = current_user.loves.find_by_question_id(params[:id])
    @live_show = LiveShow.find_by(id: params[:id])
  end

  # GET /questions/new
  def new
    @question = Question.new
  end

  # GET /questions/1/edit
  def edit
  end

  # POST /questions
  # POST /questions.json
  def create
    @user=current_user
    @question = Question.new(question_params)
    @question.user_id = current_user.id
    # @asking = current_user.askings.all
    #@asking = Question.includes(:askings).find_by(id: params[:id])
    # @question = current_user.questions.new(question_params)
    @question.live_show_id = params[:live_show]
    respond_to do |format|
      if @question.save
        format.html { redirect_to @question, notice: 'question was successfully created.' }
        format.json { render :show, status: :created, location: @question }
        format.js {
          ActionCable.server.broadcast("public_room", { :type => "submit_comment", :question => @question, :user => @user } )
          #render :nothing => true
          render :text => '$("#content").val("");';
        }
        
      else
        format.html { render :new }
        format.json { render json: @question.errors, status: :unprocessable_entity }
        format.js{
          # render :text => "alert('請輸入文字！！');"
        }
      end
    end
  end

  # PATCH/PUT /questions/1
  # PATCH/PUT /questions/1.json
  def update
    respond_to do |format|
      if @question.update(question_params)
        format.html { redirect_to @question, notice: 'question was successfully updated.' }
        format.json { render :show, status: :ok, location: @question }
      else
        format.html { render :edit }
        format.json { render json: @question.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /questions/1
  # DELETE /questions/1.json
  def destroy
    @question.destroy
    respond_to do |format|
      format.html { redirect_to questions_url, notice: 'question was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  # def like
  #   puts "you_are_like"
  #   @like = current_user.likes.build(:question_id => params[:id])
  #   raise
  #   @like.save
  #   respond_to do |format|
  #     format.html do
  #       redirect_to live_show_path(:id => @live_show.id)
  #     end
  #     format.json do
  #       render :json=> {:message => "ok"}
  #     end
  #   end
  # end

  # def unlike
  #   puts "you_are_like"
  #   @like = current_user.likes.find_by_question_id(params[:id])
  #   @like.destroy
  #   respond_to do |format|
  #     format.html do
  #       redirect_to live_show_path(:id => @live_show.id)
  #     end
  #     format.json do
  #       render :json=> {:message => "ok"}
  #     end
  #   end

  # end

  private
    # Use callbacks to share common setup or constraints between actions.
    # def set_question
    #   @question = question.find(params[:id])
    # end
    def set_live_show
      @live_show = LiveShow.find(params[:live_show_id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def question_params
      params.require(:question).permit(:subject, :user_id, :live_show_id)
    end
end
