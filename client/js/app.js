'use strict';

angular.module('publishing_house', ['ngCookies', 'ui.router', 'pascalprecht.translate'])

    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$translateProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $translateProvider) {

    var access = routingConfig.accessLevels;

    $translateProvider.translations('en_EN', {
        TITLE: 'Hello',
        CHANGE_LANGUAGE: "Zmień język",
        LOG_IN: "Log in",
        REGISTER: "Register",
        HOME: 'Home page',
        PRIVATE: 'User panel',
        ADMIN: 'Admin panel',
        ARTICLE_LIST: 'Article list',
        WELCOME: 'Welcome',
        FOO: 'This is a paragraph.',
        BUTTON_LANG_EN: 'english',
        BUTTON_LANG_DE: 'german'
    });
    $translateProvider.translations('pl_PL', {
        TITLE: 'Cześć',
        CHANGE_LANGUAGE: "Change language",
        LOG_IN: "Zaloguj",
        REGISTER: "Zarejestruj",
        HOME: 'Strona początkowa',
        PRIVATE: 'Panel użytkownika',
        ADMIN: 'Panel administracyjny',
        ARTICLE_LIST: 'Lista artykułów',
        WELCOME: 'Witaj',
        FOO: 'to jest paragraf',
        BUTTON_LANG_EN: 'angielski',
        BUTTON_LANG_DE: 'polski'
    });

    $translateProvider.preferredLanguage('pl_PL');


    // Public routes
    $stateProvider
        .state('public', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.public
            }
        })
        .state('public.404', {
            url: '/404/',
            templateUrl: '404'
        });

    // Anonymous routes
    $stateProvider
        .state('anon', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.anon
            }
        })
        .state('anon.start', {
            url: '/guest',
            templateUrl: 'start',
            controller: 'ArticleCtrl'
        })
        .state('anon.login', {
            url: '/login/',
            templateUrl: 'login',
            controller: 'LoginCtrl'
        })
        .state('anon.register', {
            url: '/register/',
            templateUrl: 'register',
            controller: 'RegisterCtrl'
        });

    // Regular user routes
    $stateProvider
        .state('user', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.user
            }
        })
        .state('user.start', {
            url: '/',
            templateUrl: 'start',
            controller: 'ArticleCtrl'
        })
        .state('user.home', {
            url: '/home/',
            templateUrl: 'home'
        })
        .state('user.private', {
            abstract: true,
            url: '/private/',
            templateUrl: 'private/layout'
        })
        .state('user.private.userDetails', {
            url: '',
            templateUrl: 'private/userDetails'
        })
        .state('user.private.articleList', {
            url: 'articleList/',
            templateUrl: 'private/articleList'
        })
        .state('user.private.articleDetails', {
            url: 'articleDetails/',
            templateUrl: 'private/articleDetails'
        })
        .state('user.private.admin', {
            url: 'admin/',
            templateUrl: 'private/nestedAdmin',
            data: {
                access: access.admin
            }
        });

    // Admin routes
    $stateProvider
        .state('admin', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.admin
            }
        })
        .state('admin.admin', {
            url: '/admin/',
            templateUrl: 'admin',
            controller: 'AdminCtrl'
        });


    $urlRouterProvider.otherwise('/404');

    // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
    $urlRouterProvider.rule(function($injector, $location) {
        if($location.protocol() === 'file')
            return;

        var path = $location.path()
        // Note: misnomer. This returns a query object, not a search string
            , search = $location.search()
            , params
            ;

        // check to see if the path already ends in '/'
        if (path[path.length - 1] === '/') {
            return;
        }

        // If there was no search string / query params, return with a `/`
        if (Object.keys(search).length === 0) {
            return path + '/';
        }

        // Otherwise build the search string and return a `/?` prefix
        params = [];
        angular.forEach(search, function(v, k){
            params.push(k + '=' + v);
        });
        return path + '/?' + params.join('&');
    });

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(function($q, $location) {
        return {
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    });

}])

.run(['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        if (!Auth.authorize(toState.data.access)) {
            $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
            event.preventDefault();

            // here deciding to open login page first
            if(fromState.url === '^') {
                if(Auth.isLoggedIn()) {
                    $state.go('user.home');
                } else {
                    $rootScope.error = null;
                    $state.go('anon.login');
                }
            }
        }
    });
}]);


