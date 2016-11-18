Rails.application.routes.draw do
  #devise_for :users
  # root :to => "live_shows#index"
  # root :to => "homes#index"
  root :to => "live_shows#index"
  resources :homes do

    collection do

      get :g_index

    end
  end
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  namespace :api, :defaults => { :format => :json } do
    post "login" => "auth#login"
    post "logout" => "auth#logout"
    
resources :users
 resources :live_shows do
   resources :followings
   resources :chats
   resources :questions do
     resources :askings
   end
 end
  end
  resources :users
  resources :live_shows do
    resources :followings
    resources :chats do
      member do
        post :like
        post :unlike
      end
    end
    resources :questions do
      resources :askings
    end
  end
  mount ActionCable.server => "/cable"
  get '/g_index' => 'homes#g_index' , :as => 'g_index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
