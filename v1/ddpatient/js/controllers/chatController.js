/**
 * Created by zjw on 2016/02/21 0026.
 */
var ddChatController = angular.module('ddChatController', ['ionic']);

ddChatController.controller('ChatRoomCtrl',
    ['$scope', '$rootScope', '$ionicActionSheet', '$ionicPopup',
        '$ionicScrollDelegate', '$timeout', '$interval', '$stateParams', '$q', '$filter', '$location', '$ionicHistory', '$rootScope', 'doctorServices', 'userChatService', 'ddUserChatAllServices',function ($scope, $rootScope, $ionicActionSheet, $ionicPopup,
              $ionicScrollDelegate, $timeout, $interval, $stateParams, $q, $filter, $location, $ionicHistory, $rootScope, doctorServices, userChatService, ddUserChatAllServices) {
        var ddUserId = localStorage.getItem('ddUserId');
        $scope.ctrlScope = $scope;
        var currentdate = new Date();
        var nextdate = new Date(currentdate.getTime() - 180 * 86400000);
        var websocket = null;

        function registerServer() {

            var deferred = $q.defer();
            userChatService.get({
                fromId: ddUserId
            }, function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }

        function connect() {

            if ('WebSocket' in window) {
                websocket = new WebSocket("ws://www.yushansoft.com/dingdong/websck");
                console.log("ws://www.yushansoft.com/dingdong/websck");
            } else {
                websocket = new SockJS("http://www.yushansoft.com/dingdong/websck/sockjs");
                console.log("http://www.yushansoft.com/dingdong/websck/sockjs");
            }
            websocket.onopen = function (event) {
                console.log("WebSocket:已连接");
                console.log(event);
            };
            //接收到服务器的数据
            websocket.onmessage = function (event) {
                var data = JSON.parse(event.data);
                vmMsg.msgs.push(data);
                console.log("WebSocket:收到一条消息", data);
            };
            websocket.onclose = function (event) {
                console.log('Info: connection closed.');
                console.log(event);
            };

            websocket.onerror = function (event) {
                console.log("WebSocket:发生错误 ");
                console.log(event);
            };

        }

        function disconnect() {
            if (websocket != null) {
                websocket.close();
                websocket = null;
            }
            if ($rootScope.websocket) {
                $rootScope.websocket.close();
                $rootScope.websocket = null;
            }
        }

        var vmDoctor = $scope.vmDoctor = {
            moredata: true,
            doctors: [],
            pagination: {
                perPage: 30,
                currentPage: 1
            },
            init: function () {
                doctorServices.queryAll({
                    size: vmDoctor.pagination.perPage,
                    page: vmDoctor.pagination.currentPage,
                    orderBy: 'name',
                    order: 'ASC'
                }, function (result) {
                    vmDoctor.doctors = result.doctors;
                    if (result.pages <= vmDoctor.pagination.currentPage + 1) vmDoctor.moredata = false;
                });
            },
            doRefresh: function () {
                $timeout(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                }, 1000);
            },
            loadMore: function () {
                vmDoctor.pagination.currentPage += 1;
                if (vmDoctor.moreDoctors) {
                    doctorServices.queryAll({
                        size: vmDoctor.pagination.perPage,
                        page: vmDoctor.pagination.currentPage,
                        orderBy: 'name',
                        order: 'ASC'
                    }, function (result) {
                        vmDoctor.doctors = vmDoctor.doctors.concat(result.doctors);
                        if (result.pages <= vm.pagination.currentPage + 1) vmDoctor.moredata = false;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    })
                }
            }
        };

        var vmMsg = $scope.vmMsg = {
            moredata: true,
            msgs: [],
            pagination: {
                perPage: 30,
                currentPage: 1
            },
            init: function () {
                ddUserChatAllServices.get({
                    userId: ddUserId,
                    endDate: $filter('date')(nextdate, 'yyyy-MM-dd'),
                    size: vmMsg.pagination.perPage,
                    page: vmMsg.pagination.currentPage
                }, function (result) {
                    vmMsg.msgs = result.msgs;
                    if (result.pages <= vmMsg.pagination.currentPage + 1) vmMsg.moredata = false;
                });
            },
            doRefresh: function () {
                $timeout(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                }, 1000);
            },
            loadMore: function () {
                vmMsg.pagination.currentPage += 1;
                if (vmMsg.moreMsgs && $scope.viewStatus == 1) {
                    ddUserChatAllServices.get({
                        userId: ddUserId,
                        endDate: $filter('date')(nextdate, 'yyyy-MM-dd'),
                        size: vmMsg.pagination.perPage,
                        page: vmMsg.pagination.currentPage
                    }, function (result) {
                        vmMsg.msgs = vmMsg.msgs.concat(result.msgs);
                        if (result.pages <= vmMsg.pagination.currentPage + 1) vmMsg.moredata = false;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
                }
            }
        };

        vmMsg.init();
        vmDoctor.init();

        $scope.showSchedule = function (str) {
            $scope.viewStatus = str;
        };
        $scope.$on('$ionicView.enter', function (e) {
            $scope.viewStatus = 1;
            var promise = registerServer();
            promise.then(function () {
                if (!websocket) {
                    connect();
                }
            }).then(function () {
                $rootScope.websocket = websocket;
            });

            messageCheckTimer = $interval(function () {
            }, 1000);
        });

        $scope.chatIn = function (msg) {
            sessionStorage.setItem('toUserHeadImgUrl', msg.fromUserHeadImgUrl);
            sessionStorage.setItem('toUserId', msg.fromUserId);
            sessionStorage.setItem('toUserName', msg.fromUserName);
            sessionStorage.setItem('endDate', $filter('date')(nextdate, 'yyyy-MM-dd'));
            var url = '/userChat/' + ddUserId + '/' + msg.fromUserId;
            $location.url(url);
        };

        $scope.chatIn_Doctor = function (doctor) {
            sessionStorage.setItem('toUserHeadImgUrl', doctor.headImgUrl);
            sessionStorage.setItem('toUserId', doctor.id);
            sessionStorage.setItem('toUserName', doctor.name);
            sessionStorage.setItem('endDate', $filter('date')(nextdate, 'yyyy-MM-dd'));
            var url = '/userChat/' + ddUserId + '/' + doctor.id;
            $location.url(url);
        };


        $scope.goBack = function () {
            disconnect();
            $ionicHistory.goBack(-1);
        };

        $scope.$on('$ionicView.beforeLeave', function (e) {

        })
    }]);

ddChatController.controller('ChatMessagesCtrl',
    ['$scope', '$rootScope', '$ionicActionSheet', '$ionicPopup',
        '$ionicScrollDelegate', '$timeout', '$interval', '$stateParams', '$q', '$rootScope', 'doctorServices', 'ddUserTwoUserMsgs', 'ddUserReadMsgs',function ($scope, $rootScope, $ionicActionSheet, $ionicPopup,
              $ionicScrollDelegate, $timeout, $interval, $stateParams, $q, $rootScope, doctorServices, ddUserTwoUserMsgs, ddUserReadMsgs) {
        var ddUserId = localStorage.getItem('ddUserId');
        var toId = $stateParams.doctorId;
        var messages = [];
        $scope.messages = messages;
        var txtInput;
        var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
        var websocket = $rootScope.websocket;
        //接收到服务器的数据
        websocket.onmessage = function (event) {
            var data = JSON.parse(event.data);
            $scope.messages.push(data);
            console.log("WebSocket:收到一条消息", data);
        };

        // this could be on $rootScope rather than in $stateParams
        $scope.user = {
            id: ddUserId,
            headImgUrl: 'http://ionicframework.com/img/docs/mcfly.jpg',
            name: 'Marty'
        };

        $scope.toUser = {
            id: sessionStorage.getItem('toUserId'),
            headImgUrl: sessionStorage.getItem('toUserHeadImgUrl'),
            name: sessionStorage.getItem('toUserName')
        };

        $scope.$watch('input.message', function (newValue, oldValue) {
            console.log('input.message $watch, newValue ' + newValue);
        });

        function keepKeyboardOpen() {
            console.log('keepKeyboardOpen');
            txtInput.one('blur', function () {
                console.log('textarea blur, focus back on it');
                txtInput[0].focus();
            });
        }

        ddUserTwoUserMsgs.get({
            fromUserId: sessionStorage.getItem('toUserId'),
            toUserId: ddUserId,
            endDate: sessionStorage.getItem('endDate'),
            size: 30,
            page: 1
        }, function (result) {
            console.log(result);
            angular.forEach(result.msgs, function (data, index, array) {
                $scope.messages.push(data);
            });

        });

        $scope.onMessageHold = function (e, itemIndex, message) {
            console.log('message: ' + JSON.stringify(message, null, 2));
            $ionicActionSheet.show({
                buttons: [{
                    text: '复制信息'
                }, {
                    text: '删除信息'
                }],
                buttonClicked: function (index) {
                    switch (index) {
                        case 0: // Copy Text
                            //cordova.plugins.clipboard.copy(message.text);
                            break;
                        case 1: // Delete
                            $scope.messages.splice(itemIndex, 1);
                            $timeout(function () {
                                viewScroll.resize();
                            }, 0);

                            break;
                    }
                    return true;
                }
            });
        };

        // this prob seems weird here but I have reasons for this in my app, secret!
        $scope.viewProfile = function (msg) {
            if (msg.userId === $scope.user._id) {
                // go to your profile
            } else {
                // go to other users profile
            }
        };

        $scope.sendMessage = function sendMsg() {
            var message = {
                toUserId: toId,
                content: $scope.input.message
            };

            keepKeyboardOpen();

            message.fromUserId = ddUserId;

            websocket.send(JSON.stringify(message));
            $scope.messages.push(message);

            $scope.input.message = '';

            $timeout(function () {
                keepKeyboardOpen();
                viewScroll.scrollBottom(true);
            }, 0);

            $timeout(function () {
                keepKeyboardOpen();
                viewScroll.scrollBottom(true);
            }, 1000);
        };


        $scope.$on('$ionicView.enter', function (e) {

            $timeout(function () {
                footerBar = document.body.querySelector('#userMessagesView .bar-footer');
                scroller = document.body.querySelector('#userMessagesView .scroll-content');
                txtInput = angular.element(footerBar.querySelector('textarea'));
            }, 0);

            messageCheckTimer = $interval(function () {
                // here you could check for new messages if your app doesn't use push notifications or user disabled them
            }, 1000);
        });

        $scope.$on('$ionicView.beforeLeave', function (e) {
            sessionStorage.removeItem('toUserId');
            sessionStorage.removeItem('toUserHeadImgUrl');
            sessionStorage.removeItem('toUserName');
            sessionStorage.removeItem('endDate');
            ddUserReadMsgs.readMsgs({toId: ddUserId}, function (result) {
                console.log('消息已阅！');
            });
        })
    }]);
