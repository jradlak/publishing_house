'use strict';

/* Controllers */

angular.module('publishing_house')
.controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    $scope.logout = function() {
        Auth.logout(function() {
            $location.path('/login');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
}]);

angular.module('publishing_house')
    .controller('MainCtrl',
    ['$rootScope', '$scope', '$translate', function($rootScope, $scope, $translate) {
        $scope.htmlVariable = "test";
        $scope.changeLanguage = function() {
            if ($translate.use() == 'en_EN') {
                $translate.use('pl_PL');
            }
            else {
                $translate.use('en_EN');
            }
        }
    }]);

angular.module('publishing_house')
    .controller('UserCtrl',
    ['$rootScope', '$scope', 'Users', 'Auth', function($rootScope, $scope, Users, Auth) {
        $scope.rememberme = true;
        $scope.user = Auth.user;

        $scope.saveUserData = function() {
            console.log("sejwowanie juzera ;)");
            console.log($scope.user);
        }
    }]);

angular.module('publishing_house')
    .controller('UserDetailsCtrl',
    ['$rootScope', '$scope', 'CurrentUserInfo', function($rootScope, $scope, CurrentUserInfo) {
        $scope.selected_user = {};
        $scope.articles_current = [];
        $scope.initial = function() {
            CurrentUserInfo.getUserAndArticles(CurrentUserInfo.userName, function(currentUser, currentArticles) {
                $scope.selected_user = currentUser;
                $scope.articles_current = currentArticles;
            });
        }
    }]);

angular.module('publishing_house')
    .controller('ArticleCtrl',
    ['$rootScope', '$scope', '$location', 'Users', 'Auth', 'Articles', 'CurrentUserInfo',
        function($rootScope, $scope, $location, Users, Auth, Articles, CurrentUserInfo) {
        $scope.user = Auth.user;
        $scope.article = {};
        $scope.articles = [];

        $scope.addArticle = function() {
            $scope.article.user_name = $scope.user.username;
            Articles.addArticle(
                $scope.article,
                function() {
                    $location.path('/');
                },
                function(err) {
                    $rootScope.error = err;
                });
        }

        $scope.findAllArticles = function() {
            Articles.loadAll(function(res){
                $scope.articles = res;
            });
        }

        $scope.findAllArticlesOfLoggedInUser = function() {
            Articles.getByUserName($scope.user.username, function(res) {
                $scope.articles = res;
            });
        }

        $scope.findAllArticlesByUserName = function(username) {
            Articles.getByUserName(username, function(res) {
                $scope.articles = res;
            });
        }

        $scope.startAllArticles = function() {
            $scope.findAllArticles();
        }

        $scope.showUser = function(username) {
            CurrentUserInfo.userName = username;
            $location.path('/userShowPanel');
        }
    }]);


angular.module('publishing_house')
.controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {
    $scope.rememberme = true;
    $scope.login = function() {
        Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                $location.path('/home');
            },
            function(err) {
                $rootScope.error = "Failed to login";
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
}]);

angular.module('publishing_house')
.controller('RegisterCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;

    $scope.register = function() {
        Auth.register({
                username: $scope.username,
                password: $scope.password,
                role: $scope.role
            },
            function() {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
    };
}]);

angular.module('publishing_house')
.controller('AdminCtrl',
['$rootScope', '$scope', 'Users', 'Auth', function($rootScope, $scope, Users, Auth) {
    $scope.loading = true;
    $scope.userRoles = Auth.userRoles;

    Users.getAll(function(res) {
        $scope.users = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });
}])