'use strict';

angular.module('publishing_house')
.factory('Auth', function($http, $cookieStore){

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

    $cookieStore.remove('user');

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined) {
                role = currentUser.role;
            }

            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            if(user === undefined) {
                user = currentUser;
            }
            return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
        },
        register: function(user, success, error) {
            $http.post('/register', user).success(function(res) {
                changeUser(res);
                success();
            }).error(error);
        },
        login: function(user, success, error) {
            $http.post('/login', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post('/logout').success(function(){
                changeUser({
                    username: '',
                    role: userRoles.public
                });
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
});

angular.module('publishing_house')
    .factory('Users', function($http) {
        return {
            getAll: function(success, error) {
                $http.get('/users').success(success).error(error);
            },
            getUserAvatar : function (userName, success, error) {
                $http.get('/user_avatar',  {params: {username: userName }}).success(success).error(error);
            }
        };
});

angular.module('publishing_house')
    .factory('Articles', function($http) {
        return {
            loadAll : function(success, error) {
                $http.get('/articlesLoad').success(success).error(error);
            },
            getByUserName: function(userName, success, error) {
                $http.get('/articlesByUserName', {params: {username: userName }}).success(success).error(error);
            },
            addArticle: function(article, success, error) {
                $http.post('/article', article).success(function() {
                    success();
                }).error(error);
            }
        };
    });

angular.module('publishing_house')
    .factory('CurrentUserInfo', function($http) {
        var currentUser = {};
        var currentArticles = [];
        return {
           getUserAndArticles : function(userName, success, error) {
                $http.get('/user', {params: {username: userName }}).success(function(res) {
                    currentUser = res;
                    $http.get('/articlesByUserName', {params: {username: userName }}).success(function(res_articles) {
                        currentArticles = res_articles;
                        success(currentUser, currentArticles);
                    }).error(error);
                }).error(error);
           },
           userName : {}
       };
    });