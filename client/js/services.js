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
        }
    };
});

angular.module('publishing_house')
    .factory('Articles', function($http) {
        return {
            loadAll : function(success, error) {
                console.log("Ładowanie artykułów!!!! - serwis");
                $http.get('/articlesLoad').success(success).error(error);
            },
            getAll: function(success, error) {
                $http.get('/articles').success(success).error(error);
            },
            addArticle: function(article, success, error) {
                $http.post('/article', article).success(function() {
                    success();
                }).error(error);
            }
        };
    });

angular.module('publishing_house')
    .factory('translationLoader', function ($http, $q) {
        return function (options) {
            var deferred = $q.defer();
            $http.get('/translation', options.key)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function () {
                    deferred.reject(options.key);
                });

            return deferred.promise;
        };
})
