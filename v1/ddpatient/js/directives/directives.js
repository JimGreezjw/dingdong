/**
 * Created by Administrator on 2015/12/24.
 */
/* Directives */
var ddpatientDirectives = angular.module('ddpatientDirectives', ['ui.rCalendar']);

ddpatientDirectives.directive('compare', ['$ngModel', function ($ngModel) {
    return {
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue == "" || attrs.compare == "" || viewValue == attrs.compare) {
                    ctrl.$setValidity('compare', true);
                } else {
                    ctrl.$setValidity('compare', false);
                }
                return viewValue;
            });
        }
    };
}]);

ddpatientDirectives.directive('ngScroll', [function () {
    return {
        link: function (scope, elm, attrs, ctrl) {
            $(elm).mCustomScrollbar({
                scrollButtons: {
                    enable: true
                }
            });
        }
    };
}]);
//自定义展开
ddpatientDirectives.directive('ddexpander', [function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            expanderTitle: '=expanderTitle'
        },
        template: '<div>'
        + '<div class="item item-divider" ng-click="toggle()">{{expanderTitle}}</div>'
        + '<div class="body" ng-show="showMe" ng-transclude></div>'
        + '</div>',
        link: function (scope, element, attrs) {
            scope.showMe = true;
            scope.toggle = function toggle() {
                scope.showMe = !scope.showMe;
            }
        }
    }
}]);
//没用图标时使用默认图标
ddpatientDirectives.directive('errSrc', [function () {
    return {
        restrict: 'EA',
        replace: true,
        link: function (scope, element, attrs) {
            if (!attrs.ngSrc) {
                attrs.$set('src', attrs.errSrc);
            }
        }
    }
}]);
//自定义返回Button
ddpatientDirectives.directive('ddbackbutton', ['$ionicHistory', function ($ionicHistory) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        template: '<a  class="button button-icon icon ion-chevron-left" ng-click="goBack()"></a>',
        link: function (scope, element, attrs, ctrl) {
            scope.goBack = function () {
                $ionicHistory.goBack(-1);
            }
        }
    }
}]);
ddpatientDirectives.directive('hscroller', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        template: '<div class="hscroller" ng-transclude></div>',
        replace: true,
        transclude: true,
        compile: function (element, attr) {
            return function ($scope, $element, $attr) {
                var el = $element[0];
                angular.element($element).bind("scroll", function () {
                    var left = $element[0].scrollLeft;
                    // console.log($element.childNodes);
                });
            }
        }
    }
}]);

ddpatientDirectives.directive('hcard', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'E',
        template: '<div class="hscroller-card" ng-transclude></div>',
        replace: true,
        transclude: true,
        scope: {
            desc: '@',
            level: '@',
            location: '@',
            image: '@',
            index: '@',
            href: '@'
        },
        link: function (scope, element, attrs) {
            var img = angular.element('<a href="' + attrs.href + '" style="padding-left: 22px"> <img class="hscroller-img" src="' + attrs.image + '"/></a>');
            element.append(img);
            element.append('<div class="hscroller-label">' + attrs.desc + attrs.level + '<br>' + attrs.location + '</div>');
        }
    }
}]);

ddpatientDirectives.directive('stringToNumber', [function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                return '' + value;
            });
            ngModel.$formatters.push(function (value) {
                return parseInt(value);
            });
        }
    };
}]);

ddpatientDirectives.directive('star', [function () {
    return {
        restrict: 'EACM',
        scope: {
            ratingValue: '=',
            max: '=',
            readonly: '@',
            onHover: '=',
            onLeave: '=',
            starstyle: '@',
            starrealstyle:'@',
            startext: '@'
        },
        template: '<ul ng-class="getStarCss()" ng-mouseleave="leave(val)"> <a style="font-size: 0.6em;color: #4d4d4d">{{startext}}</a>' +
        '<li ng-repeat="star in stars" style="margin:1px;display:inline;cursor:pointer;"   ng-class="star" ng-click="click($index + 1)" ng-mouseover="over($index + 1)"   >' +
        '★' +
        '</li>' +
        '</ul>',
        link: function (scope, elem, attrs,ctrl) {
            elem.css("text-align", "center");
            scope.ratingValue = scope.ratingValue || 0;
            scope.starstyle = scope.starstyle || 'rating';
            scope.startext = scope.startext || '';
            scope.max = scope.max || 5;
            scope.starrealstyle = scope.starrealstyle || 'starsmall';
            scope.click = function (val) {
                if (scope.readonly && scope.readonly === 'true') {
                    return;
                }
                scope.ratingValue = val;
            };
            scope.over = function (val) {
                if (scope.readonly && scope.readonly === 'true') {
                    return;
                }
                scope.onHover(val);
            };
            scope.leave = function (val) {
                if (scope.readonly && scope.readonly === 'true') {
                    return;
                }
                scope.onLeave(val);
            };
            scope.getStarCss = function () {
                return scope.starstyle;
            };
            scope.getRealStar = function () {
                return scope.starrealstyle;
            };
            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };
            updateStars();

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
            scope.$watch('max', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    };
}]);
