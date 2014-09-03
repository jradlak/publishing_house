'use strict';

angular.module('publishing_house')
.directive('accessLevel', ['Auth', function(Auth) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var prevDisp = element.css('display')
                , userRole
                , accessLevel;

            $scope.user = Auth.user;
            $scope.$watch('user', function(user) {
                if(user.role)
                    userRole = user.role;
                updateCSS();
            }, true);

            attrs.$observe('accessLevel', function(al) {
                if(al) accessLevel = $scope.$eval(al);
                updateCSS();
            });

            function updateCSS() {
                if(userRole && accessLevel) {
                    if(!Auth.authorize(accessLevel, userRole))
                        element.css('display', 'none');
                    else
                        element.css('display', prevDisp);
                }
            }
        }
    };
}]);

angular.module('publishing_house').directive('activeNav', ['$location', function($location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var anchor = element[0];
            if(element[0].tagName.toUpperCase() != 'A')
                anchor = element.find('a')[0];
            var path = anchor.href;

            scope.location = $location;
            scope.$watch('location.absUrl()', function(newPath) {
                path = normalizeUrl(path);
                newPath = normalizeUrl(newPath);

                if(path === newPath ||
                    (attrs.activeNav === 'nestedTop' && newPath.indexOf(path) === 0)) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });
        }
    };

    function normalizeUrl(url) {
        if(url[url.length - 1] !== '/')
            url = url + '/';
        return url;
    }

}]);

/**
 * The ng-thumb directive
 * @author: nerv
 * @version: 0.1.2, 2014-01-09
 */
angular.module('publishing_house')
.directive('ngThumb', ['$window', function($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}]);
