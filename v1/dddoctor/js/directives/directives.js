/* Directives */
var dddoctorDirectives = angular.module('dddoctorDirectives', ['ui.rCalendar']);

dddoctorDirectives.directive('compare', ['$ngModel',function ($ngModel) {
    return {
        link:function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                console.log("viewValue:%s", viewValue);
                console.log("attrs.compare:%s", attrs.compare);
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

dddoctorDirectives.directive('ngScroll', function () {
    return {
        link:function (scope, elm, attrs, ctrl) {
            $(elm).mCustomScrollbar({
                scrollButtons:{
                    enable:true
                }
            });
        }
    };
});

dddoctorDirectives.directive('errSrc', function() {
    return {
        restrict: 'EA',
        replace: true,
        link: function(scope, element, attrs) {
                if (!attrs.ngSrc) {
                    attrs.$set('src', attrs.errSrc);
                };
        }
    }
});

//自定义展开搜索
dddoctorDirectives.directive('ddexpander', function () {
    return {
        restrict : 'EA',
        replace : true,
        transclude : true,
        scope : {
            expanderTitle : '=expanderTitle'
        },
        template : '<div>'
        + '<div class="item item-divider" ng-click="toggle()">{{expanderTitle}}</div>'
        + '<div class="body" ng-show="showMe" ng-transclude></div>'
        + '</div>',
        link : function(scope, element, attrs) {
            scope.showMe = true;
            scope.toggle = function toggle() {
                scope.showMe = !scope.showMe;
            }
        }
    }
});

dddoctorDirectives.directive('star', [function () {
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
        template: '<ul ng-class="getStarCss()" ng-mouseleave="leave(val)"> <a style="font-size: 0.9em;color: #4d4d4d">{{startext}}</a>' +
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
                scope.onHover(val);
            };
            scope.leave = function (val) {
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
