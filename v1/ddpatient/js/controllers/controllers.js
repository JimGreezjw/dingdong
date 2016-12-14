var ddpatientControllers = angular.module('ddpatientControllers', ['ionic-datepicker', 'ngCookies']);

ddpatientControllers.config(['$compileProvider', function ($compileProvider) {

    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|http|weixin):/);
}
]);

ddpatientControllers.controller('MainCtrl', ['$scope', '$rootScope', '$location', '$cookies', '$cookieStore', '$ionicLoading', '$timeout', 'userFansServices', 'ddJsConfig', 'getRegisterByStatusServices', 'ddUserServices', 'userQueueServices', 'doctorServices', 'registerUnFinishedServices', 'userInforList', 'doctorNewJoinServices', function ($scope, $rootScope, $location, $cookies, $cookieStore, $ionicLoading, $timeout, userFansServices, ddJsConfig, getRegisterByStatusServices, ddUserServices, userQueueServices, doctorServices, registerUnFinishedServices, userInforList, doctorNewJoinServices) {

        (function () {
            var url = window.location.href;
            url = url.substring(0, url.indexOf("#"));
            ddJsConfig.jsConfig({url: url}, function (ret) {
                var config = ret;
                wx.config({
                    debug: false,
                    appId: config.appId,
                    timestamp: config.timestamp,
                    nonceStr: config.nonceStr,
                    signature: config.signature,
                    jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'chooseWXPay']
                });
            })
        })();
        var ddUserId = $scope.ddUserId = $cookies.get('userId');
        $scope.ctrlScope = $scope;

        if (!userInforList.hasOwnProperty('userId')) {
            userInforList.userId = ddUserId;
        }
        ;

        userFansServices.get({
            id: ddUserId
        }, function (result) {
            userInforList.fanDoctorList = result.doctors;
        });

        $scope.$on('$ionicView.enter', function (e) {


        });

        $scope.search = function () {
            var urlPath;
            urlPath = '/doctorList';
            $location.url(urlPath);
        }

    }])
    .controller('TabsCtrl', ['$scope', '$rootScope', '$timeout', '$interval', 'userInforList', 'ddUserServices', function ($scope, $rootScope, $timeout, $interval, userInforList, ddUserServices) {
    }])
    .controller('accountCtrl', ['$scope', '$rootScope', '$timeout', '$interval', 'doctorUtils', 'userQueueServices', 'getRegisterByStatusServices', 'getRegisterByStatusServices', 'userInforList', 'ddUserServices', function ($scope, $rootScope, $timeout, $interval, doctorUtils, userQueueServices, getRegisterByStatusServices, getRegisterByStatusServices, userInforList, ddUserServices) {

        var ddUserId;
        if (userInforList.hasOwnProperty('userId')) {
            ddUserId = userInforList.userId;
        } else {
            ddUserId = doctorUtils.getCookies('userId');
            userInforList.userId = ddUserId;
        }
        ;
        $scope.ctrlScope = $scope;
        var getUserInfor = function () {
            if (ddUserId) {
                ddUserServices.get({userId: ddUserId}, function (result) {
                    var user = result.users[0];
                    if (user) {
                        $scope.user = result.users[0];
                        $scope.ctrlScope.name = user.name;
                        $scope.ctrlScope.balance = user.balance;
                        $scope.ctrlScope.score = user.score;
                        $scope.ctrlScope.address = user.address;
                        $scope.ctrlScope.gender = user.gender;
                        $scope.ctrlScope.phone = user.phone;
                        $scope.ctrlScope.certificateId = user.certificateId;
                        $scope.ctrlScope.headImgUrl = user.headImgUrl;
                        $scope.ctrlScope.phoneOld = user.phone;
                    }
                });
            }

        };
        //取得病人的排队信息
        var getRegisterStatus_Minus = function () {
            if (ddUserId) {
                getRegisterByStatusServices.get({userId: ddUserId, status: -1}, function (result) {
                    userInforList.queues = result.registers;
                    $scope.queuesCount = userInforList.queues.length;
                })
            }
        };

        //取得病人未完成的已经预约的信息
        var getRegisterStatus_One = function () {
            if (ddUserId) {
                getRegisterByStatusServices.getRegisterByStatus({userId: ddUserId, status: 1}, function (result) {
                    userInforList.registers = result.registers;
                    $scope.registerCount = userInforList.registers.length;
                })
            }
        };
        var getRegisterStatus_Three = function () {
            if (ddUserId) {
                getRegisterByStatusServices.getRegisterByStatus({userId: ddUserId, status: 3}, function (result) {
                    userInforList.needEvaluation = result.registers;
                    $scope.needEvaluationCount = userInforList.needEvaluation.length;
                })
            }
        };
        var getRegisterStatus_Five = function () {
            if (ddUserId) {
                getRegisterByStatusServices.getRegisterByStatus({userId: ddUserId, status: 5}, function (result) {
                    userInforList.registersHistorys = result.registers;
                    $scope.registerHistoryCount = userInforList.registersHistorys.length;
                })
            }
        };

        $scope.$on('$ionicView.enter', function (e) {
            getUserInfor();
            getRegisterStatus_Minus();
            //getRegisterStatus_Zero();
            getRegisterStatus_One();
            getRegisterStatus_Three();
            getRegisterStatus_Five();
        });
        $scope.doRefresh = function () {
            $timeout(function () {
                getUserInfor();
                getRegisterStatus_Minus();
                //getRegisterStatus_Zero();
                getRegisterStatus_One();
                getRegisterStatus_Three();
                getRegisterStatus_Five();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000)
        };
    }])

    .controller('DoctorsCtrl', ['$scope', '$rootScope', '$ionicPopover', '$location', '$timeout', '$ionicHistory', 'doctorServices', 'ddGetDoctorsByNameOrSpecialty', 'ddGetDoctorsByNameOrSpecialty', 'userFansServices', 'userInforList', function ($scope, $rootScope, $ionicPopover, $location, $timeout, $ionicHistory, doctorServices, ddGetDoctorsByNameOrSpecialty, ddGetDoctorsByNameOrSpecialty, userFansServices, userInforList) {
        $scope.ctrlScope = $scope;
        var ddUserId = userInforList.userId;
        //叮咚名医列表
        $scope.$on('$ionicView.enter', function (e) {

        });
        var getDoctors = function () {
            doctorServices.queryAll({
                size: '10000', page: '1', orderBy: 'name', order: 'ASC'
            }, function (result) {
                $scope.doctors = result.doctors;
            });
        };
        getDoctors();
        $scope.doRefresh = function () {
            $timeout(function () {
                getDoctors();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000)
        };
        $scope.getHospital = function (doctor) {
            userInforList.doctor = doctor;
            var url = '#/doctorHospitals/' + doctor.id;
            $location.url(url);
        };
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
    }])
    .controller('DoctorDeptListCtrl', ['$scope', '$rootScope', '$ionicPopover', '$location', '$timeout', '$ionicHistory', '$stateParams','doctorServices', 'ddGetDoctorsByNameOrSpecialty', 'ddGetDoctorsByNameOrSpecialty', 'userFansServices', 'userInforList', 'topDeptServices', 'doctorDeptDoctorsServices', function ($scope, $rootScope, $ionicPopover, $location, $timeout, $ionicHistory, $stateParams,doctorServices, ddGetDoctorsByNameOrSpecialty, ddGetDoctorsByNameOrSpecialty, userFansServices, userInforList, topDeptServices, doctorDeptDoctorsServices) {
        $scope.ctrlScope = $scope;
        var ddUserId = userInforList.userId;
        var deptId=$stateParams.deptId;

        $scope.$on('$ionicView.enter', function (e) {

        });

        var getDeptDoctors=function(){
            doctorDeptDoctorsServices.get({
                id: deptId
            }, function (result) {
                if (result.responseDesc == 'OK'){
                    $scope.doctors = result.doctors;
                }
            });
        };
        getDeptDoctors();
        $scope.doRefresh = function () {
            $timeout(function () {
                getDeptDoctors();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000)
        };
        $scope.getHospital = function (doctor) {
            userInforList.doctor = doctor;
            var url = '#/doctorHospitals/' + doctor.id;
            $location.url(url);
        };
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
    }])

    .controller('deptListAllCtrl', ['$scope', '$rootScope', '$ionicPopover', '$location', '$timeout', '$ionicHistory', '$stateParams','doctorServices', 'ddGetDoctorsByNameOrSpecialty', 'ddGetDoctorsByNameOrSpecialty', 'userFansServices', 'userInforList', 'topDeptServices', 'subDeptServices',function ($scope, $rootScope, $ionicPopover, $location, $timeout, $ionicHistory, $stateParams,doctorServices, ddGetDoctorsByNameOrSpecialty, ddGetDoctorsByNameOrSpecialty, userFansServices, userInforList, topDeptServices,subDeptServices) {
        $scope.ctrlScope = $scope;
        var ddUserId = userInforList.userId;

        $scope.$on('$ionicView.enter', function (e) {

        });

        var getAllDepts=function(){
            topDeptServices.get({}, function (result) {
                if (result.responseDesc == 'OK'){
                    $scope.depts = result.depts;
                }
            });
        };
        getAllDepts();
        getSubDepts=$scope.getSubDepts=function (key,deptId) {
            $scope.selectedIndex = key;
            subDeptServices.get({
                parentId:deptId
            },function (result) {
                if (result.responseDesc == 'OK'&& result.depts.length>0){
                    $scope.subDepts = result.depts;
                }else{
                    var urlPath;
                    urlPath = '/doctorDeptList/'+deptId;
                    $location.url(urlPath);
                }
            });
        };
        getSubDepts(0,1);
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
    }])

    .controller('DoctorsSearchListCtrl', ['$scope', '$rootScope', '$stateParams', '$ionicPopover', '$location', '$ionicHistory', '$timeout', 'ddGetDoctorsByNameOrSpecialty', 'userFansServices', 'userInforList', function ($scope, $rootScope, $stateParams, $ionicPopover, $location, $ionicHistory, $timeout, ddGetDoctorsByNameOrSpecialty, userFansServices, userInforList) {

        $scope.ctrlScope = $scope;
        var ddUserId = userInforList.userId;
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
        //叮咚名医列表
        $scope.$on('$ionicView.enter', function (e) {


        });
        $scope.viewStatus = 1;
        var vm = $scope.vm = {
            doctors: [],
            pagination: {
                perPage: 15,
                currentPage: 1
            },
            search: function () {
                ddGetDoctorsByNameOrSpecialty.getDoctorsByNameOrSpecialty({
                    filterText: vm.query,
                    size: vm.pagination.perPage,
                    page: vm.pagination.currentPage,
                    orderBy: 'name',
                    order: 'ASC'
                }, function (result) {
                    if (result.doctors.length > 0) {
                        vm.doctors = result.doctors;
                        $scope.viewStatus = 2;
                    }
                })
            }
        };
    }])

    .controller('DoctorsFanCtrl', ['$scope', '$rootScope', '$ionicPopup', '$ionicPopover', '$timeout', '$stateParams', 'userFansServices', 'userInforList', function ($scope, $rootScope, $ionicPopup, $ionicPopover, $timeout, $stateParams, userFansServices, userInforList) {
        //用户关注的医生列表
        var ddUserId = userInforList.userId;
        $scope.doctors = [];
        $scope.$on('$ionicView.enter', function (e) {
            $scope.doctors = userInforList.fanDoctorList;
        });
        var showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
            });
        };
        $scope.remove = function (doctor) {

            var message = '<h4 style=" text-align:center;">' + doctor.name + '<br/>' + doctor.hospitalName + '</h4>';
            var confirmPopup = $ionicPopup.confirm({
                title: '<h4 >确认取消关注吗？</h4>',
                template: message,
                cancelText: '取消',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    userFansServices.remove({id: ddUserId, doctorId: doctor.id}, function (result) {
                        var newFanDoctorList = userInforList.fanDoctorList.filter(function (item, index, array) {
                            return item.id != doctor.id;
                        });
                        userInforList.fanDoctorList = newFanDoctorList;
                        $scope.doctors = userInforList.fanDoctorList;
                    });
                }
            });
        };
    }])

    .controller('DoctorDetailCtrl', ['$scope', '$rootScope', '$ionicHistory', '$location', '$stateParams', '$filter', '$ionicPopup', 'scheduleServices', 'dateFilter', 'ddGetDoctorQueuesServices', 'doctorServices', 'ddGetDoctorScheduleDateServices', 'doctorInforList', 'scheduleOnedayServices', 'ddUserServices', 'scheduleUserServices', 'userInforList', function ($scope, $rootScope, $ionicHistory, $location, $stateParams, $filter, $ionicPopup, scheduleServices, dateFilter, ddGetDoctorQueuesServices, doctorServices, ddGetDoctorScheduleDateServices, doctorInforList, scheduleOnedayServices, ddUserServices, scheduleUserServices, userInforList) {

        var ddUserId = userInforList.userId;
        $scope.viewStatus = 1;
        var schduleDateList = $scope.schduleDateList = [];
        schduleDateList = $scope.schduleDateList = doctorInforList.schduleDateList;
        var schduleList;

        doctorServices.queryAll({id: $stateParams.doctorId}, function (result) {
            $scope.doctor = (result.doctors)[0];
        });
        $scope.scheduleShow = false;

        var currentdate = new Date();
        var nextdate = new Date(currentdate.getTime() + 60 * 86400000);
        $scope.calendar = {};
        $scope.calendar.mode = 'month';

        scheduleOnedayServices.query({
            doctorId: $stateParams.doctorId,
            hospitalId: $stateParams.hospitalId,
            beginDate: $filter('date')(currentdate, 'yyyy-MM-dd'),
            endDate: $filter('date')(nextdate, 'yyyy-MM-dd')
        }, function (result) {
            $scope.schduleDateList = result.schedules;
            if (result.schedules > 0) {
                angular.forEach($scope.schduleDateList, function (data, index, array) {
                    $scope.schduleDateList[index].buttonValue = "预约";
                });
            }
        });

        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };

        $scope.$on('$ionicView.enter', function (e) {

        });

        $scope.onTimeSelected = function (selectedTime) {
            var selectedDate = dateFilter(selectedTime, 'yyyy-MM-dd');
            //医生在某一天内可预约的情况
            scheduleOnedayServices.query({
                doctorId: $stateParams.doctorId,
                hospitalId: $stateParams.hospitalId,
                beginDate: selectedDate,
                endDate: selectedDate
            }, function (result) {
                schduleList = $scope.schduleList = result.schedules;
                if (schduleList.length > 0) {
                    $scope.scheduleShow = true;
                    angular.forEach($scope.schduleList, function (data, index, array) {
                        $scope.schduleList[index].buttonValue = "预约";
                    });
                }
            });
        };

        $scope.showSchedule = function (str) {
            $scope.viewStatus = str;
        };

        var showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3 align="center">' + str + '</h3>',
                buttons: [
                    {
                        text: '确定',
                        type: 'button'
                    }]
            });
            alertPopup.then(function (res) {
            });
        };

        //弹出确认对话框
        $scope.showConfirm = function (str, scheduleId, scheduleDate, doctorId) {

            scheduleUserServices.getScheduleUser({
                userId: ddUserId,
                scheduleId: scheduleId
            }, function (result) {
                $scope.registerSchedule = result.registers[0];
                if (result.registers[0]) {
                    showQueue("您已经预约过了，请勿重复预约！");
                } else {
                    var url = '/newpatient/' + scheduleId + '/' + doctorId + "/registerNew";
                    $location.url(url);
                }
            });
        };
    }])

    .controller('DoctorInforCtrl', ['$scope', '$ionicPopup', '$rootScope', '$ionicHistory', '$location', '$stateParams', '$filter', 'doctorUtils', 'dateFilter', 'ddDoctorHospitalsServices', 'doctorServices', 'userFansServices', 'userInforList', 'showPopupServices', 'ddDoctorEvaluationsServices', function ($scope, $ionicPopup, $rootScope, $ionicHistory, $location, $stateParams, $filter, doctorUtils, dateFilter, ddDoctorHospitalsServices, doctorServices, userFansServices, userInforList, showPopupServices, ddDoctorEvaluationsServices) {
        var fanDoctorList = [];
        var doctor;
        var ddUserId;
        if (userInforList.hasOwnProperty('userId')) {
            ddUserId = userInforList.userId;
        } else {
            ddUserId = doctorUtils.getCookies('userId');
            userInforList.userId = ddUserId;
        }
        ;

        var wxConfigCheck = false;

        wx.ready(function (res) {
            wxConfigCheck = true;
        });

        if (!wxConfigCheck) {
            doctorUtils.wxInit();
        }
        ;

        var fanDoctorCheck = function () {
            if (userInforList.fanDoctorList) {
                fanDoctorList = userInforList.fanDoctorList;
                if (fanDoctorList) {
                    if (fanDoctorList.length > 0) {
                        fanDoctorList.forEach(function (item, index, array) {
                            if (item.id == $stateParams.doctorId) {
                                $scope.custom = true;
                            }
                        });
                    }
                }
            } else {
                $scope.custom = false;
            }
        };

        if (!userInforList.hasOwnProperty('fanDoctorList')) {
            userFansServices.get({
                id: ddUserId
            }, function (result) {
                userInforList.fanDoctorList = result.doctors;
                fanDoctorCheck();
            });
        } else {
            fanDoctorCheck();
        }
        ;

        var getDoctorInfor = function () {
            doctorServices.queryAll({id: $stateParams.doctorId}, function (result) {
                doctor = $scope.doctor = (result.doctors)[0];

                $scope.doctors = result.doctors;

                var shareObject = {
                    title: "为您推荐一个好大夫： " + doctor.name, // 分享标题
                    desc: doctor.hospitalName + " " + doctor.deptName + " " + doctor.level + " " + doctor.teacherLevel + "  擅长：" + doctor.specialty,
                    link: 'http://www.yushansoft.com/dingdong/v1/ddpatient/index.html#/doctors/' + doctor.id + '/doctorInforShare', // 分享链接
                    imgUrl: doctor.headImgUrl, // 分享图标
                    success: function () {

                    },
                    cancel: function () {

                    },
                    fail: function (res) {
                        alert("分享失败，请重新尝试");
                    }
                };

                wx.ready(function () {
                    wx.onMenuShareTimeline(shareObject);
                    wx.onMenuShareAppMessage(shareObject);
                });

                ddDoctorHospitalsServices.getDoctorHospitals({
                    doctorId: $stateParams.doctorId,
                    status: 1
                }, function (result) {
                    $scope.doctor.hospitals = result.doctorHospitals;
                });
            });
        };


        var getDoctorEvaluation = function () {
            ddDoctorEvaluationsServices.getDoctorEvaluations({
                doctorId: $stateParams.doctorId,
                size: 3,
                page: 1,
                order: 'createTime',
                orderBy: 'DESC'
            }, function (result) {
                if (result.doctorEvals && result.doctorEvals.length > 0) {
                    $scope.doctorEvals = result.doctorEvals;
                }
            })
        };
        getDoctorInfor();
        getDoctorEvaluation();

        $scope.$on('$ionicView.enter', function (e) {
            fanDoctorCheck();
        });
        $scope.goBack = function () {
            if ($ionicHistory.viewHistory().backView) {
                $ionicHistory.goBack(-1);
            } else {
                $location.url('/tab/main');
            }
            $ionicHistory.goBack(-1);
        };

        $scope.doctorFan = function () {
            userFansServices.save({id: ddUserId, doctorId: $stateParams.doctorId}, function (result) {
                if (result.responseDesc == 'OK') {
                    userInforList.fanDoctorList.push((result.doctors)[0]);
                }
                $scope.custom = $scope.custom === false ? true : false;
            })
        };

        $scope.delFan = function () {
            userFansServices.remove({id: ddUserId, doctorId: $stateParams.doctorId}, function (result) {
                if (result.responseDesc == 'OK') {
                    var fandoctorList = userInforList.fanDoctorList.filter(function (item, index, array) {
                        return item.id != $stateParams.doctorId;
                    });
                    userInforList.fanDoctorList = fandoctorList;
                }
                $scope.custom = $scope.custom === false ? true : false;
            })
        };
        $scope.registerDoc = function () {
            userInforList.doctor = doctor;
            var url = '/doctorHospitals/' + doctor.id;
            $location.url(url);
        }

        //弹出确认对话框
        $scope.shareFriends = function () {
            showPopupServices.showAlert('推荐医生', '<h4 style=" text-align:center;">' + "请点击 微信右上角 将" + doctor.name + "大夫推荐给好朋友吧！" + '</h4>');
        };

    }])

    .controller('DoctorInforShareCtrl', ['$scope', '$ionicPopup', '$rootScope', '$ionicHistory', '$location', '$stateParams', '$filter', 'doctorUtils', 'dateFilter', 'ddDoctorHospitalsServices', 'doctorServices', 'userFansServices', 'userInforList', 'showPopupServices', 'ddDoctorEvaluationsServices', function ($scope, $ionicPopup, $rootScope, $ionicHistory, $location, $stateParams, $filter, doctorUtils, dateFilter, ddDoctorHospitalsServices, doctorServices, userFansServices, userInforList, showPopupServices, ddDoctorEvaluationsServices) {
        var ddUserId;
        if (userInforList.hasOwnProperty('userId')) {
            ddUserId = userInforList.userId;
        } else {
            ddUserId = doctorUtils.getCookies('userId');
            userInforList.userId = ddUserId;
        }
        ;

        doctorUtils.wxInit();

        var fanDoctorList;

        var fanDoctorCheck = function () {
            if (userInforList.fanDoctorList) {
                fanDoctorList = userInforList.fanDoctorList;
                if (fanDoctorList) {
                    if (fanDoctorList.length > 0) {
                        fanDoctorList.forEach(function (item, index, array) {
                            if (item.id == $stateParams.doctorId) {
                                $scope.custom = true;
                            }
                        });
                    }
                }
            } else {
                $scope.custom = false;
            }
        };

        if (!userInforList.hasOwnProperty('fanDoctorList')) {
            userFansServices.get({
                id: ddUserId
            }, function (result) {
                userInforList.fanDoctorList = result.doctors;
                fanDoctorCheck();
            });
        } else {
            fanDoctorCheck();
        }
        ;

        var getDoctorInfor = function () {
            doctorServices.queryAll({id: $stateParams.doctorId}, function (result) {
                var doctor = $scope.doctor = (result.doctors)[0];
                var shareObject = {
                    title: "为您推荐一个好大夫： " + doctor.name, // 分享标题
                    desc: doctor.hospitalName + " " + doctor.deptName + " " + doctor.level + " " + doctor.teacherLevel + "  擅长：" + doctor.specialty,
                    link: 'http://www.yushansoft.com/dingdong/v1/ddpatient/index.html#/doctors/' + doctor.id + '/doctorInforShare', // 分享链接
                    imgUrl: doctor.headImgUrl, // 分享图标
                    success: function () {

                    },
                    cancel: function () {

                    },
                    fail: function (res) {
                        alert("分享失败，请重新尝试");
                    }
                };

                wx.ready(function () {
                    wx.onMenuShareTimeline(shareObject);
                    wx.onMenuShareAppMessage(shareObject);
                });
                $scope.doctors = result.doctors;
                ddDoctorHospitalsServices.getDoctorHospitals({
                    doctorId: $stateParams.doctorId,
                    status: 1
                }, function (result) {
                    $scope.doctor.hospitals = result.doctorHospitals;
                });
            });
        };

        var getDoctorEvaluation = function () {
            ddDoctorEvaluationsServices.getDoctorEvaluations({
                doctorId: $stateParams.doctorId,
                size: 3,
                page: 1,
                order: 'createTime',
                orderBy: 'DESC'
            }, function (result) {
                if (result.doctorEvals && result.doctorEvals.length > 0) {
                    $scope.doctorEvals = result.doctorEvals;
                }
            })
        };
        getDoctorInfor();
        getDoctorEvaluation();

    }])


    .controller('newPatientCtrl', ['$scope', 'dateFilter', '$location', '$ionicHistory', '$ionicPopup', '$stateParams', '$q', 'doctorUtils', 'userInforList', 'ddJsConfig', 'ddAddYusFilesServices', 'ddUserServices', 'yusFilesServices', 'ddUserDirectRegisterServices', 'getRegisterByIdServices', 'userNewQueueServices', 'getRegisterByStatusServices', 'registerUpdateServices', 'showPopupServices', 'userInforList', function ($scope, dateFilter, $location, $ionicHistory, $ionicPopup, $stateParams, $q, doctorUtils, userInforList, ddJsConfig, ddAddYusFilesServices, ddUserServices, yusFilesServices, ddUserDirectRegisterServices, getRegisterByIdServices, userNewQueueServices, getRegisterByStatusServices, registerUpdateServices, showPopupServices, userInforList) {
        var ddUserId;
        if (userInforList.hasOwnProperty('userId')) {
            ddUserId = userInforList.userId;
        } else {
            ddUserId = doctorUtils.getCookies('userId');
            userInforList.userId = ddUserId;
        }
        ;

        var wxConfigCheck = false;

        wx.ready(function (res) {
            wxConfigCheck = true;
        });

        if (!wxConfigCheck) {
            doctorUtils.wxInit();
        }
        ;
        var currentDate = sessionStorage.getItem('currentDate');
        $scope.ctrlScope = $scope;
        $scope.ctrlScope.agree = true;
        var data = new Date();
        $scope.title = "预约";
        $scope.revisitList = [{"name": "否", "value": "N"}, {"name": "是", "value": "Y"}];
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };

        $scope.scheduleDate = $stateParams.scheduleDate;
        $scope.doctorId = $stateParams.doctorId;
        var pageStatus = $scope.pageStatus = $stateParams.type;
        var yusFiles = [];
        $scope.yusFiles = yusFiles;
        var upDateId = sessionStorage.getItem('registerId');
        sessionStorage.removeItem('registerId');

        var updateInit = function () {
            if (pageStatus == 'registerUpdate') {
                $scope.ctrlScope.name = userInforList.register.patientName;
                $scope.ctrlScope.phenomenon = userInforList.register.phenomenon;
                $scope.ctrlScope.attachNo = userInforList.register.attachNo;
                $scope.ctrlScope.revisit = userInforList.register.revisit;
            } else if (pageStatus == 'queueUpdate') {
                $scope.ctrlScope.name = userInforList.queue.patientName;
                $scope.ctrlScope.phenomenon = userInforList.queue.phenomenon;
                $scope.ctrlScope.attachNo = userInforList.queue.attachNo;
                $scope.ctrlScope.revisit = userInforList.queue.revisit;
            }

            $scope.ctrlScope.attatchNo = '';

            getRegisterByIdServices.get({id: upDateId}, function (result) {
                TTregister = result.registers[0];
                if (TTregister) {
                    var files = TTregister.attachUrls;
                    $scope.ctrlScope.attatchNo = TTregister.attatchNo;
                    if (files != null && files != "") {
                        var str = [];
                        files = files.split(",");
                        $scope.yusFiles = yusFiles = files;
                    } else {
                        $scope.yusFiles = null;
                    }

                }
            });

        };

        switch (pageStatus) {
            case 'queueNew':
                $scope.title = "排队";
                break;
            case 'queueUpdate':
                $scope.title = "排队";
                updateInit();
                break;
            case 'registerNew':
                $scope.title = "预约";
                break;
            case 'registerUpdate':
                $scope.title = "预约";
                updateInit();
                break;
            default :
                break;
        }

        $scope.getUserPatient = function () {
            var urlPath = "/userPatientMain/main";
            $location.url(urlPath);
        };

        var fn = function (msg) {
            var deffer = $q.defer();
            deffer.resolve(msg);
            return deffer.promise;
        };

        var upload = function (localId) {
            wx.uploadImage({
                localId: localId,
                isShowProgressTips: 1,
                success: function (res) {
                    fn(res).then(function (res) {
                        var serverId = res.serverId;
                        ddAddYusFilesServices.save({}, {
                            "userId": userId,
                            "wxServerId": serverId
                        }, function (result) {
                            if ("OK" == result.responseDesc) {
                                var fileId = result.yusFiles[0].id;
                                if ($scope.ctrlScope.attatchNo) {
                                    $scope.ctrlScope.attatchNo = $scope.ctrlScope.attatchNo + ',' + fileId;
                                } else {
                                    $scope.ctrlScope.attatchNo = fileId;
                                }
                            }
                            else {
                                showPopupServices.showAlert(result.responseDesc);
                            }
                        });
                    });
                }
            })
        };

        $scope.wxUpload = function () {
            if (yusFiles.length <= 4) {
                wx.ready(function () {
                    wx.chooseImage({
                        count: 4 - yusFiles.length,
                        success: function (res) {
                            var length = res.localIds.length;
                            for (var i = 0; i < length; i++) {
                                var localId = res.localIds[i];
                                upload(localId);
                                yusFiles.push(localId);
                            }
                            $scope.ctrlScope.yusFiles = yusFiles;
                            $scope.$digest();
                        }
                    })
                })
            }
        };

        $scope.previewImage = function (yusFile) {
            wx.previewImage({
                current: yusFile,
                urls: [yusFile]
            });
        };
        $scope.delImage = function (yusFile) {
            showPopupServices.showConfirm('', '<h3 style="text-align: center;">删除图片？</h3>', function () {
                var index = yusFiles.indexOf(yusFile);
                if (index > -1) {
                    yusFiles.splice(index, 1);
                    $scope.ctrlScope.yusFiles = yusFiles;
                }
            })

        };

        $scope.$on('$ionicView.enter', function () {

            if (userInforList.getPatient) {
                $scope.ctrlScope.name = userInforList.getPatient.name;
                $scope.ctrlScope.gender = userInforList.getPatient.gender;
                $scope.ctrlScope.patientId = userInforList.getPatient.id;
                $scope.ctrlScope.userRelation = userInforList.getPatient.userRelation;
                $scope.ctrlScope.revisit = "N";
            }
        });

        var showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({
                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
            });
        };
        var registerSave = function () {
            ddUserDirectRegisterServices.save({userId: userId}, {
                userId: userId,
                patientId: $scope.ctrlScope.patientId,
                scheduleId: $stateParams.scheduleId,
                revisit: $scope.ctrlScope.revisit,
                phenomenon: $scope.ctrlScope.phenomenon,
                attachNo: $scope.ctrlScope.attatchNo
            }, function (result) {
                if (result.responseStatus == "309") {
                    showQueue("账户余额不足，请及时充值!");
                } else if (result.responseStatus == "400") {
                    showQueue("请填写各项内容!");
                } else {
                    showQueue("恭喜您，预约成功!");
                    var urlPath = '/tab/user/userRegister';
                    $location.url(urlPath);
                }
            });
        };

        var queueSave = function () {
            userNewQueueServices.userQueueUp({
                userId: userId,
                patientId: $scope.ctrlScope.patientId,
                doctorId: $stateParams.doctorId,
                hospitalId: $stateParams.scheduleId,
                revisit: $scope.ctrlScope.revisit,
                phenomenon: $scope.ctrlScope.phenomenon,
                attachNo: $scope.ctrlScope.attatchNo
            }, function (result) {
                if (result.responseStatus == "309") {
                    showQueue("账户余额不足，请及时充值!");
                } else if (result.responseStatus == "400") {
                    showQueue("请填写各项内容!");
                } else if (result.responseDesc == 'OK') {
                    showQueue("恭喜您，排队成功!");
                    var urlPath = '/tab/user/userQueue';
                    $location.url(urlPath);
                }
            });

        };

        var registerUpdate = function () {
            if (upDateId) {
                registerUpdateServices.registerUpdate({
                    id: upDateId,
                    phenomenon: $scope.ctrlScope.phenomenon,
                    attachNo: $scope.ctrlScope.attatchNo
                }, function (result) {
                    if (result.responseStatus == "309") {
                        showQueue("账户余额不足，请及时充值!");
                    } else if (result.responseStatus == "400") {
                        showQueue("请填写各项内容!");
                    } else if (result.responseDesc == 'OK') {
                        if (pageStatus == 'queueUpdate') {
                            showPopupServices.showAlert('', '修改排队信息成功！');
                            var urlPath = '/tab/user/userQueue';
                            $location.url(urlPath);
                        } else if (pageStatus == 'registerUpdate') {

                            showPopupServices.showAlert('', '修改预约信息成功！');
                            var urlPath = '/tab/user/userRegister';
                            $location.url(urlPath);
                        }
                    }
                });
            }
        };

        $scope.showConfirm = function (str) {
            if (pageStatus == 'registerNew' || pageStatus == 'queueNew') {
                if ($scope.ctrlScope.agree == true) {
                    if ($scope.ctrlScope.name == null) {
                        showQueue("请选择就诊人!");
                    } else {
                        if (!userInforList.doctor) return;
                        if (!userInforList.hospital) return;
                        var confirmPopup = $ionicPopup.confirm({
                            title: '<h4 >确认' + $scope.title + '信息</h4>',
                            template: ' 您选择的患者是：' + $scope.ctrlScope.name + '<p>身份证号：' + userInforList.getPatient.certificateId + '</p>' + '<p>医生：' + userInforList.doctor.name + '</p>' + '<p>医院：' + userInforList.hospital.hospitalName + '</p>',
                            cancelText: '取消',
                            okText: '确定'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                if (pageStatus == 'registerNew') {
                                    registerSave();
                                } else if (pageStatus == 'queueNew') {
                                    queueSave();
                                }
                                delete userInforList.hospital;
                                delete userInforList.doctor;
                            }
                        });
                    }
                } else {
                    showQueue("请确认是否同意《叮咚门诊预约挂号服务协议》!");
                }

            } else {
                registerUpdate();
            }
        };
    }])

    .controller('hospitalCtrl', ['$scope', '$ionicPopup', '$location', '$ionicHistory', '$stateParams', 'hospitalServices', 'ddDoctorHospitalsServices', 'userQueueServices', 'userMultiQueueServices', 'userInforList', function ($scope, $ionicPopup, $location, $ionicHistory, $stateParams, hospitalServices, ddDoctorHospitalsServices, userQueueServices, userMultiQueueServices, userInforList) {

        var ddUserId = userInforList.userId;
        ddDoctorHospitalsServices.getDoctorHospitals({doctorId: $stateParams.doctorId, status: 1}, function (result) {
            $scope.hospitals = result.doctorHospitals;
        });
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
        var checkedHopitalList = [];
        $scope.hospitalChanged = function (chk, hospital) {
            if (chk)
                checkedHopitalList.push(hospital.hospitalId);
            else {
                for (var i = 0; i < checkedHopitalList.length; i++) {
                    if (checkedHopitalList[i] == hospital.hospitalId) {
                        checkedHopitalList.splice(i, 1);
                        return;
                    }
                }
            }
        };
        $scope.chk = {checked: true};

        var showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
            });
        };

        $scope.userQueue = function () {
            if (checkedHopitalList.length == 0) {
                showQueue('请选择就诊医院！');
                return;
            }
            hospitalStr = checkedHopitalList.join(",");

            userMultiQueueServices.save({id: ddUserId}, {
                doctorId: $stateParams.doctorId,
                hospitalStr: hospitalStr
            }, function (result) {
                showQueue(result.responseDesc);

                var urlPath;
                urlPath = '/doctorList';
                $location.url(urlPath);
            });
        }
    }])


    .controller('doctorHospitalsCtrl', ['$scope', '$ionicPopup', '$location', '$ionicHistory', '$stateParams', 'doctorUtils', 'ddUserServices', 'userQueueServices', 'ddGetDoctorHospitalsWithRegisterInfoServices', 'doctorInforList', 'dateFilter', 'ddGetDoctorScheduleDateServices', 'userInforList', function ($scope, $ionicPopup, $location, $ionicHistory, $stateParams, doctorUtils, ddUserServices, userQueueServices, ddGetDoctorHospitalsWithRegisterInfoServices, doctorInforList, dateFilter, ddGetDoctorScheduleDateServices, userInforList) {
        var ddUserId;
        if (userInforList.hasOwnProperty('userId')) {
            ddUserId = userInforList.userId;
        } else {
            ddUserId = doctorUtils.getCookies('userId');
            userInforList.userId = ddUserId;
        }
        ;
        var wxConfigCheck = false;

        wx.ready(function (res) {
            wxConfigCheck = true;
        });

        if (!wxConfigCheck) {
            doctorUtils.wxInit();
        }
        ;

        ddGetDoctorHospitalsWithRegisterInfoServices.getDoctorHospitalsWithRegisterInfo({
            doctorId: $stateParams.doctorId,
            userId: ddUserId
        }, function (result) {
            $scope.hospitals = result.doctorHospitals;
        });
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
        var doctor;
        doctor = $scope.doctor = userInforList.doctor;
        var shareObject = {
            title: "为您推荐一个好大夫： " + doctor.name, // 分享标题
            desc: doctor.hospitalName + " " + doctor.deptName + " " + doctor.level + " " + doctor.teacherLevel + "  擅长：" + doctor.specialty,
            link: 'http://www.yushansoft.com/dingdong/v1/ddpatient/index.html#/doctors/' + doctor.id + '/doctorInforShare', // 分享链接
            imgUrl: doctor.headImgUrl, // 分享图标
            success: function () {

            },
            cancel: function () {

            },
            fail: function (res) {
                alert("分享失败，请重新尝试");
            }
        };

        wx.ready(function () {
            wx.onMenuShareTimeline(shareObject);
            wx.onMenuShareAppMessage(shareObject);
        });
        var showQueue = function (str) {
            var alertPopup = $ionicPopup.show({
                template: str,
                title: '排队情况',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
            });
        };
        $scope.selectHospital = function (hospital) {
            ddUserServices.get({userId: ddUserId}, function (result) {
                var user = $scope.user = (result.users)[0];
                if (user && user.phone) {
                    if (user.balance < hospital.deposit) {
                        showQueue("账户余额不足， 预约该医生的诚意金为" + hospital.deposit + "元，您账户余额为" + user.balance + "元，请在“个人中心”中充值后再进行预约！");
                        var url = '/user/wxpay';
                        $location.url(url);
                    } else {
                        var registerStatus = hospital.registerStatus;
                        if ('0' == registerStatus) {
                            userInforList.hospital = hospital;
                            var url = "/newpatient/" + hospital.hospitalId + "/" + hospital.doctorId + "/queueNew";
                            $location.url(url);
                        } else if ('2' == registerStatus) {

                            var urlPath;
                            var currentdate = new Date();
                            var predate = dateFilter(new Date(currentdate.getTime()), 'yyyy-MM-dd');
                            var nextdate = dateFilter(new Date(currentdate.getTime() + 14 * 24 * 3600 * 1000), 'yyyy-MM-dd');
                            //取得医生在某一医院的可预约日程信息
                            ddGetDoctorScheduleDateServices.getDoctorScheduleDate({
                                doctorId: $stateParams.doctorId,
                                hospitalId: hospital.hospitalId,
                                beginDate: predate,
                                endDate: nextdate
                            }, function (result) {

                                var schduleDateList = result.scheduleList;
                                doctorInforList.schduleDateList = [];
                                angular.forEach(schduleDateList, function (data, index, array) {
                                    doctorInforList.schduleDateList.push(schduleDateList[index].scheduleDate);
                                });
                                userInforList.hospital = hospital;
                                urlPath = '/doctors/' + $stateParams.doctorId + '/hospital/' + hospital.hospitalId;
                                $location.url(urlPath);
                            });
                        }
                    }
                } else {
                    showQueue("请先到“我的”菜单，进行进行“手机验证”！");
                    var url = '/user/userInformation';
                    $location.url(url);
                }
            });
        }
    }])


    .controller('userQueueCtrl', ['$scope', '$rootScope', '$ionicPopup', '$stateParams', '$filter', '$location', 'userQueueServices', 'dateFilter', 'userQueueServices', 'userInforList', 'ddDeleteQueueServices', 'getRegisterByStatusServices', 'userInforList', function ($scope, $rootScope, $ionicPopup, $stateParams, $filter, $location, userQueueServices, dateFilter, userQueueServices, userInforList, ddDeleteQueueServices, getRegisterByStatusServices, userInforList) {
        var ddUserId = userInforList.userId;
        getRegisterByStatusServices.getRegisterByStatus({userId: ddUserId, status: -1}, function (result) {
            $scope.queues = userInforList.queues = result.registers;
            if ($scope.queues && $scope.queues.length > 0) {
                $scope.showOrNot = false;
            } else {
                $scope.showOrNot = true;
            }
        });
        $scope.$on('$ionicView.enter', function () {

        });
        $scope.queueInfor = function (queue) {
            var url = "/newpatient/" + queue.hospitalId + "/" + queue.doctorId + "/queueUpdate";
            sessionStorage.setItem('registerId', queue.id);
            userInforList.queue = queue;
            $location.url(url);
        };

        var showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
            });
        };
        $scope.remove = function (queue) {

            var message = '<h4 style=" text-align:center;">' + queue.hospitalName + '<br/>' + queue.doctorName + '<br/></h4>';
            var confirmPopup = $ionicPopup.confirm({
                title: '<h4 >确认取消本次排队吗？</h4>',
                template: message,
                cancelText: '取消',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    ddDeleteQueueServices.deleteQueue({id: queue.id}, function (result) {
                        if (result.responseDesc == 'OK') {
                            var newQueue = userInforList.queues.filter(function (item, index, array) {
                                return item.id != queue.id;
                            });
                            userInforList.queues = newQueue;
                            $scope.queues = userInforList.queues;
                            if (userInforList.queues.length > 0) {
                                $scope.showOrNot = false;
                            } else {
                                $scope.showOrNot = true;
                            }
                        } else {
                            showQueue(result.responseDesc);
                        }
                    });
                }
            });
        };
    }])

    .controller('UserTransferCtrl', ['$scope', '$timeout', '$stateParams', '$ionicPopup', '$filter', '$location', 'ddUserServices', 'ddUserTransfersServices', 'userInforList', function ($scope, $timeout, $stateParams, $ionicPopup, $filter, $location, ddUserServices, ddUserTransfersServices, userInforList) {

        var ddUserId = userInforList.userId;
        $scope.ctrlScope = $scope;
        $scope.ctrlScope.showOrNot = true;

        $scope.$on('$ionicView.enter', function (e) {
            var getUserBalance = function () {
                ddUserServices.get({userId: ddUserId}, function (result) {
                    $scope.user = result.users[0];
                    $scope.ctrlScope.balance = result.users[0].balance;
                    $scope.ctrlScope.score = result.users[0].score;
                });
            };
            var vm = $scope.vm = {
                moredata: true,
                doctors: [],
                pagination: {
                    perPage: 15,
                    currentPage: 1
                },
                init: function () {
                    ddUserTransfersServices.getUserTransfers({
                        userId: ddUserId,
                        type: 1,
                        size: vm.pagination.perPage,
                        page: vm.pagination.currentPage
                    }, function (result) {
                        vm.transferList = result.transfers;
                        if (result.pages <= vm.pagination.currentPage + 1) vm.moredata = false;

                        angular.forEach(vm.transferList, function (data, index, array) {
                            //data等价于array[index]
                            ddUserServices.get({userId: array[index].fromUserId}, function (result) {
                                $scope.user = (result.users)[0];

                                if (array[index].fromUserId == "0") {
                                    vm.transferList[index].headImgUrl = "http://www.yushansoft.com/dingdong/images/sys/score.png";
                                } else {
                                    vm.transferList[index].headImgUrl = (result.users)[0].headImgUrl;
                                }
                            });
                        });

                        if (vm.transferList && vm.transferList.length > 0) {
                            $scope.ctrlScope.showOrNot = false;
                        } else {
                            $scope.ctrlScope.showOrNot = true;
                        }
                    })
                },
                doRefresh: function () {
                    $timeout(function () {
                        getUserBalance();
                        //simulate async response
                        ddUserTransfersServices.getUserTransfers({
                            userId: ddUserId,
                            type: $stateParams.transferType,
                            size: 15,
                            page: 1
                        }, function (result) {
                            vm.transferList = result.transfers;
                            if (vm.transferList && vm.transferList.length > 0) {
                                $scope.ctrlScope.showOrNot = false;
                            } else {
                                $scope.ctrlScope.showOrNot = true;
                            }
                        });
                        $scope.$broadcast('scroll.refreshComplete');
                    }, 1000);
                }
            };
            getUserBalance();
            vm.init();
        });
        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<p class="ex1">' + str + '</p>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
            });
        };
        //弹出确认对话框
        $scope.showConfirme = function (str) {
            //弹出确认对话框
            showQueue("1）什么是叮咚？<br/>叮咚是叮咚医邦在线给予广大用户的虚拟货币的奖励，可以用于支付，直抵现金。<br/>   2）叮咚折抵现金比例是多少？<br/> 叮咚折抵现金比例是100:1，100叮咚相当于1元人民币。");
        };
    }])


    .controller('UserPatientCtrl', ['$scope', '$rootScope', '$timeout', '$ionicPopup', '$ionicHistory', '$stateParams', '$filter', '$location', 'ddUserPatientServices', 'deleteUserPatientServices', 'userInforList', function ($scope, $rootScope, $timeout, $ionicPopup, $ionicHistory, $stateParams, $filter, $location, ddUserPatientServices, deleteUserPatientServices, userInforList) {
        var ddUserId = userInforList.userId;
        userInforList.getPatient = null;
        $scope.$on('$ionicView.enter', function () {
            ddUserPatientServices.getUserPatient({userId: ddUserId}, function (result) {
                $scope.patients = result.patients;
            });
        });
        $scope.getPatient = function (patient) {
            userInforList.getPatient = patient;
            if ($stateParams.type == 'account') {
                url = "/userPatientAddAccount/upDate";
                $location.url(url);
            } else {
                $ionicHistory.goBack(-1);
            }
        };

        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
        var showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
            });
        };


        $scope.remove = function (patient) {
            var message = '<h4 style=" text-align:center;">' + patient.name + '<br/>' + patient.certificateId + '</h4>';
            var confirmPopup = $ionicPopup.confirm({
                title: '<h4 >确认删除患者吗？</h4>',
                template: message,
                cancelText: '取消',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    deleteUserPatientServices.deleteUserPatient({id: patient.id}, function (result) {
                        ddUserPatientServices.getUserPatient({userId: ddUserId}, function (result) {
                            $scope.patients = result.patients;
                        })
                    });
                }
            });

        };

    }])

    .controller('UserPatientAddCtrl', ['$scope', '$rootScope', '$ionicPopup', '$location', '$ionicHistory', '$stateParams', '$filter', 'ddUserPatientAddServices', 'userInforList', 'ddUserPatientUpdateServices', function ($scope, $rootScope, $ionicPopup, $location, $ionicHistory, $stateParams, $filter, ddUserPatientAddServices, userInforList, ddUserPatientUpdateServices) {
        var ddUserId = userInforList.userId;
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
        $scope.genderList = [{"name": "男", "value": 0}, {"name": "女", "value": 1}];
        $scope.revisitList = [{"name": "否", "value": "N"}, {"name": "是", "value": "Y"}];
        $scope.userRelationList = [{"name": "本人", "value": 0}, {"name": "家庭成员", "value": 1}, {
            "name": "亲戚",
            "value": 2
        }, {"name": "朋友", "value": 3}, {"name": "其他", "value": 4}];

        var showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
            });
        };
        $scope.patientEditTitle = '添加患者';
        $scope.ctrlScope = $scope;

        if (userInforList.getPatient && $stateParams.type == 'upDate') {
            $scope.ctrlScope.patientName = userInforList.getPatient.name;
            $scope.ctrlScope.certificateId = userInforList.getPatient.certificateId;
            $scope.ctrlScope.gender = userInforList.getPatient.gender;
            $scope.ctrlScope.phone = userInforList.getPatient.phone;
            $scope.ctrlScope.userRelation = userInforList.getPatient.userRelation;
            $scope.patientEditTitle = '修改患者信息';
        }

        //弹出确认对话框
        $scope.showConfirmeAdd = function (str) {

            if ($scope.ctrlScope.patientName == null || $scope.ctrlScope.userRelation == null) {
                showQueue("请输完整信息!");
            } else {
                var reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
                if (reg.test($scope.ctrlScope.certificateId)) {
                    //手机号码只有13，14，17，15，18开头的
                    if (!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i.test($scope.ctrlScope.phone)) {
                        showQueue("请检查手机号是否输入正确!");
                    } else {
                        var information = '<h4 style=" text-align:center;">' + $scope.ctrlScope.patientName + "<br/>" + $scope.ctrlScope.certificateId + '</h4>';
                        var confirmPopup = $ionicPopup.confirm({
                            title: '<h4 >确定保存吗？</h4>',
                            template: information,
                            cancelText: '取消',
                            okText: '确定'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                var userPatient = null;

                                userPatient = {
                                    "userId": ddUserId,
                                    "patientName": $scope.ctrlScope.patientName,
                                    "gender": $scope.ctrlScope.gender,
                                    "certificateId": $scope.ctrlScope.certificateId,
                                    "userRelation": $scope.ctrlScope.userRelation,
                                    "phone": $scope.ctrlScope.phone
                                };
                                if (userInforList.getPatient && $stateParams.type == 'upDate') {
                                    ddUserPatientUpdateServices.userPatientUpdate({
                                        "id": userInforList.getPatient.id,
                                        "userId": ddUserId,
                                        "name": $scope.ctrlScope.patientName,
                                        "gender": $scope.ctrlScope.gender,
                                        "certificateId": $scope.ctrlScope.certificateId,
                                        "userRelation": $scope.ctrlScope.userRelation,
                                        "phone": $scope.ctrlScope.phone
                                    }, function (result) {

                                    });
                                } else {
                                    ddUserPatientAddServices.userPatientAdd({}, userPatient);
                                }
                                userPatient.name = $scope.ctrlScope.patientName;
                                userInforList.getPatient = userPatient;
                                $ionicHistory.goBack(-1);
                            }
                        });
                    }
                } else {
                    showQueue("请检查身份证是否输入正确！");
                }
            }
        };
    }])

    .controller('EnchashmentCtrl', ['$scope', '$location', '$ionicPopover', '$ionicPopup', 'ddCashApplyServices', 'doctorInforList', function ($scope, $location, $ionicPopover, $ionicPopup, ddCashApplyServices, doctorInforList) {
        $scope.ctrlScope = $scope;

        //弹出确认对话框
        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({
                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
            });
        };

        $scope.getCard = function () {
            var urlPath = "/accountList/getCard";
            $location.url(urlPath);
        };

        $scope.$on('$ionicView.enter', function () {
            $scope.ctrlScope.bankName = "";
            $scope.ctrlScope.cardNumber = "";
            $scope.ctrlScope.cardName = "";

            if (doctorInforList.card) {
                $scope.ctrlScope.bankName = doctorInforList.card.bankName;
                $scope.ctrlScope.cardNumber = doctorInforList.card.cardNumber;
                $scope.ctrlScope.cardName = doctorInforList.card.cardName;
            } else {

            }
        });
        $scope.cashApply = function (str) {
            if ($scope.ctrlScope.bankName == null || $scope.ctrlScope.cardNumber == null || $scope.ctrlScope.cardName == null) {
                showQueue("请补充完各项信息！");
            } else {
                var information = '<h4 style=" text-align:center;">' + $scope.ctrlScope.bankName + "<br/>" + $scope.ctrlScope.cardNumber + "<br/>" + $scope.ctrlScope.cardName + '</h4>';
                var confirmPopup = $ionicPopup.confirm({
                    title: '<h4 >确定提交取现申请吗？</h4>',
                    template: information,
                    cancelText: '取消',
                    okText: '确定'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        ddCashApplyServices.postCashApply({
                            accountId: doctorInforList.card.id,
                            amount: $scope.ctrlScope.amount
                        }, function (result) {
                            showQueue(result.responseDesc);
                            var urlPath = '/user/wxpay';
                            $location.url(urlPath);
                        });

                    } else {
                    }
                });
            }
        };
    }])
    .controller('AccountListCtrl', ['$scope', '$ionicPopup', '$timeout', '$rootScope', '$stateParams', '$ionicPopover', '$location', '$ionicHistory', 'ddDeleteAccountServices', 'ddAccountsServices', 'doctorInforList', 'userInforList', function ($scope, $ionicPopup, $timeout, $rootScope, $stateParams, $ionicPopover, $location, $ionicHistory, ddDeleteAccountServices, ddAccountsServices, doctorInforList, userInforList) {
        var ddUserId = userInforList.userId;
        $scope.ctrlScope = $scope;

        $scope.$on('$ionicView.enter', function (e) {
            ddAccountsServices.getAccounts({
                userId: ddUserId
            }, function (result) {
                $scope.ctrlScope.accounts = result.accounts;
            });
            $scope.goBack = function () {
                $ionicHistory.goBack(-1);
            };
            $scope.ctrlScope.getAccount = function (account) {
                if ($stateParams.operationType && $stateParams.operationType == "getCard") {
                    doctorInforList.card = account;
                    $ionicHistory.goBack(-1);
                }
            };

        });

        $scope.doRefresh = function () {
            $timeout(function () {
                //simulate async response
                ddAccountsServices.getAccounts({
                    userId: ddUserId
                }, function (result) {
                    $scope.ctrlScope.accounts = result.accounts;
                });
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
        };

        $scope.showConfirmeAdd = function (str) {
            var urlPath = '/addAccount';
            $location.url(urlPath);
        };


        $scope.remove = function (account) {
            ddDeleteAccountServices.deleteAccount({id: account.id}, function (result) {
                ddAccountsServices.getAccounts({
                    userId: ddUserId
                }, function (result) {
                    $scope.ctrlScope.accounts = result.accounts;
                });
            });
        };


    }])

    .controller('AddAccountCtrl', ['$scope', '$filter', '$location', '$ionicPopover', '$ionicPopup', '$stateParams', '$ionicHistory', 'ddAddAccountsServices', 'userInforList', function ($scope, $filter, $location, $ionicPopover, $ionicPopup, $stateParams, $ionicHistory, ddAddAccountsServices, userInforList) {
        $scope.ctrlScope = $scope;
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
        var ddUserId = userInforList.userId;

        //弹出确认对话框
        $scope.showConfirmeAdd = function (str) {
            var message = '<h4 style=" text-align:center;">' + $scope.ctrlScope.bankName + '<br/>' + $scope.ctrlScope.cardNumber + '<br/>' + $scope.ctrlScope.cardName + '</h4>';
            var confirmPopup = $ionicPopup.confirm({
                title: '<h4 >您确定添加如下账户吗？</h4>',
                template: message,
                cancelText: '取消',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {

                    var accounts = null;


                    var request = {
                        "accounts": [
                            {
                                "bankAddress": $scope.ctrlScope.bankAddress,
                                "bankBranchName": $scope.ctrlScope.bankBranchName,
                                "bankName": $scope.ctrlScope.bankName,
                                "cardName": $scope.ctrlScope.cardName,
                                "cardNumber": $scope.ctrlScope.cardNumber,
                                "userId": ddUserId
                            }
                        ],
                        "requestDesc": "string",
                        "requestStatus": 0
                    };

                    ddAddAccountsServices.addAccounts({}, request);
                    var urlPath = 'accountList';
                    $location.url(urlPath);

                }
            });
        };
    }])
    .controller('userRegisterCtrl', ['$scope', '$rootScope', '$ionicPopup', '$stateParams', '$filter', '$location', 'getRegisterByStatusServices', 'cancelRegisterServices', 'userInforList', function ($scope, $rootScope, $ionicPopup, $stateParams, $filter, $location, getRegisterByStatusServices, cancelRegisterServices, userInforList) {
        var ddUserId = userInforList.userId;
        getRegisterByStatusServices.getRegisterByStatus({userId: ddUserId, status: 1}, function (result) {
            $scope.registers = userInforList.registers = result.registers;
            if ($scope.registers && $scope.registers.length > 0) {
                $scope.showOrNot = false;
            } else {
                $scope.showOrNot = true;
            }
        });
        $scope.$on('$ionicView.enter', function () {

        });
        var showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {

            });
        };
        $scope.registerInfor = function (register) {
            var url = "/newpatient/" + register.scheduleId + "/" + register.doctorId + "/registerUpdate";
            userInforList.register = register;
            sessionStorage.setItem('registerId', register.id);
            $location.url(url);
        };

        $scope.remove = function (register) {
            var message = '<h4 style=" text-align:center;">' + register.hospitalName + '<br/>' + register.doctorName + '<br/>' + $filter('dateFormat1')(register.scheduleDate) + $filter('timeSlot')(register.timeSlot) + '</h4>';
            var confirmPopup = $ionicPopup.confirm({
                title: '<h4 >确认取消本次预约吗？</h4>',
                template: message,
                cancelText: '取消',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    cancelRegisterServices.cancelRegister({id: register.id}, function (result) {
                        if (result.responseDesc == 'OK') {
                            var newRegisters = userInforList.registers.filter(function (item, index, array) {
                                return item.id != register.id;
                            });
                            userInforList.registers = newRegisters;
                            $scope.registers = userInforList.registers;
                            if ($scope.registers && $scope.registers.length > 0) {
                                $scope.showOrNot = false;
                            } else {
                                $scope.showOrNot = true;
                            }
                        } else {
                            showQueue(result.responseDesc);
                        }
                    });
                }
            });
        };

    }])

    .controller('PatientDetailCtrl', ['$scope', '$stateParams', '$ionicHistory', '$location', '$ionicPopup', '$filter', 'getDoctorEvalsByRegisterServices', 'ddPatientDetailServices', 'ddRegistersServices', function ($scope, $stateParams, $ionicHistory, $location, $ionicPopup, $filter, getDoctorEvalsByRegisterServices, ddPatientDetailServices, ddRegistersServices) {

        ddPatientDetailServices.get({patientId: $stateParams.patientId}, function (result) {
            $scope.patient = (result.patients)[0];
        });

        ddRegistersServices.get({id: $stateParams.registerId}, function (result) {
            $scope.register = (result.registers)[0];

            if ($scope.register) {
                var files = $scope.register.attachUrls;
                var yusFiles = [];
                if (files != null && files != "") {
                    var str = [];
                    str = files.split(",");
                    $scope.showOrNot = false;
                    for (i = 0; i < str.length; i++) {
                        yusFiles.push(str[i]);
                    }
                } else {
                    $scope.showOrNot = true;
                }
                $scope.yusFiles = yusFiles;
            }
        });

        getDoctorEvalsByRegisterServices.getDoctorEvalsByRegisterId({registerId: $stateParams.registerId}, function (result) {
            $scope.doctorEvals = result.doctorEvals;

        });

        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {

            });
        };
    }])

    .controller('userRegisterHistoryCtrl', ['$scope', '$location', '$rootScope', '$stateParams', 'getRegisterByStatusServices', 'userInforList', function ($scope, $location, $rootScope, $stateParams, getRegisterByStatusServices, userInforList) {
        var ddUserId = userInforList.userId;
        getRegisterByStatusServices.getRegisterByStatus({userId: ddUserId, status: 5}, function (result) {
            userInforList.registersHistorys = result.registers;
            $scope.registersHistorys = userInforList.registersHistorys;
            if ($scope.registersHistorys && $scope.registersHistorys.length > 0) {
                $scope.showOrNot = false;
            } else {
                $scope.showOrNot = true;
            }
        });
        $scope.$on('$ionicView.enter', function () {

        })

    }])

    .controller('needEvaluationListCtrl', ['$scope', '$rootScope', '$location', '$stateParams', 'getRegisterByStatusServices', 'userInforList', function ($scope, $rootScope, $location, $stateParams, getRegisterByStatusServices, userInforList) {
        var ddUserId = userInforList.userId;
        getRegisterByStatusServices.getRegisterByStatus({userId: ddUserId, status: 3}, function (result) {
            userInforList.needEvaluation = result.registers;
            $scope.needEvaluation = userInforList.needEvaluation;

            if ($scope.needEvaluation && $scope.needEvaluation.length > 0) {
                $scope.showOrNot = false;
            } else {
                $scope.showOrNot = true;
            }
        });
        $scope.$on('$ionicView.enter', function () {

        });

        $scope.addEvaluate = function (register) {
            var url = '/user/addEvaluation/' + register.id;
            $location.url(url);
        };
    }])

    .controller('UserRegisterConfirmListCtrl', ['$scope', '$rootScope', '$timeout', '$stateParams', '$ionicPopup', '$filter', 'userInforList', 'userQueueServices', 'getRegisterByStatusServices', 'ddConfirmQueueServices', 'showPopupServices', 'cancelRegisterServices', function ($scope, $rootScope, $timeout, $stateParams, $ionicPopup, $filter, userInforList, userQueueServices, getRegisterByStatusServices, ddConfirmQueueServices, showPopupServices, cancelRegisterServices) {
        var ddUserId = userInforList.userId;
        var registerList;

        getRegisterByStatusServices.getRegisterByStatus({userId: ddUserId, status: 0}, function (result) {
            $scope.registers = registerList = result.registers;
            if ($scope.registers && $scope.registers.length > 0) {
                $scope.showOrNot = false;
            } else {
                $scope.showOrNot = true;
            }
        });

        $scope.$on('$ionicView.enter', function () {

        });

        $scope.doRefresh = function () {
            $timeout(function () {
                getRegisterByStatusServices.getRegisterByStatus({userId: ddUserId, status: 0}, function (result) {
                    $scope.registers = result.registers;
                });
                $scope.$broadcast('scroll.refreshComplete');

            }, 500);
        };

        $scope.registerConfirm = function (register) {

            showPopupServices.showConfirm('', '<h3 style="text-align: center">确定预约?</h3>', function () {
                ddConfirmQueueServices.ddConfirmQueue({id: register.id}, function (result) {
                    if (result.responseStatus == '1') {
                        showPopupServices.showAlert("<h3>恭喜您！预约成功！</h3>");
                        var registers = registerList.filter(function (item, index, array) {
                            return item.id != register.id;
                        });
                        userInforList = registers;
                        $scope.registers = registers;
                        if ($scope.registers && $scope.registers.length > 0) {
                            $scope.showOrNot = false;
                        } else {
                            $scope.showOrNot = true;
                        }
                    } else {
                        showPopupServices.showAlert('<h3>' + result.responseDesc + '</h3>');
                    }
                });
            });
        };
        $scope.delRegister = $scope.remove = function (register) {
            var message = '<h4 style=" text-align:center;">' + register.hospitalName + '<br/>' + register.doctorName + '<br/>' + $filter('dateFormat1')(register.scheduleDate) + $filter('timeSlot')(register.timeSlot) + '</h4>';
            var confirmPopup = $ionicPopup.confirm({
                title: '<h4 >确认取消本次预约吗？</h4>',
                template: message,
                cancelText: '取消',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    cancelRegisterServices.cancelRegister({id: register.id}, function (result) {
                        if (result.responseDesc == 'OK') {
                            var newRegistersConfirm = userInforList.registersConfirm.filter(function (item, index, array) {
                                return item.id != register.id;
                            });
                            userInforList.registersConfirm = newRegistersConfirm;
                            $scope.registers = userInforList.registersConfirm;
                            if ($scope.registers && $scope.registers.length > 0) {
                                $scope.showOrNot = false;
                            } else {
                                $scope.showOrNot = true;
                            }
                        } else {
                            showQueue(result.responseDesc);
                        }
                    });
                }
            });
        };
    }])

    .controller('SmsValidCtrl', ['$scope', '$filter', '$location', '$ionicPopover', '$ionicPopup', '$stateParams', 'ddUserServices', 'ddSmsValiServices', 'ddUpdateSmsValiServices', 'userInforList', function ($scope, $filter, $location, $ionicPopover, $ionicPopup, $stateParams, ddUserServices, ddSmsValiServices, ddUpdateSmsValiServices, userInforList) {

        var userId = userInforList.userId;
        $scope.ctrlScope = $scope;

        ddUserServices.get({userId: userId}, function (result) {
            $scope.user = result.users[0];
            $scope.ctrlScope.phoneOld = result.users[0].phone;
        });
        $scope.showConfirmeGetValid = function (obj) {
            var mobileNo = $scope.ctrlScope.mobileNo;
            var msgCode = $scope.ctrlScope.msgCode;
            var imgCode = 1;
            ddSmsValiServices.validNum({mobileNo: mobileNo}, function (result) {
                if (result.responseDesc == 'OK') {
                    var order = '<h4 style=" text-align:center;">' + mobileNo + '</h4>';
                    var confirmPopup = $ionicPopup.confirm({
                        title: '<h4 >发送至：</h4>',
                        template: order,
                        cancelText: '取消',
                        okText: '确定'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                        } else {
                        }
                    });
                }
            })
        };

        $scope.showConfirmePutValid = function (str) {
            var mobileNo = $scope.ctrlScope.mobileNo;
            var msgCode = $scope.ctrlScope.msgCode;
            var imgCode = 1;

            ddUpdateSmsValiServices.updateSmsValid({
                userId: userId,
                mobileNo: mobileNo,
                msgCode: msgCode,
                imgCode: imgCode
            }, function (result) {
                if (result.retMap.ok == '1') {
                    var order = '<h4 style=" text-align:center;">' + mobileNo + '</h4>';
                    var confirmPopup = $ionicPopup.confirm({
                        title: '<h4 >验证通过：</h4>',
                        template: order,
                        cancelText: '取消',
                        okText: '确定'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            ddUserServices.get({userId: userId}, function (result) {
                                $scope.user = result.users[0];
                                $scope.ctrlScope.phoneOld = result.users[0].phone;
                            });
                            var urlPath = '/tab/account';
                            $location.url(urlPath);
                        }
                    });
                } else {
                    alert(result.retMap.msg);
                }
            })
        }

    }])
    .controller('ScoreCtrl', ['$scope', '$ionicPopup', '$ionicPopover', 'ddUserServices', 'userInforList', function ($scope, $ionicPopup, $ionicPopover, ddUserServices, userInforList) {
        var ddUserId = userInforList.userId;
        $scope.ctrlScope = $scope;

        $scope.$on('$ionicView.enter', function (e) {
            ddUserServices.get({userId: ddUserId}, function (result) {
                $scope.user = result.users[0];
                $scope.ctrlScope.score = result.users[0].score;
            });
        });

    }])

    .controller('TermsCtrl', ['$scope', '$ionicPopup', '$ionicHistory', '$ionicPopover', '$location', 'ddUserServices', 'userInforList', function ($scope, $ionicPopup, $ionicHistory, $ionicPopover, $location, ddUserServices, userInforList) {
        var ddUserId = userInforList.userId;
        $scope.ctrlScope = $scope;
        $scope.goBack = function () {
            if ($ionicHistory.viewHistory().backView) {
                $ionicHistory.goBack(-1);
            } else {
                $location.url('/tab/main');
            }
            $ionicHistory.goBack(-1);
        };
        $scope.$on('$ionicView.enter', function (e) {

        });

    }])


    .controller('WxpayCtrl', ['$scope', '$ionicPopup', '$ionicHistory', '$stateParams', '$timeout', '$ionicPopover', '$window', 'ddUserTransfersServices', 'ddUserServices', 'userInforList', function ($scope, $ionicPopup, $ionicHistory, $stateParams, $timeout, $ionicPopover, $window, ddUserTransfersServices, ddUserServices, userInforList) {
        var ddUserId = userInforList.userId;
        $scope.ctrlScope = $scope;

        var getUserBalance = function () {
            ddUserServices.get({userId: ddUserId}, function (result) {
                $scope.user = result.users[0];
                $scope.ctrlScope.balance = result.users[0].balance;
                $scope.ctrlScope.score = result.users[0].score;
            });
        };


        var getUserTranfers = function () {
            ddUserTransfersServices.getUserTransfers({
                userId: ddUserId,
                type: 0,
                size: 15,
                page: 1
            }, function (result) {
                $scope.vm.transferList = result.transfers;

                angular.forEach($scope.vm.transferList, function (data, index, array) {
                    //data等价于array[index]
                    ddUserServices.get({userId: array[index].fromUserId}, function (result) {
                        $scope.user = (result.users)[0];

                        if (array[index].fromUserId == "0") {
                            $scope.vm.transferList[index].headImgUrl = "http://www.yushansoft.com/dingdong/images/sys/money_bag.png";
                        } else {
                            $scope.vm.transferList[index].headImgUrl = (result.users)[0].headImgUrl;
                        }
                    });
                });

                if ($scope.vm.transferList && $scope.vm.transferList.length > 0) {
                    $scope.ctrlScope.showOrNot = false;
                } else {
                    $scope.ctrlScope.showOrNot = true;
                }
            });
        };
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
        $scope.expanderTitle = '财富明细';
        $scope.vm = {};

        $scope.$on('$ionicView.enter', function (e) {
            getUserBalance();
            getUserTranfers();
        });

        $scope.doRefresh = function () {
            $timeout(function () {
                //simulate async response
                getUserBalance();
                getUserTranfers();
                $scope.$broadcast('scroll.refreshComplete');

            }, 500);
        };
        //弹出确认对话框
        $scope.showConfirmeCharge = function (str) {
            var urlPath = 'http://www.yushansoft.com/dingdong/sys/wxpay/tab-wxpay.html';
            $window.open(urlPath);
        };
    }])

    .controller('WxpayRechargeCtrl', ['$scope', '$ionicPopup', '$ionicHistory', '$stateParams', '$timeout', '$ionicPopover', '$window', '$ionicHistory', 'ddUserTransfersServices', 'ddUserServices', 'userInforList', 'ddRechargeServices', function ($scope, $ionicPopup, $ionicHistory, $stateParams, $timeout, $ionicPopover, $window, $ionicHistory, ddUserTransfersServices, ddUserServices, userInforList, ddRechargeServices) {
        var ddUserId = userInforList.userId;
        $scope.ctrlScope = $scope;
        $scope.ctrlScope = {
            'totalFee': 100
        };

        $scope.userRechargeConfirm = function () {
            ddRechargeServices.postRecharge({
                userId: ddUserId,
                totalFee: $scope.ctrlScope.totalFee
            }, function (result) {
                if (result.responseDesc == "OK") {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', result.tokenConfig,
                        function (res) {
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                $ionicHistory.goBack(-1);
                            } else {
                                alert("微信充值失败,请稍后重试!");
                            }
                        }
                    );
                }
            });
        };

        $scope.$on('$ionicView.enter', function (e) {

        });

    }])


    .controller('UserInformationCtrl', ['$scope', '$ionicPopup', '$ionicHistory', '$location', '$ionicPopover', 'ddUserServices', 'ddUpdateUserInformationServices', 'ddUpdateSmsValiServices', 'ddSmsValiServices', 'userInforList', function ($scope, $ionicPopup, $ionicHistory, $location, $ionicPopover, ddUserServices, ddUpdateUserInformationServices, ddUpdateSmsValiServices, ddSmsValiServices, userInforList) {
        var userId = userInforList.userId;
        $scope.genderList = [{"name": "男", "value": 0}, {"name": "女", "value": 1}];
        $scope.ctrlScope = $scope;

        var countdown = 60;
        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {

            });
        };
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
        $scope.ctrlScope.countdown = "获取验证码";
        $scope.showConfirmeGetValid = function (obj) {

            var mobileNo = $scope.ctrlScope.mobileNo;
            if (mobileNo != null) {
                var imgCode = 1;
                ddSmsValiServices.validNum({mobileNo: mobileNo}, function (result) {

                });
                setTimeout(function () {
                    clearInterval(myTime);
                    $scope.ctrlScope.countdown = "获取验证码";
                    countdown = 60;
                }, 61000);

                var myTime = setInterval(function () {
                    if (countdown == "1") {
                        $scope.ctrlScope.countdown = "获取验证码";
                        $scope.ctrlScope.getValidDisable = false;
                    } else {
                        countdown--;
                        $scope.ctrlScope.countdown = "重新发送（" + countdown + "）";
                        $scope.ctrlScope.getValidDisable = true;
                    }

                    $scope.ctrlScope.$digest(); // 通知视图模型的变化

                }, 1000);
            } else {
                showQueue("请输入要验证的手机号码！");
            }
        };

        $scope.showConfirmePutValid = function (str) {
            var mobileNo = $scope.ctrlScope.mobileNo;
            var msgCode = $scope.ctrlScope.msgCode;
            if (mobileNo != null) {
                var imgCode = 1;
                ddUpdateSmsValiServices.updateSmsValid({
                    userId: userId,
                    mobileNo: mobileNo,
                    msgCode: msgCode,
                    imgCode: imgCode
                }, function (result) {
                    if (result.retMap.ok == '1') {
                        var order = '<h4 style=" text-align:center;">' + mobileNo + '</h4>';
                        var confirmPopup = $ionicPopup.confirm({
                            title: '<h4 >验证通过：</h4>',
                            template: order,
                            cancelText: '取消',
                            okText: '确定'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                ddUserServices.get({userId: userId}, function (result) {
                                    var user = (result.users)[0];
                                    if (user) {
                                        $scope.user = user;
                                        $scope.ctrlScope.phoneOld = user.phone;
                                    }
                                });
                                $ionicHistory.goBack(-1);
                            }
                        });
                    } else {
                        showQueue(result.retMap.msg);
                    }
                })

            } else {
                showQueue("请输入要验证的手机号码！");
            }
        };

        (function () {
            if (userId) {
                ddUserServices.get({userId: userId}, function (result) {
                    var user = result.users[0];
                    if (user) {
                        $scope.user = result.users[0];
                        $scope.ctrlScope.name = result.users[0].name;
                        $scope.ctrlScope.address = result.users[0].address;
                        $scope.ctrlScope.gender = result.users[0].gender;
                        $scope.ctrlScope.phone = result.users[0].phone;
                        $scope.ctrlScope.certificateId = result.users[0].certificateId;
                        $scope.ctrlScope.headImgUrl = result.users[0].headImgUrl;
                        $scope.ctrlScope.phoneOld = result.users[0].phone;
                    }
                });
            }
        })();

        //弹出确认对话框
        $scope.showConfirmeSave = function (str) {

            if ($scope.ctrlScope.name == null) {
                showQueue("请输入姓名!");
            } else {
                var reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
                if (reg.test($scope.ctrlScope.certificateId)) {
                    var information = '<h4 style=" text-align:center;">' + str + '</h4>';
                    var confirmPopup = $ionicPopup.confirm({
                        title: '<h4 >确定保存吗？</h4>',
                        template: information,
                        cancelText: '取消',
                        okText: '确定'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            var userInformation = null;
                            userInformation = {
                                "name": $scope.ctrlScope.name,
                                "gender": $scope.ctrlScope.gender,
                                "address": $scope.ctrlScope.address,
                                "certificateId": $scope.ctrlScope.certificateId,
                                "headImgUrl": $scope.ctrlScope.headImgUrl
                            };
                            ddUpdateUserInformationServices.updateUserInformation({id: userId}, userInformation);

                            var urlPath;
                            urlPath = '/tab/account';
                            $location.url(urlPath);
                            showQueue("保存成功！");

                        }
                    });
                } else {
                    showQueue("请检查身份证是否输入正确！");
                }
            }
        };
    }])

    .controller('HospitalsAllCtrl', ['$scope', '$ionicPopover', '$stateParams', '$location', '$timeout', '$ionicHistory', 'ddHospitalsServices', 'ddHospitalsAllServices', 'userInforList', function ($scope, $ionicPopover, $stateParams, $location, $timeout, $ionicHistory, ddHospitalsServices, ddHospitalsAllServices, userInforList) {
        var ddUserId = userInforList.userId;
        $scope.$on('$ionicView.enter', function (e) {

        });

        var vm = $scope.vm = {
            moredata: true,
            hospitals: [],
            pagination: {
                perPage: 30,
                currentPage: 1
            },
            init: function () {
                ddHospitalsAllServices.getAllHospitals({
                    size: vm.pagination.perPage,
                    page: vm.pagination.currentPage,
                    order: 'ASC',
                    orderBy: 'name'

                }, function (result) {
                    vm.hospitals = result.hospitals;
                })
            },
            doRefresh: function () {
                $timeout(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                }, 1000);
            },
            loadMore: function () {
                vm.pagination.currentPage += 1;
                if (vm.moredata) {
                    ddHospitalsAllServices.getAllHospitals({
                        size: vm.pagination.perPage,
                        page: vm.pagination.currentPage,
                        order: 'ASC',
                        orderBy: 'name'
                    }, function (result) {
                        vm.hospitals = vm.hospitals.concat(result.hospitals);
                        if (result.hospitals.length <= 0) vm.moredata = false;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    })
                }

            }
        };
        vm.init();
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
    }])

    .controller('hospitalDoctorsCtrl', ['$scope', '$rootScope', '$stateParams', '$ionicPopover', '$location', '$timeout', '$ionicHistory', 'doctorServices', 'ddUserServices', 'hospitalDoctorsServices', 'hospitalDeptTreeServices', 'userInforList', function ($scope, $rootScope, $stateParams, $ionicPopover, $location, $timeout, $ionicHistory, doctorServices, ddUserServices, hospitalDoctorsServices, hospitalDeptTreeServices, userInforList) {
        var ddUserId = userInforList.userId;
        $scope.viewStatus = 1;
        $scope.showSchedule = function (str) {
            $scope.viewStatus = str;
        };
        $scope.$on('$ionicView.enter', function () {

        });
        hospitalDoctorsServices.getHospitalDoctors({hospitalId: $stateParams.hospitalId}, function (result) {
            $scope.doctors = result.doctorHospitals;
        });
        hospitalDeptTreeServices.get({hospitalId: $stateParams.hospitalId, size: 50, page: 1}, function (result) {
            $scope.hospitalDepts = result.hospitalDepts;
        });
        $scope.toggleGroup = function (hospitalDept) {

            if ($scope.isGroupShown(hospitalDept)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = hospitalDept;
            }
        };
        $scope.isGroupShown = function (hospitalDept) {
            return $scope.shownGroup === hospitalDept;
        };
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
    }])
    .controller('doctorEvaluationListCtrl', ['$scope', '$rootScope', '$ionicHistory', '$ionicPopover', '$stateParams', '$location', '$timeout', 'doctorServices', 'ddDoctorEvaluationsServices', 'userInforList', function ($scope, $rootScope, $ionicHistory, $ionicPopover, $stateParams, $location, $timeout, doctorServices, ddDoctorEvaluationsServices, userInforList) {
        var ddUserId = userInforList.userId;
        $scope.$on('$ionicView.enter', function (e) {
            $scope.goBack = function () {
                $ionicHistory.goBack(-1);
            };
        });
        var vm = $scope.vm = {
            moredata: true,
            doctorEvals: [],
            pagination: {
                perPage: 15,
                currentPage: 1
            },
            init: function () {
                ddDoctorEvaluationsServices.getDoctorEvaluations({
                    doctorId: $stateParams.doctorId,
                    size: vm.pagination.perPage,
                    page: vm.pagination.currentPage,
                    order: 'createTime',
                    orderBy: 'DESC'
                }, function (result) {
                    vm.doctorEvals = result.doctorEvals;
                })
            },

            doRefresh: function () {
                $timeout(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                }, 1000);
            },
            loadMore: function () {
                vm.pagination.currentPage += 1;
                if (vm.moredata) {
                    ddDoctorEvaluationsServices.getDoctorEvaluations({
                        doctorId: $stateParams.doctorId,
                        size: vm.pagination.perPage,
                        page: vm.pagination.currentPage,
                        order: 'id',
                        orderBy: 'ASC'
                    }, function (result) {
                        vm.doctorEvals = vm.doctorEvals.concat(result.doctorEvals);
                        if (result.doctorEvals && result.doctorEvals.length == 0) {
                            vm.moredata = false;
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    })
                }

            }
        };
        vm.init();
    }])


    .controller('myEvaluationListCtrl', ['$scope', '$rootScope', '$ionicPopup', '$ionicHistory', '$ionicPopover', '$stateParams', '$location', '$timeout', 'doctorServices', 'cancelEvaluationServices', 'ddMyEvaluationsServices', 'ddDoctorEvaluationsServices', 'userInforList', function ($scope, $rootScope, $ionicPopup, $ionicHistory, $ionicPopover, $stateParams, $location, $timeout, doctorServices, cancelEvaluationServices, ddMyEvaluationsServices, ddDoctorEvaluationsServices, userInforList) {

        var ddUserId = userInforList.userId;
        $scope.$on('$ionicView.enter', function (e) {
            ddMyEvaluationsServices.getMyEvaluations({
                userId: $stateParams.userId
            }, function (result) {
                $scope.doctorEvals = result.doctorEvals;
            });
            $scope.goBack = function () {
                $ionicHistory.goBack(-1);
            };
        });

        $scope.doRefresh = function () {
            $timeout(function () {
                //simulate async response
                ddMyEvaluationsServices.getMyEvaluations({
                    userId: $stateParams.userId
                }, function (result) {
                    $scope.doctorEvals = result.doctorEvals;
                });
                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
        };
        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
            });
        };
        $scope.remove = function (doctorEval) {
            var message = '<h4 style=" text-align:center;">' + '</h4>';
            var confirmPopup = $ionicPopup.confirm({
                title: '<h4 >确认删除本条评论吗？</h4>',
                template: message,
                cancelText: '取消',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    cancelEvaluationServices.cancelEvaluation({id: doctorEval.id}, function (result) {
                        ddMyEvaluationsServices.getMyEvaluations({
                            userId: $stateParams.userId
                        }, function (result) {
                            $scope.doctorEvals = result.doctorEvals;
                        })
                    });
                    showQueue("成功删除本条评论！");
                }
            });
        };

        $scope.addEvaluate = function (doctorEval) {
            var url = '/tab/user/addEvaluation/' + $stateParams.registerId;
            $location.url(url);
        };
    }])

    .controller('hospitalIntroCtrl', ['$scope', '$stateParams', '$ionicHistory', 'getHosipitalIntroServices', function ($scope, $stateParams, $ionicHistory, getHosipitalIntroServices) {
        getHosipitalIntroServices.getSingleHosiptal({hospitalId: $stateParams.hospitalId}, function (result) {
            $scope.hospital = (result.hospitals)[0];
        });
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        }
    }])
    .controller('UserSettingCtrl', ['$scope', '$stateParams', '$ionicHistory', '$cookies', '$cookieStore', 'showPopupServices', 'userInforList', function ($scope, $stateParams, $ionicHistory, $cookies, $cookieStore, showPopupServices, userInforList) {
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
        $scope.userSetting = function () {
            if (userInforList.hasOwnProperty('userId')) {
                delete  userInforList.userId;
                $cookies.remove('userId');
            }

            showPopupServices.showAlert('', '清除缓存成功');
        };
    }])


    .controller('addEvaluationCtrl', ['$scope', '$ionicPopup', '$location', '$ionicHistory', '$timeout', '$rootScope', '$stateParams', 'doctorUtils', 'getDoctorsTagsServices', 'addEvaluationServices', 'userInforList', function ($scope, $ionicPopup, $location, $ionicHistory, $timeout, $rootScope, $stateParams, doctorUtils, getDoctorsTagsServices, addEvaluationServices, userInforList) {
        $scope.ctrlScope = $scope;
        var ratingValTreatmentEffect = 5;
        var ratingValServiceAttitude = 5;

        var arrayTagsId = []; //创建一个数组,存放标签
        var arrayTagsName = []; //创建一个数组,存放标签


        var ddUserId;
        if (userInforList.hasOwnProperty('userId')) {
            ddUserId = userInforList.userId;
        } else {
            ddUserId = doctorUtils.getCookies('userId');
            userInforList.userId = ddUserId;
        }
        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
            });
        };
        $scope.goBack = function () {
            if ($ionicHistory.viewHistory().backView) {
                $ionicHistory.goBack(-1);
            } else {
                $location.url('/tab/main');
            }
            $ionicHistory.goBack(-1);
        };

        getDoctorsTagsServices.getDoctorsTags({}, function (result) {
            $scope.tags = result.tagList;
        });

        $scope.getTag = function (tag) {
            if (this.tagType == "button-positive") {
                this.tagType = "";

                angular.forEach(arrayTagsId, function (data, index, array) {
                    //data等价于array[index]
                    if (data == tag.id) {
                        arrayTagsId.splice(index, 1);
                    } else {

                    }
                });
                angular.forEach(arrayTagsName, function (data, index, array) {
                    //data等价于array[index]
                    if (data == tag.tagName) {
                        arrayTagsName.splice(index, 1);
                    } else {

                    }
                });

            } else {
                this.tagType = "button-positive";
                arrayTagsId.push(tag.id);
                arrayTagsName.push(tag.tagName);
            }
        };


        $scope.addEval = function (str) {
            var tagsId = null;
            angular.forEach(arrayTagsId, function (data, index, array) {
                //data等价于array[index]
                if (tagsId == null) {
                    tagsId = data;
                } else {
                    tagsId = tagsId + "," + data;
                }
            });


            if (ratingValTreatmentEffect == null || ratingValServiceAttitude == null || $scope.ctrlScope.evalDesc == null) {
                showQueue("请补充评价信息!");
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: '',
                    template: '<h4 style=" text-align:center;">评价一旦提交将无法修改，请如实评价！</h4>',
                    cancelText: '取消',
                    okText: '确定'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        addEvaluationServices.save({}, {
                            userId: ddUserId,
                            registerId: $stateParams.registerId,
                            treatmentEffect: ratingValTreatmentEffect,
                            serviceAttitude: ratingValServiceAttitude,
                            evalDesc: $scope.ctrlScope.evalDesc,
                            tags: tagsId
                        }, function (result) {
                            if(result.responseDesc == 'OK'){
                                showQueue("感谢您的评价，您获得积分:" + result.evalScore + "(咚)！");
                                var url = '/tab/user/userRegisterHistory';
                                $location.url(url);
                            }else{
                                showQueue("您已经对本次诊疗评价过了！");
                            }

                        });
                    } else {
                        var url = '/tab/user/needEvaluationList';
                        $location.url(url);
                    }
                });

            }
        };
        $scope.max = 5;
        $scope.ratingValTreatmentEffect = 5;
        $scope.ratingValServiceAttitude = 5;
        $scope.hoverValTreatmentEffect = 2;
        $scope.hoverValServiceAttitude = 2;
        $scope.readonly = false;

        $scope.onHoverTreatmentEffect = function (val) {
            $scope.hoverValTreatmentEffect = val;
            ratingValTreatmentEffect = val;
        };
        $scope.onLeaveTreatmentEffect = function (val) {
            $scope.hoverValTreatmentEffect = val;
        };
        $scope.onChangeTreatmentEffect = function (val) {
            $scope.ratingValTreatmentEffect = val;
            ratingValTreatmentEffect = val;
        };

        $scope.onHoverServiceAttitude = function (val) {
            $scope.hoverValServiceAttitude = val;
            ratingValServiceAttitude = val;
        };
        $scope.onLeaveServiceAttitude = function (val) {
            $scope.hoverValServiceAttitude = val;
        };

        $scope.onChangeServiceAttitude = function (val) {
            $scope.ratingValServiceAttitude = val;
            ratingValServiceAttitude = val;
        }
    }]);

