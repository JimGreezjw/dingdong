var dddoctorControllers = angular.module('dddoctorControllers', ['ionic-datepicker', 'ngCookies']);

dddoctorControllers.config(['$compileProvider', function ($compileProvider) {

    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|http|weixin):/);
}
]);

dddoctorControllers.controller('MainCtrl',['$scope', '$location','$cookies','ddJsConfig', 'ddDoctorHospitalsServices','doctorInforList', function ($scope, $location,$cookies,ddJsConfig, ddDoctorHospitalsServices,doctorInforList) {
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
    var ddybUserId = $scope.ddybUserId = $cookies.get('ddybUserId');
    var doctorId = $scope.doctorId = $cookies.get('doctorId');

    $scope.ctrlScope = $scope;
    doctorInforList.ddybUserId = ddybUserId;
    doctorInforList.doctorId = doctorId;

    ddDoctorHospitalsServices.getDoctorHospitals({doctorId: doctorId}, function (result) {
        $scope.hospitals = result.doctorHospitals;
    })
}])

    .controller('PatientsAllCtrl',['$scope', 'dateFilter', '$location','ddPatientRegistersServices','$cookies','doctorUtils', 'ddPatientServices', 'ddUserServices','ddPatientHistoryServices','ddGetDoctorFunsServices','doctorInforList','ddDoctorInformationServices', function ($scope, dateFilter, $location,ddPatientRegistersServices,$cookies,doctorUtils, ddPatientServices, ddUserServices,ddPatientHistoryServices,ddGetDoctorFunsServices,doctorInforList,ddDoctorInformationServices) {

        $scope.ctrlScope = $scope;
        $scope.$on('$ionicView.enter', function (e) {
            var today = dateFilter(new Date(), 'yyyy-MM-dd');

            var ddybUserId = $scope.ddybUserId = $cookies.get('ddybUserId');
            var doctorId = $scope.doctorId = $cookies.get('doctorId');

            var ddyzUserId = $scope.ddyzUserId = $cookies.get('ddyzUserId');
            if(ddyzUserId &&( ddybUserId== null ||  ddybUserId== "") && (doctorId == null||doctorId == "")){
                var assistantDoctorList = "/assistantDoctors";
                $location.url(assistantDoctorList);
            }else{

                $scope.haveNews = '';
                $scope.registerTodayCount = 0;

                if(doctorId){
                    //获得已约患者
                    ddPatientRegistersServices.queryDoctor_Registers({id: doctorId}, function (result) {
                        if (result.registers && result.registers.length > 0) {
                            $scope.registerCount = result.registers.length;
                        }else{
                            $scope.registerCount = 0;
                        }
                    });
                    /*
                     ddPatientServices.queryMyPatient_Hos_Date({id: doctorId, scheduleDate: today}, function (result) {
                     $scope.patients = result.registers;
                     if ($scope.patients && $scope.patients.length > 0) {
                     var registerTodayCount = 0;
                     $scope.patients.forEach(function (item, index, array) {
                     if (item.status < 3) {
                     $scope.haveNews = 'tab-red-point-patient';
                     registerTodayCount = registerTodayCount + 1;
                     } else {
                     $scope.haveNews = '';
                     }
                     });
                     $scope.registerTodayCount =  registerTodayCount;
                     } else {
                     $scope.haveNews = '';
                     var registerTodayCount = 0;
                     }
                     });*/
                    ddUserServices.get({userId: ddybUserId}, function (result) {
                        $scope.user = result.users[0];
                        $scope.ctrlScope.balance = result.users[0].balance;
                        $scope.ctrlScope.score = result.users[0].score;
                    });
                    //排队数量
                    ddPatientHistoryServices.queryHistory_Registers({id: doctorId,status:-1}, function (result) {
                        $scope.queues = result.registers;
                        if ($scope.queues && $scope.queues.length > 0) {
                            $scope.queueNum =  $scope.queues.length;
                        } else {
                        }
                    })
                    ddGetDoctorFunsServices.getDoctorFuns({
                        doctorId: doctorId
                    }, function (result) {
                        $scope.doctorFans = result.doctorFans;
                        if ($scope.doctorFans && $scope.doctorFans.length > 0) {
                            $scope.funsNum =  $scope.doctorFans.length;
                        }
                    })

                    ddDoctorInformationServices.get({id: doctorId}, function (result) {
                        $scope.doctor = result.doctors[0];
                        $scope.ctrlScope.name = result.doctors[0].name;
                        $scope.ctrlScope.gender = result.doctors[0].gender;
                        $scope.ctrlScope.level = result.doctors[0].level;
                    });
                }else{
                    doctorId = doctorInforList.doctorId;
                    if (doctorId) {
                        /*
                         ddPatientServices.queryMyPatient_Hos_Date({id: doctorId, scheduleDate: today}, function (result) {
                         $scope.patients = result.registers;
                         });

                         if ($scope.patients && $scope.patients.length > 0) {
                         var registerTodayCount = 0;
                         $scope.patients.forEach(function (item, index, array) {
                         if (item.status < 3) {
                         $scope.haveNews = 'tab-red-point-patient';
                         registerTodayCount = registerTodayCount + 1;
                         } else {
                         $scope.haveNews = '';
                         }
                         });
                         $scope.registerTodayCount =  registerTodayCount;
                         } else {
                         $scope.haveNews = '';
                         }*/
                        ddPatientRegistersServices.queryDoctor_Registers({id: doctorId}, function (result) {
                            if (result.registers && result.registers.length > 0) {
                                $scope.registerCount = result.registers.length;
                            }else{
                                $scope.registerCount = 0;
                            }
                        });

                        ddUserServices.get({userId: ddybUserId}, function (result) {
                            $scope.user = result.users[0];
                            $scope.ctrlScope.balance = result.users[0].balance;
                            $scope.ctrlScope.score = result.users[0].score;
                        });
                        var urlPath = '/tab/patientsAll';
                        $location.url(urlPath);
                    }else{
                        var smsValidHomePage = "/smsValidHomePage";
                        $location.url(smsValidHomePage);
                    }
                }
            }
        });
    }])


    .controller('HospitalDetailCtrl',['$scope', '$stateParams', '$ionicPopup', '$filter', 'ddHospitalServices', 'dateFilter', function ($scope, $stateParams, $ionicPopup, $filter, ddHospitalServices, dateFilter) {
        $scope.hospital = ddHospitalServices.get($stateParams.hospitalId);
        $scope.expanderTitle = '医院简介';

        //弹出确认对话框
        $scope.showConfirm = function (str) {
            var information = '<h4 style=" text-align:center;">' + $scope.hospital.fullName + '</h4>';
            var confirmPopup = $ionicPopup.confirm({
                title: '<h4 >确定申请坐诊吗？</h4>',
                template: information,
                cancelText: '取消',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    console.log('确定申请');
                } else {
                    console.log('取消');
                }
            });
        };
    }])

    .controller('DoctorInformationCtrl',['$scope', '$ionicPopup','$cookies', '$ionicPopover', '$location','doctorUtils', 'ddDoctorInformationServices', 'ddUpdateDoctorInformationServices', function ($scope, $ionicPopup,$cookies, $ionicPopover, $location,doctorUtils, ddDoctorInformationServices, ddUpdateDoctorInformationServices) {
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        $scope.ctrlScope = $scope;
        ddDoctorInformationServices.get({id: doctorId}, function (result) {
            $scope.doctor = result.doctors[0];
            $scope.ctrlScope.name = result.doctors[0].name;
            $scope.ctrlScope.gender = result.doctors[0].gender;
            $scope.ctrlScope.hospitalName = result.doctors[0].hospitalName;
            $scope.ctrlScope.level = result.doctors[0].level;
            $scope.ctrlScope.specialty = result.doctors[0].specialty;
            $scope.ctrlScope.introduction = result.doctors[0].introduction;
            $scope.ctrlScope.registerFee = result.doctors[0].registerFee;
        });
        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
                console.log(str);
            });
        };

        //弹出确认对话框
        $scope.showConfirmeSave = function (str) {
            var information = '<h4 style=" text-align:center;">' + str + '</h4>';
            var confirmPopup = $ionicPopup.confirm({
                title: '<h4 >确定保存吗？</h4>',
                template: information,
                cancelText: '取消',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    var doctorInformation = null;
                    doctorInformation = {
                        "hospitalName": $scope.ctrlScope.hospitalName,
                        "level": $scope.ctrlScope.level,
                        "specialty": $scope.ctrlScope.specialty,
                        "introduction": $scope.ctrlScope.introduction
                    };
                    ddUpdateDoctorInformationServices.updateDoctorInformation({id: doctorId}, doctorInformation);
                    console.log('完成');
                    var urlPath;
                    urlPath = '/tab/personalInformation';
                    showQueue("保存成功！");
                    $location.url(urlPath);
                } else {
                    console.log('取消');
                }
            });
        };

    }])


    .controller('DoctorsCtrl',['$scope', '$rootScope', '$ionicPopover','$cookies', '$location','$ionicHistory', '$timeout', 'doctorUtils','doctorServices', 'getUnSignedDoctorsServices','doctorInforList', function ($scope, $rootScope, $ionicPopover,$cookies, $location,$ionicHistory, $timeout, doctorUtils,doctorServices, getUnSignedDoctorsServices,doctorInforList) {
        $scope.ctrlScope = $scope;
        doctorInforList.getDoctor = null;
        //叮咚名医列表
        $scope.$on('$ionicView.enter', function (e) {
            if (doctorInforList.getDoctor) {
                $ionicHistory.goBack(-1);
            }
        });

        $scope.getDoctor = function (doctor) {
            doctorInforList.getDoctor = doctor;
            $ionicHistory.goBack(-1);
        };

        vm = $scope.vm = {
            search: function () {

                if(vm.query){
                    getUnSignedDoctorsServices.getUnSignedDoctors({
                        doctorName: vm.query
                    }, function (result) {
                        vm.doctors = result.doctors;
                    })
                }else{
                    vm.doctors = null;
                }
            }
        };
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
    }])


    .controller('navigationCtrl',['$scope', '$ionicPopup', '$ionicPopover','$cookies', '$location','doctorUtils', 'ddDoctorInformationServices', 'submitSignDoctorsterServices','doctorInforList', function ($scope, $ionicPopup, $ionicPopover,$cookies, $location,doctorUtils, ddDoctorInformationServices, submitSignDoctorsterServices,doctorInforList) {

        $scope.ctrlScope = $scope;
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        $scope.getDoctor = function () {
            var urlPath = "/doctorList";
            $location.url(urlPath);
        };

        $scope.$on('$ionicView.enter', function () {
//            alert(ddybUserId);
            if (doctorInforList.getDoctor) {
                $scope.ctrlScope.name = doctorInforList.getDoctor.name;
                $scope.ctrlScope.id = doctorInforList.getDoctor.id;
            }

            var alreadySubmitSign = sessionStorage.getItem('alreadySubmitSign');
            if(alreadySubmitSign=="y"){
                $scope.showsHide = true;
            }


        });

        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
                console.log(str);
            });
        };

        //弹出确认对话框
        $scope.showConfirmeSave = function (str) {

            if ($scope.ctrlScope.name == null) {
                showQueue("请选择入驻人!");
            } else {
                var reg =  /^((0\d{2,3}))(-(\d{7,8}))(-(\d{3,}))?$/;
                if (reg.test($scope.ctrlScope.officeTele)) {
                    var information = '<h4 style=" text-align:center;">' + $scope.ctrlScope.name+'<br/>'+ $scope.ctrlScope.officeTele + '</h4>';
                    var confirmPopup = $ionicPopup.confirm({
                        title: '<h4 >确定提交申请吗？</h4>',
                        template: information,
                        cancelText: '取消',
                        okText: '确定'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            var doctorInformation = null;
                            doctorInformation = {
                                "id": $scope.ctrlScope.id,
                                "userId": ddybUserId,
                                "officeTele": $scope.ctrlScope.officeTele
                            };


                            submitSignDoctorsterServices.submitSign({id: $scope.ctrlScope.id,userId: ddybUserId,officeTele: $scope.ctrlScope.officeTele},
                                function (result) {
                                    if(result.responseDesc == "OK"){
                                        showQueue("申请提交成功,工作人员会及时与您联系！");
                                    }else{
                                        showQueue(result.responseDesc);
                                    }
                                    $scope.ctrlScope.officeTele = null;
                                    $scope.ctrlScope.name = null;
                                    $scope.ctrlScope.id=null;
                                });

//                            submitSignDoctorsterServices.submitSign({}, doctorInformation);
                            console.log('完成');
//                            showQueue("申请提交成功,工作人员会及时与您联系！");
                        } else {
                            console.log('取消');
                        }
                    });
                }else{
                    showQueue("请检查科室固话是否输入正确！");
                }
            }
        };
    }])



    .controller('SettingCtrl',['$scope', '$ionicPopup', '$ionicPopover','$cookies', '$location','doctorUtils', 'ddDoctorInformationServices', 'submitSignDoctorsterServices','doctorInforList', function ($scope, $ionicPopup, $ionicPopover,$cookies, $location,doctorUtils, ddDoctorInformationServices, submitSignDoctorsterServices,doctorInforList) {

        $scope.ctrlScope = $scope;
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        $scope.eliminate = function () {

            doctorUtils.setCookie("ddybUserId", "", null, "/", null);
            doctorUtils.setCookie("doctorId", "", null, "/", null);

            showQueue("成功清除缓存！");
        };

        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
                console.log(str);
            });
        };

        $scope.aboutUs = function () {
            var urlPath = "/tab/aboutUs";
            $location.url(urlPath);
        };

    }])

    .controller('QueueListCtrl',['$scope', '$timeout','$cookies','$stateParams', '$ionicPopover','doctorUtils', 'ddRegistersByDoctorIdAndStatusServices', function ($scope, $timeout,$cookies,$stateParams, $ionicPopover,doctorUtils, ddRegistersByDoctorIdAndStatusServices) {
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        $scope.ctrlScope = $scope;
        $scope.$on('$ionicView.enter', function (e) {
            ddRegistersByDoctorIdAndStatusServices.getRegistersByDoctorIdAndStatus({doctorId: doctorId,hospitalId:$stateParams.hospitalId,status:-1}, function (result) {
                $scope.queues = result.registers;
            })
        });

        $scope.doRefresh = function () {
            console.log('Refreshing!');
            $timeout(function () {
                //simulate async response
                ddRegistersByDoctorIdAndStatusServices.getRegistersByDoctorIdAndStatus({doctorId: doctorId,hospitalId:$stateParams.hospitalId,status:-1}, function (result) {
                    $scope.queues = result.registers;
                })
                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
        };
    }])



    .controller('DoctorQueuesCtrl',['$scope', '$timeout', '$cookies', '$ionicPopover','doctorUtils', 'ddGetDoctorQueuesServices','ddDoctorHospitalsServices','ddPatientHistoryServices', function ($scope, $timeout, $cookies, $ionicPopover,doctorUtils, ddGetDoctorQueuesServices,ddDoctorHospitalsServices,ddPatientHistoryServices) {
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        $scope.ctrlScope = $scope;
        $scope.$on('$ionicView.enter', function (e) {
//            ddGetDoctorQueuesServices.getDoctorQueues({doctorId: doctorId}, function (result) {
//                $scope.queues = result.queues;
//                $scope.ctrlScope.queueNum = result.queueNum;
//                $scope.queue = result.queues[0];
//                if ($scope.queues && $scope.queues.length > 0) {
//                    $scope.showOrNot = false;
//                } else {
//                    $scope.showOrNot = true;
//                }
//            })


            ddDoctorHospitalsServices.getDoctorHospitals({doctorId: doctorId}, function (result) {
                $scope.queuesHospitals = result.doctorHospitals;
                if ($scope.queuesHospitals && $scope.queuesHospitals.length > 0) {
                    $scope.showOrNot = false;
                } else {
                    $scope.showOrNot = true;
                }
            })

            ddPatientHistoryServices.queryHistory_Registers({id: doctorId,status:-1}, function (result) {
                $scope.queues = result.registers;
                $scope.ctrlScope.queueNum = 0;
                if ($scope.queues && $scope.queues.length > 0) {
                    $scope.ctrlScope.queueNum =result.registers.length
                    $scope.showOrNot = false;
                } else {
                    $scope.showOrNot = true;
                }
            })

        });

        $scope.doRefresh = function () {
            console.log('Refreshing!');
            $timeout(function () {
                //simulate async response
//                ddGetDoctorQueuesServices.getDoctorQueues({doctorId: doctorId}, function (result) {
//                    $scope.queues = result.queues;
//                    $scope.ctrlScope.queueNum = result.queueNum;
//                });
                //Stop the ion-refresher from spinning

                ddPatientHistoryServices.queryHistory_Registers({id: doctorId,status:-1}, function (result) {
                    $scope.queues = result.registers;
                    $scope.ctrlScope.queueNum = 0;
                    $scope.queue = result.queues[0];
                    if ($scope.queues && $scope.queues.length > 0) {
                        $scope.ctrlScope.queueNum =result.registers.length
                        $scope.showOrNot = false;
                    } else {
                        $scope.showOrNot = true;
                    }
                })
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
        };
    }])


    .controller('DoctorFunsCtrl',['$scope', '$timeout', '$cookies','$stateParams', '$ionicPopover','doctorUtils', 'ddUserServices', 'ddGetDoctorFunsServices', function ($scope, $timeout, $cookies,$stateParams, $ionicPopover,doctorUtils, ddUserServices, ddGetDoctorFunsServices) {
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        $scope.$on('$ionicView.enter', function (e) {
            var vm = $scope.vm = {
                moredata: false,
                doctors: [],
                pagination: {
                    perPage: 15,
                    currentPage: 1
                },
                init: function () {
                    ddGetDoctorFunsServices.getDoctorFuns({
                        doctorId: doctorId,
                        size: vm.pagination.perPage,
                        page: vm.pagination.currentPage,
                        order: 'id',
                        orderBy: 'ASC'
                    }, function (result) {
                        vm.doctorFansNum = result.doctorFans.length;
                        vm.doctorFans = result.doctorFans;
                        angular.forEach(vm.doctorFans, function (data, index, array) {
                            //data等价于array[index]
                            ddUserServices.get({userId: array[index].userId}, function (result) {
                                vm.patient = (result.users)[0];

                                vm.doctorFans[index].headImgUrl = (result.users)[0].headImgUrl;
                                vm.doctorFans[index].fansName = (result.users)[0].name;
                                vm.doctorFans[index].fansAddress = (result.users)[0].address;
                                vm.doctorFans[index].fansGender = (result.users)[0].gender;
                                vm.doctorFans[index].userId = array[index].userId;
                                vm.doctorFans[index].country = (result.users)[0].country;
                                vm.doctorFans[index].province = (result.users)[0].province;
                                vm.doctorFans[index].city = (result.users)[0].city;
                            });
                        });
                        if (vm.doctorFans && vm.doctorFans.length > 0) {
                            $scope.ctrlScope.showOrNot = false;
                        } else {
                            $scope.ctrlScope.showOrNot = true;
                        }
                    })


                },
                doRefresh: function () {
                    console.log('Refreshing!');
                    $timeout(function () {
                        //simulate async response
                        ddGetDoctorFunsServices.getDoctorFuns({
                            doctorId: doctorId,
                            size: 15,
                            page: 1,
                            order: 'id',
                            orderBy: 'ASC'
                        }, function (result) {
                            vm.doctorFans = result.doctorFans;
                            vm.doctorFansNum = result.doctorFans.length;
                            angular.forEach(vm.doctorFans, function (data, index, array) {
                                //data等价于array[index]
                                ddUserServices.get({userId: array[index].userId}, function (result) {
                                    vm.patient = (result.users)[0];
                                    vm.doctorFans[index].headImgUrl = (result.users)[0].headImgUrl;
                                    vm.doctorFans[index].fansName = (result.users)[0].name;
                                    vm.doctorFans[index].fansAddress = (result.users)[0].address;
                                    vm.doctorFans[index].fansGender = (result.users)[0].gender;
                                });
                            });
                        });
                        //Stop the ion-refresher from spinning
                        $scope.$broadcast('scroll.refreshComplete');
                    }, 1000);
                },
                loadMore: function () {
                    vm.pagination.currentPage += 1;
                    if (vm.moredata) {
                        ddGetDoctorFunsServices.getDoctorFuns({
                            doctorId: doctorId,
                            size: vm.pagination.perPage,
                            page: vm.pagination.currentPage,
                            order: 'id',
                            orderBy: 'ASC'
                        }, function (result) {
                            vm.doctorFans = vm.doctorFans.concat(result.doctorFans);
                            if (result.doctorFans && result.doctorFans.length == 0) {
                                vm.moredata = false;
                            }
                            if (result.pages <= vm.pagination.currentPage + 1) vm.moredata = false;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
//                            vm.doctorFansNum = vm.doctorFans.length;
                            angular.forEach(vm.doctorFans, function (data, index, array) {
                                //data等价于array[index]
                                ddUserServices.get({userId: array[index].userId}, function (result) {
                                    vm.patient = (result.users)[0];
                                    vm.doctorFans[index].headImgUrl = (result.users)[0].headImgUrl;
                                    vm.doctorFans[index].fansName = (result.users)[0].name;
                                    vm.doctorFans[index].fansAddress = (result.users)[0].address;
                                    vm.doctorFans[index].fansGender = (result.users)[0].gender;
                                });
                            });
                        })

                    }
                }
            };
            vm.init();
        });

    }])


    .controller('PatientsRegistersCtrl',['$scope', '$timeout', '$cookies', '$ionicPopover','doctorUtils', 'ddUserServices', 'ddPatientRegistersServices', function ($scope, $timeout, $cookies, $ionicPopover,doctorUtils, ddUserServices, ddPatientRegistersServices) {
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');

        $scope.$on('$ionicView.enter', function (e) {

            ddPatientRegistersServices.queryDoctor_Registers({id: doctorId}, function (result) {
                $scope.patients = result.registers;

                angular.forEach($scope.patients, function (data, index, array) {
                    //data等价于array[index]
                    ddUserServices.get({userId: array[index].userId}, function (result) {
                        $scope.patient = (result.users)[0];
                        $scope.patients[index].headImgUrl = (result.users)[0].headImgUrl;
                    });
                });
                if ($scope.patients && $scope.patients.length > 0) {
                    $scope.showOrNot = false;
                } else {
                    $scope.showOrNot = true;
                }
            })
        });

        $scope.doRefresh = function () {
            console.log('Refreshing!');
            $timeout(function () {
                //simulate async response
                ddPatientRegistersServices.queryDoctor_Registers({id: doctorId}, function (result) {
                    $scope.patients = result.registers;
                    angular.forEach($scope.patients, function (data, index, array) {
                        //data等价于array[index]
                        ddUserServices.get({userId: array[index].userId}, function (result) {
                            $scope.patient = (result.users)[0];
                            $scope.patients[index].headImgUrl = (result.users)[0].headImgUrl;
                        });
                    });
                });
                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
        };

    }])

    .controller('PatientsTodayCtrl',['$scope', '$ionicPopover','$cookies', '$timeout', '$stateParams','$ionicHistory','doctorUtils', 'ddPatientServices','ddPatientRegistersServices', 'ddUserServices', 'dateFilter', function ($scope, $ionicPopover,$cookies, $timeout, $stateParams,$ionicHistory,doctorUtils, ddPatientServices,ddPatientRegistersServices, ddUserServices, dateFilter) {
        var today = dateFilter(new Date(), 'yyyy-MM-dd');
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
        var type = "0";
        $scope.showPatient0 = "button  button-positive ";
        $scope.showPatient1 = "button";
        $scope.$on('$ionicView.enter', function (e) {
            if(type == "0"){
                $scope.showPatient0 = "button  button-positive";
                $scope.showPatient1 = "button";
                ddPatientServices.queryMyPatient_Hos_Date({id: doctorId, scheduleDate: today}, function (result) {
                    $scope.patients = result.registers;
                    if ($scope.patients && $scope.patients.length > 0) {
                        $scope.showOrNot = false;
                    } else {
                        $scope.showOrNot = true;
                    }
                    //获得已约患者
                    ddPatientRegistersServices.queryDoctor_Registers({id: doctorId}, function (result) {
                        if (result.registers && result.registers.length > 0) {
                            $scope.registerCount = result.registers.length;
                        }else{
                            $scope.registerCount = 0;
                        }
                    });
                })
            }else{
                $scope.showPatient0 = "button";
                $scope.showPatient1 = "button button-positive";
                ddPatientRegistersServices.queryDoctor_Registers({id: doctorId}, function (result) {
                    $scope.patients = result.registers;
                    if ($scope.patients && $scope.patients.length > 0) {
                        $scope.showOrNot = false;
                        $scope.registerCount = $scope.patients.length;
                    } else {
                        $scope.showOrNot = true;
                    }
                });
            }
        });

        $scope.showPatient = function (str) {

            if (str == "0") {
                type = "0"
                $scope.showPatient1 = "button";
                $scope.showPatient0 = "button button-positive";
                $scope.calendarHide = true;
                $scope.showsHide = true;
                ddPatientServices.queryMyPatient_Hos_Date({id: doctorId, scheduleDate: today}, function (result) {
                    $scope.patients = result.registers
                    if ($scope.patients && $scope.patients.length > 0) {
                        $scope.showOrNot = false;
                    } else {
                        $scope.showOrNot = true;
                    }
                });
            } else {
                type = "1"
                $scope.showPatient0 = "button";
                $scope.showPatient1 = "button button-positive";
                ddPatientRegistersServices.queryDoctor_Registers({id: doctorId}, function (result) {
                    $scope.patients = result.registers;

//                    angular.forEach($scope.patients, function (data, index, array) {
//                        //data等价于array[index]
//                        ddUserServices.get({userId: array[index].userId}, function (result) {
//                            $scope.patient = (result.users)[0];
//                            $scope.patients[index].headImgUrl = (result.users)[0].headImgUrl;
//                        });
//                    });
                    if ($scope.patients && $scope.patients.length > 0) {
                        $scope.showOrNot = false;
                        $scope.registerCount = $scope.patients.length;
                    } else {
                        $scope.showOrNot = true;
                    }
                });
            }
        };



        $scope.doRefresh = function () {
            console.log('Refreshing!');
            $timeout(function () {
                if(type == "0"){
                    $scope.showPatient0 = "button  button-positive";
                    $scope.showPatient1 = "button";
                    ddPatientServices.queryMyPatient_Hos_Date({id: doctorId, scheduleDate: today}, function (result) {
                        $scope.patients = result.registers;

                        //用上patient表的话，患者头像就都缺省一样了，因为患者没有头像，用户不一定是患者
//                angular.forEach($scope.patients, function(data,index,array){
//                    //data等价于array[index]
//                    ddUserServices.get({userId:array[index].userId},function(result){
//                        $scope.patient=(result.users)[0];
//                        $scope.patients[index].headImgUrl = (result.users)[0].headImgUrl;
//                    });
//                });
                        if ($scope.patients && $scope.patients.length > 0) {
                            $scope.showOrNot = false;
                        } else {
                            $scope.showOrNot = true;
                        }
                    })
                }else{
                    $scope.showPatient0 = "button";
                    $scope.showPatient1 = "button button-positive";
                    ddPatientRegistersServices.queryDoctor_Registers({id: doctorId}, function (result) {
                        $scope.patients = result.registers;

                        angular.forEach($scope.patients, function (data, index, array) {
                            //data等价于array[index]
                            ddUserServices.get({userId: array[index].userId}, function (result) {
                                $scope.patient = (result.users)[0];
                                $scope.patients[index].headImgUrl = (result.users)[0].headImgUrl;
                            });
                        });
                        if ($scope.patients && $scope.patients.length > 0) {
                            $scope.showOrNot = false;
                        } else {
                            $scope.showOrNot = true;
                        }
                    });

                }
                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

    }])

    .controller('PatientsHistoryCtrl',[ '$scope', '$timeout','$cookies','$ionicHistory', '$ionicPopover', 'doctorUtils', 'ddUserServices', 'ddPatientHistoryServices', function ($scope, $timeout,$cookies, $ionicHistory, $ionicPopover,doctorUtils, ddUserServices, ddPatientHistoryServices) {
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');

        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
        $scope.$on('$ionicView.enter', function (e) {
            ddPatientHistoryServices.queryHistory_Registers({id: doctorId, status: 3}, function (result) {
                $scope.patients = result.registers;
                ddPatientHistoryServices.queryHistory_Registers({id: doctorId, status: 5}, function (result) {
                    $scope.patients = $scope.patients.concat(result.registers);
                    if ($scope.patients && $scope.patients.length > 0) {
                        $scope.showOrNot = false;
                    } else {
                        $scope.showOrNot = true;
                    }
                })
            });

        });

        $scope.doRefresh = function () {
            console.log('Refreshing!');
            $timeout(function () {
                ddPatientHistoryServices.queryHistory_Registers({id: doctorId, status: 3}, function (result) {
                    $scope.patients = result.registers;
                    ddPatientHistoryServices.queryHistory_Registers({id: doctorId, status: 5}, function (result) {
                        $scope.patients = $scope.patients.concat(result.registers);
                        if ($scope.patients && $scope.patients.length > 0) {
                            $scope.showOrNot = false;
                        } else {
                            $scope.showOrNot = true;
                        }
                    })
                });
                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
        };
    }])
    .controller('PatientDetailCtrl',['$scope', '$stateParams', '$ionicHistory', '$location', '$ionicPopup', '$filter', 'getDoctorEvalsByRegisterServices', 'ddPatientDetailServices', 'ddRegistersServices', 'ddUserServices', 'ddPatientCondServices', 'ddPatientFinishTreatmentServices', 'dateFilter', function ($scope, $stateParams, $ionicHistory, $location, $ionicPopup, $filter, getDoctorEvalsByRegisterServices, ddPatientDetailServices, ddRegistersServices, ddUserServices, ddPatientCondServices, ddPatientFinishTreatmentServices, dateFilter) {

        ddPatientDetailServices.get({patientId: $stateParams.patientId}, function (result) {
            $scope.patient = (result.patients)[0];
        });


        if($stateParams.patientType == "patientsRegisters"){
            $scope.showsHideButton = true;
        }else{
            $scope.showsHideButton = false;
        }

        ddRegistersServices.get({id: $stateParams.registerId}, function (result) {
            $scope.register = (result.registers)[0];
            if($scope.register.attachUrls){
                $scope.showOrNot = false;
                $scope.yusFiles = $scope.register.attachUrls.split(",");
            }else {
                $scope.showOrNot = true;
            }
        });

        $scope.bigImage = false;    //初始默认大图是隐藏的
        $scope.hideBigImage = function () {
            $scope.bigImage = false;
        };
//点击图片放大
        $scope.shouBigImage = function (imageName) {  //传递一个参数（图片的URl）
            $scope.Url = imageName;                   //$scope定义一个变量Url，这里会在大图出现后再次点击隐藏大图使用
            $scope.bigImage = true;                   //显示大图
        };

        getDoctorEvalsByRegisterServices.getDoctorEvalsByRegisterId({registerId: $stateParams.registerId}, function (result) {
            $scope.doctorEvals = result.doctorEvals;
        });


        $scope.expanderTitle = '病情简介';
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
                console.log(str);
            });
        };
        //弹出确认对话框
        $scope.showConfirm = function (str) {
            var information = '<h4 style=" text-align:center;">您确定已完成患者 ' + $scope.patient.name + ' 的诊疗吗？' + '</h4>';
            var confirmPopup = $ionicPopup.confirm({
                title: '<h4 >完成诊疗确认</h4>',
                template: information,
                cancelText: '取消',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {

                    ddPatientFinishTreatmentServices.finishTreatment({registerId: $stateParams.registerId}, function (result) {
                        var urlPath = '/patientsToday';
                        $location.url(urlPath);

                        var message = "诊疗完成。恭喜您获得"+result.bonusScore+"个咚咚币，辛苦了！"
                        showQueue(message);
                    });
                    console.log('完成');
                } else {
                    console.log('取消');
                }
            });
        };

        // 触发一个按钮点击，或一些其他目标
        $scope.showPopup = function () {
            $scope.data = {};
            // 一个精心制作的自定义弹窗
            var myPopup = $ionicPopup.show({
                template: '评分：<input type="number" ng-model="data.evaluationScore"><br>评语：<input type="text" ng-model="data.evaluationDesc">',
                title: '请输入评语',
                subTitle: '请公正客观的进行评价！',
                scope: $scope,
                buttons: [
                    {text: '取消'},
                    {
                        text: '<b>保存</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.evaluationScore && !$scope.data.evaluationDesc) {
                                //不允许用户关闭，除非他键入wifi密码
                                e.preventDefault();
                            } else {
                                return $scope.data.evaluationScore + !$scope.data.evaluationDesc;
                            }
                        }
                    }
                ]
            });
        };

    }])
    .controller('DoctorHospitalCtrl',['$scope','$ionicHistory', '$ionicPopover', '$cookies','$stateParams', '$timeout', 'doctorUtils','ddDoctorHospitalsServices', 'ddDeleteDoctorHospitalServices', function ($scope,$ionicHistory, $ionicPopover, $cookies,$stateParams, $timeout,doctorUtils, ddDoctorHospitalsServices, ddDeleteDoctorHospitalServices) {
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        $scope.$on('$ionicView.enter', function (e) {

            ddDoctorHospitalsServices.getDoctorHospitals({doctorId: doctorId}, function (result) {
                $scope.hospitals = result.doctorHospitals;
            })

        });
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
        $scope.doRefresh = function () {

            console.log('Refreshing!');
            $timeout(function () {
                //simulate async response
                ddDoctorHospitalsServices.getDoctorHospitals({doctorId: doctorId}, function (result) {
                    $scope.hospitals = result.doctorHospitals;
                });

                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
        };

        $scope.remove = function (doctorHospital) {
            ddDeleteDoctorHospitalServices.deleteDoctorHospital({id: doctorHospital.id}, function (result) {
                ddDoctorHospitalsServices.getDoctorHospitals({doctorId: doctorId}, function (result) {
                    $scope.hospitals = result.doctorHospitals;
                })
            });
            console.log('完成');
        };
    }])


    .controller('HospitalListCtrl',['$scope', '$ionicPopover','$cookies', '$ionicHistory', '$stateParams', '$timeout','doctorUtils', 'ddHospitalsServices', 'ddHospitalsByFilterTextServices', 'doctorInforList', function ($scope, $ionicPopover,$cookies, $ionicHistory, $stateParams, $timeout,doctorUtils, ddHospitalsServices, ddHospitalsByFilterTextServices, doctorInforList) {

        $scope.ctrlScope = $scope;
        //叮咚名医列表
        $scope.$on('$ionicView.enter', function (e) {
            doctorInforList.getDept = null;
        });
        var vm = $scope.vm = {
            moredata: true,
            hospitals: [],
            pagination: {
                perPage: 15,
                currentPage: 1
            },
            afterInit: false,
            init: function () {
                ddHospitalsServices.getHospitals({
                    size: vm.pagination.perPage,
                    page: vm.pagination.currentPage,
                    orderBy: 'name',
                    order: 'ASC'
                }, function (result) {
                    vm.hospitals = result.hospitals;
                    vm.afterInit = true;
                    if (result.pages <= vm.pagination.currentPage + 1) vm.moredata = false;
                })
            },
            doRefresh: function () {
                $timeout(function () {

                    $scope.$broadcast('scroll.refreshComplete');

                }, 1000);
            },
            loadMore: function () {
                vm.pagination.currentPage += 1;
                if (vm.moredata&& vm.afterInit) {
                    ddHospitalsServices.getHospitals({
                        size: vm.pagination.perPage,
                        page: vm.pagination.currentPage,
                        orderBy: 'name',
                        order: 'ASC'
                    }, function (result) {
                        vm.hospitals = vm.hospitals.concat(result.hospitals);
                        if (result.hospitals && result.hospitals.length == 0) {
                            vm.moredata = false;
                        }
                        if (result.pages <= vm.pagination.currentPage + 1) vm.moredata = false;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    })
                }

            }
        };
        vm.init();

        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');

        $scope.vm.getHospital = function (doctorHospital) {
            doctorInforList.getHospital = doctorHospital;
            $ionicHistory.goBack(-1);
        };
    }])


    .controller('HospitalDeptListCtrl',['$scope','$cookies', '$ionicPopover', '$ionicHistory', '$stateParams', '$timeout', 'doctorUtils','ddHospitalDeptsServices', 'doctorInforList', function ($scope,$cookies, $ionicPopover, $ionicHistory, $stateParams, $timeout, doctorUtils,ddHospitalDeptsServices, doctorInforList) {


        $scope.ctrlScope = $scope;
        //叮咚名医列表
        $scope.$on('$ionicView.enter', function (e) {
            doctorInforList.getDept = null;
            $scope.goBack = function () {
                $ionicHistory.goBack(-1);
            };
        });
        var vm = $scope.vm = {
            moredata: true,
            hospitalDepts: [],
            pagination: {
                perPage: 15,
                currentPage: 1
            },
            afterInit: false,
            init: function () {
                ddHospitalDeptsServices.getHospitalDepts({
                    id: $stateParams.hospitalId,
                    size: vm.pagination.perPage,
                    page: vm.pagination.currentPage
                }, function (result) {
                    vm.hospitalDepts = result.hospitalDepts;
                    vm.afterInit = true;
                    if (result.pages <= vm.pagination.currentPage + 1) vm.moredata = false;
                })
            },
            doRefresh: function () {
                $timeout(function () {

                    $scope.$broadcast('scroll.refreshComplete');

                }, 1000);
            },
            loadMore: function () {
                vm.pagination.currentPage += 1;
                if (vm.moredata && vm.afterInit) {
                    ddHospitalDeptsServices.getHospitalDepts({
                        id: $stateParams.hospitalId,
                        size: vm.pagination.perPage,
                        page: vm.pagination.currentPage
                    }, function (result) {
                        vm.hospitalDepts = vm.hospitalDepts.concat(result.hospitalDepts);
                        if (result.hospitalDepts && result.hospitalDepts.length == 0) {
                            vm.moredata = false;
                        }
                        if (result.pages <= vm.pagination.currentPage + 1) vm.moredata = false;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    })

                }

            }
        };
        vm.init();

        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');

        $scope.vm.getDept = function (dept) {
            doctorInforList.getDept = dept;
            $ionicHistory.goBack(-1);
        };
    }])


    .controller('DoctorHospitalAddCtrl',['$scope', '$location', '$ionicPopover', '$ionicPopup','doctorUtils', 'ddAddDoctorHospitalServices', 'doctorInforList', function ($scope, $location, $ionicPopover, $ionicPopup,doctorUtils, ddAddDoctorHospitalServices, doctorInforList) {
        $scope.ctrlScope = $scope;
        //弹出确认对话框
        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
                console.log(str);
            });
        };

        $scope.getHospital = function () {
            var urlPath = "/hospitalList";
            $location.url(urlPath);
        };

        $scope.getDept = function (hospitalId) {
            if (hospitalId) {
                var urlPath = "/hospitalDeptList/" + hospitalId;
                $location.url(urlPath);
            } else {
                showQueue("请先选择医院！");
            }
        };

        $scope.$on('$ionicView.enter', function () {

            $scope.ctrlScope.hospitalName = "";
            $scope.ctrlScope.hospitalId = "";
            $scope.ctrlScope.deptName = "";
            $scope.ctrlScope.deptId = "";

            if (doctorInforList.getHospital) {
                $scope.ctrlScope.hospitalName = doctorInforList.getHospital.name;
                $scope.ctrlScope.hospitalId = doctorInforList.getHospital.id;
            } else {

            }

            if (doctorInforList.getDept && doctorInforList.getHospital) {
                $scope.ctrlScope.deptName = doctorInforList.getDept.deptName;
                $scope.ctrlScope.deptId = doctorInforList.getDept.deptId;
            } else {

            }
        });


        $scope.showConfirmeAdd = function (str) {

            if ($scope.ctrlScope.hospitalName == null || $scope.ctrlScope.deptName == null || $scope.ctrlScope.minQueue == null || $scope.ctrlScope.registerFee == null) {
                showQueue("请补充完各项信息！");
            } else {
                var information = '<h4 style=" text-align:center;">' + $scope.ctrlScope.hospitalName + $scope.ctrlScope.deptName + '</h4>';
                var confirmPopup = $ionicPopup.confirm({
                    title: '<h4 >确定添加吗？</h4>',
                    template: information,
                    cancelText: '取消',
                    okText: '确定'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        var doctorHospital = null;
                        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
                        var doctorId =  doctorUtils.getCookies('doctorId');
                        doctorHospital = {
                            "deptId": $scope.ctrlScope.deptId,
                            "deptName": $scope.ctrlScope.deptName,
                            "doctorId": doctorId,
                            "hospitalId": $scope.ctrlScope.hospitalId,
                            "hospitalName": $scope.ctrlScope.hospitalName,
                            "minQueue": $scope.ctrlScope.minQueue,
                            "registerFee": $scope.ctrlScope.registerFee,
                            "requestStatus": 0
                        };

                        ddAddDoctorHospitalServices.addDoctorHospital({}, doctorHospital);
                        console.log(doctorHospital);
                        var urlPath = '/scheduleHospitals';
                        $location.url(urlPath);
                    } else {
                        console.log('取消');
                    }
                });
            }
        };
    }])


    .controller('EnchashmentCtrl',['$scope', '$location', '$ionicPopover', '$ionicPopup', 'ddAddDoctorHospitalServices','ddDoctorCashApplyServices', 'doctorInforList', function ($scope, $location, $ionicPopover, $ionicPopup, ddAddDoctorHospitalServices,ddDoctorCashApplyServices, doctorInforList) {
        $scope.ctrlScope = $scope;
        //弹出确认对话框
        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({
                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
                console.log(str);
            });
        };


        $scope.getCard = function () {
            var urlPath = "/tab/accountList/getCard";
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
                var information = '<h4 style=" text-align:center;">' + $scope.ctrlScope.bankName +"<br/>"+ $scope.ctrlScope.cardNumber +"<br/>"+ $scope.ctrlScope.cardName+ '</h4>';
                var confirmPopup = $ionicPopup.confirm({
                    title: '<h4 >确定提交取现申请吗？</h4>',
                    template: information,
                    cancelText: '取消',
                    okText: '确定'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        ddDoctorCashApplyServices.postCashApply({accountId: doctorInforList.card.id,amount:  $scope.ctrlScope.amount}, function (result) {
                            showQueue(result.responseDesc);
                            var urlPath = '/tab/wxpay';
                            $location.url(urlPath);
                        });

                    } else {
                        console.log('取消');
                    }
                });
            }
        };
    }])


    .controller('DoctorHospitalDetailCtrl',['$scope', '$cookies','$stateParams', '$ionicHistory', '$location', '$ionicPopup', '$ionicPopover', '$filter','doctorUtils', 'doctorInforList', 'ddUpdateDoctorHospitalStatusServices', 'ddDoctorHospitalDetailServices', 'ddUpdateDoctorHospitalServices', function ($scope, $cookies,$stateParams, $ionicHistory, $location, $ionicPopup, $ionicPopover, $filter,doctorUtils, doctorInforList, ddUpdateDoctorHospitalStatusServices, ddDoctorHospitalDetailServices, ddUpdateDoctorHospitalServices) {

        $scope.ctrlScope = $scope;

        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        ddDoctorHospitalDetailServices.get({id: $stateParams.id}, function (result) {
            $scope.hospital = result.doctorHospitals[0];
            $scope.ctrlScope.minQueue = result.doctorHospitals[0].minQueue;
            $scope.ctrlScope.registerFee = result.doctorHospitals[0].registerFee;
            $scope.ctrlScope.mainFlag = result.doctorHospitals[0].mainFlag;
            $scope.ctrlScope.deptId = result.doctorHospitals[0].deptId;
            $scope.ctrlScope.deptName = result.doctorHospitals[0].deptName;
            $scope.ctrlScope.requestDesc = result.doctorHospitals[0].requestDesc;
            $scope.ctrlScope.registerStatus = $filter('hospitalFilter')(result.doctorHospitals[0].status);
        });
        $scope.$on('$ionicView.enter', function () {


            if (doctorInforList.getDept) {
                $scope.ctrlScope.deptName = doctorInforList.getDept.deptName;
                $scope.ctrlScope.deptId = doctorInforList.getDept.deptId;
            } else {

            }

            $scope.goBack = function () {
                $ionicHistory.goBack(-1);
            };
        });


        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
                console.log(str);
            });
        };


        //弹出确认对话框
        $scope.showConfirmSave = function (str) {
            ddUpdateDoctorHospitalServices.updateDoctorHospital({
                id: $stateParams.id,
                deptName: $scope.ctrlScope.deptName,
                minQueue: $scope.ctrlScope.minQueue,
                registerFee: $scope.ctrlScope.registerFee,
                status: $filter('hospitalRevFilter')($scope.ctrlScope.registerStatus)
            }, function (result) {
                showQueue("保存成功!");
                $location.url('/scheduleHospitals');
            });
        };

        $scope.getDept = function () {
            if ($stateParams.hospitalId) {
                var urlPath = "/hospitalDeptList/" + $stateParams.hospitalId;
                $location.url(urlPath);
            } else {
                showQueue("请先选择医院！");
            }
        };

    }])


    .controller('EvaluationsCtrl',['$scope', '$ionicPopover', 'ddEvaluationServices', function ($scope, $ionicPopover, ddEvaluationServices) {
        $scope.patients = ddEvaluationServices.getEvaluationsByDoctor();
        var promise = ddEvaluationServices.getEvaluationsByDoctor();
        promise.then(function (data) {
            $scope.evaluations = data;
        }, function (data) {
            $scope.evaluations = {error: '找不到评价信息！'};
        });
    }])

    .controller('EvaluationDetailCtrl',['$scope', '$stateParams', '$ionicPopup', '$filter', 'ddEvaluationServices', 'dateFilter', function ($scope, $stateParams, $ionicPopup, $filter, ddEvaluationServices, dateFilter) {
        $scope.evaluation = ddEvaluationServices.get($stateParams.evaluationId);
        $scope.expanderTitle = '评价内容：';

        // 触发一个按钮点击，或一些其他目标
        $scope.showPopup = function () {
            $scope.data = {};

            // 一个精心制作的自定义弹窗
            var myPopup = $ionicPopup.show({
                template: '评分：<input type="number" ng-model="data.evaluationScore"><br>评语：<input type="text" ng-model="data.evaluationDesc">',
                title: '请输入评语',
                subTitle: '请公正客观的进行评价！',
                scope: $scope,
                buttons: [
                    {text: '取消'},
                    {
                        text: '<b>保存</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.evaluationScore && !$scope.data.evaluationDesc) {

                                e.preventDefault();

                            } else {
                                return $scope.data.evaluationScore + !$scope.data.evaluationDesc;
                            }
                        }
                    }
                ]
            });
        };
    }])

    .controller('ScheduleCtrl',['$scope', '$ionicHistory','$timeout', '$cookies','$location', '$rootScope', '$stateParams', '$filter', '$ionicPopup','doctorUtils', 'dateFilter', 'ddPostponeScheduleByIdServices', 'ddDoctorSchedulesServices', 'ddDoctorScheduleDatesServices', function ($scope,$ionicHistory, $timeout, $cookies,$location, $rootScope, $stateParams, $filter, $ionicPopup,doctorUtils, dateFilter, ddPostponeScheduleByIdServices, ddDoctorSchedulesServices, ddDoctorScheduleDatesServices) {
        $scope.ctrlScope = $scope;
        var currentdate = new Date();
        $scope.calendar = {};
        $scope.calendar.mode = 'month';
        sessionStorage.setItem('currentDate', beginDate);
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var ddyzUserId =  doctorUtils.getCookies('ddyzUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        var scheduleList = $scope.schduleDateList = [];
        var nowTime = new Date();
        var beginDate = dateFilter(nowTime, 'yyyy-MM-dd');
        var endTime = new Date(nowTime.valueOf() + 1 * 24 * 60 * 60 * 1000 * 30);
        var endDate = dateFilter(endTime, 'yyyy-MM-dd');

        sessionStorage.setItem('currentDate', beginDate);
        $scope.shows = true;

        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };

        $scope.$on('$ionicView.enter', function (e) {

            if(ddyzUserId==null || ddyzUserId==""){
                $scope.addHide = true;
            }else{
                $scope.addHide = false;
            }

            $scope.scheduleType0 = "button";
            $scope.scheduleType1 = "button button-positive";
            $scope.calendarHide = false;
            ddDoctorScheduleDatesServices.getDoctorScheduleDates({
                doctorId: doctorId,
                beginDate: beginDate,
                endDate: endDate
            }, function (result) {
                $scope.schedules = $scope.schduleDateList = result.schduleDateList;
                $scope.showsHide = true;

                var current = sessionStorage.getItem('currentDate');
                if (current != 'undefined') {
                    ddDoctorSchedulesServices.getDoctorSchedules({
                        doctorId: doctorId,
                        beginDate: current,
                        endDate: current
                    }, function (result) {
                        $scope.showsHide = false;
                        $scope.schedules = result.schedules;
                    });
                }
            });
        });

        $scope.showSchedule = function (str) {

            if (str == "0") {
                $scope.scheduleType1 = "button";
                $scope.scheduleType0 = "button button-positive";
                $scope.calendarHide = true;
                $scope.showsHide = true;
                ddDoctorSchedulesServices.getDoctorSchedules({
                    doctorId: doctorId,
                    beginDate: beginDate,
                    endDate: endDate
                }, function (result) {
                    $scope.schedules = result.schedules;
                    $scope.showsHide = false;
                });
            } else {
                $scope.scheduleType0 = "button";
                $scope.scheduleType1 = "button button-positive";
                $scope.calendarHide = false;
                ddDoctorScheduleDatesServices.getDoctorScheduleDates({
                    doctorId: doctorId,
                    beginDate: beginDate,
                    endDate: endDate
                }, function (result) {
                    $scope.schedules = $scope.schduleDateList = result.schduleDateList;
                    $scope.showsHide = true;

                    var current = sessionStorage.getItem('currentDate');
                    if (current != 'undefined') {
                        ddDoctorSchedulesServices.getDoctorSchedules({
                            doctorId: doctorId,
                            beginDate: current,
                            endDate: current
                        }, function (result) {
                            $scope.showsHide = false;
                            $scope.schedules = result.schedules;
                        });
                    }
                });
            }
        };


        ddDoctorSchedulesServices.getDoctorSchedules({
            doctorId: doctorId,
            beginDate: beginDate,
            endDate: beginDate
        }, function (result) {
            $scope.schedules = result.schedules;
        });
        var selectedDateTime = nowTime;
        var selectedDate = dateFilter(selectedDateTime, 'yyyy-MM-dd');
        $scope.onTimeSelected = function (selectedTime) {
            selectedDateTime = selectedTime;
            selectedDate = dateFilter(selectedTime, 'yyyy-MM-dd');
            $scope.timeTitle = selectedDate;
            if (selectedDate >= beginDate) {
                ddDoctorSchedulesServices.getDoctorSchedules({
                    doctorId: doctorId,
                    beginDate: selectedDate,
                    endDate: selectedDate
                }, function (result) {
                    $scope.showsHide = false;
                    $scope.schedules = result.schedules;
                });
            }
            sessionStorage.setItem('currentDate', selectedDate);
        };
        $scope.onEventSelected = function (event) {
            console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
        };
        $scope.onTimeTitleChanged = function (title) {
            $scope.timeTitle = title;
        };

        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
                console.log(str);
            });
        };

        //弹出确认对话框
        $scope.showConfirmeAdd = function (str) {
            if ((selectedDate >= beginDate) && (selectedDateTime.valueOf() - nowTime.valueOf()) < 1 * 24 * 60 * 60 * 1000 * 30) {
                var urlPath = '/scheduleDoctorHospitals';
                $location.url(urlPath);
            } else {
                showQueue("请添加30天以内的行程！");
            }
        };

        //弹出确认对话框
        $scope.delaychedule = function (schedule) {
//            var message = '<h4 style=" text-align:center;">' + schedule.hospitalName+'<br/>' +  schedule.scheduleDate+ $filter('timeSlot')(schedule.timeSlot) +'</h4>';
//            var confirmPopup = $ionicPopup.confirm({
//                title: '<h4 >您确定推迟如下行程吗？</h4>',
//                template: message,
//                cancelText: '取消',
//                okText: '确定'
//            });
//            confirmPopup.then(function (res) {
//                if (res) {
//                    ddPostponeScheduleByIdServices.postponeScheduleById({id:schedule.id},function(result){
//
//                    });
//                    ddDoctorScheduleDatesServices.getDoctorScheduleDates({doctorId:doctorId,beginDate:beginDate,endDate:endDate},function(result){
//                        $scope.schedules= $scope.schduleDateList =result.schduleDateList;
//                        $scope.showsHide = true;
//
//                        var current=sessionStorage.getItem('currentDate');
//                        ddDoctorSchedulesServices.getDoctorSchedules({doctorId:doctorId,beginDate:current,endDate:current},function(result){
//                            $scope.showsHide = false;
//                            $scope.schedules =result.scheduleList;
//                        });
//                    });
//                    showQueue("成功推迟本行程！");
//                } else {
//                    console.log('取消');
//                }
//            });

            var urlPath = 'tab/postponeSchedule/' + schedule.id;
            $location.url(urlPath);
        };
    }])

    .controller('AddScheduleCtrl',['$scope','$ionicHistory', '$filter', '$location', '$ionicPopover', '$ionicPopup', '$stateParams','doctorUtils', 'ddAddScheduleServices', 'ddDoctorHospitalDetailServices', function ($scope,$ionicHistory, $filter, $location, $ionicPopover, $ionicPopup, $stateParams,doctorUtils, ddAddScheduleServices, ddDoctorHospitalDetailServices) {
        $scope.ctrlScope = $scope;
        $scope.timeSlotList = [{"name": "全天", "value": 0}, {"name": "上午", "value": 1},
            {"name": "下午", "value": 2}, {"name": "晚上", "value": 3}];

        $scope.datepickerObject = {
            setButtonType: 'button-assertive',  //Optional
            inputDate: sessionStorage.getItem('currentDate'),  //Optional
            mondayFirst: true,  //Optional
            templateType: 'modal', //Optional
            showTodayButton: 'true', //Optional
            modalHeaderColor: 'bar-positive', //Optional
            modalFooterColor: 'bar-positive', //Optional
            from: new Date(1910, 8, 2), //Optional
            to: new Date(2030, 8, 25),  //Optional
            callback: function (val) {    //Mandatory
                datePickerCallback(val);
            }
        };
        var doctorHospital = null;
        ddDoctorHospitalDetailServices.get({id: $stateParams.doctorHospitalId}, function (result) {
            $scope.hospital = result.doctorHospitals[0];
            $scope.ctrlScope.minQueue = result.doctorHospitals[0].minQueue;
            $scope.ctrlScope.registerFee = result.doctorHospitals[0].registerFee;
            $scope.ctrlScope.deptName = result.doctorHospitals[0].deptName;
            $scope.ctrlScope.hospitalName = result.doctorHospitals[0].hospitalName;
            $scope.ctrlScope.timeSlot = 0;
            doctorHospital = result.doctorHospitals[0];
        });
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
        //弹出确认对话框
        $scope.showConfirmeAdd = function (str) {
            var orderTime = '<h4 style=" text-align:center;">' + doctorHospital.hospitalName + '<br/>' + $filter('dateTranfer')(sessionStorage.getItem('currentDate')) + $filter('timeSlot')($scope.ctrlScope.timeSlot) + '</h4>';
            var confirmPopup = $ionicPopup.confirm({
                title: '<h4 >您确定添加如下行程吗？</h4>',
                template: orderTime,
                cancelText: '取消',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    //添加预约信息
                    var schedule = null;
                    var ddybUserId =  doctorUtils.getCookies('ddybUserId');
                    var doctorId =  doctorUtils.getCookies('doctorId');
                    var ddyzUserId =  doctorUtils.getCookies('ddyzUserId');
                    var  creatorId = ddyzUserId
                    if(ddyzUserId==null || ddyzUserId ==""){
                        creatorId = ddybUserId;
                    }
                    var hospitalId = doctorHospital.hospitalId;

                    schedule = {
                        "doctorId": doctorId,
                        "hospitalId": hospitalId,
                        "issueNum": $scope.ctrlScope.minQueue,
                        "scheduleDate": (sessionStorage.getItem('currentDate')),
                        "timeSlot": $scope.ctrlScope.timeSlot,
                        "creatorId":creatorId
                    };

                    ddAddScheduleServices.addSchedule({
                        doctorId: doctorId,
                        hospitalId: hospitalId,
                        issueNum: $scope.ctrlScope.minQueue,
                        scheduleDate: (sessionStorage.getItem('currentDate')),
                        timeSlot: $scope.ctrlScope.timeSlot,
                        creatorId:creatorId

                    }, function (result) {
                        showQueue("添加成功!");
                        console.log(schedule);
                        if(ddyzUserId==null || ddyzUserId ==""){
                            var urlPath = 'tab/schedules';
                            $location.url(urlPath);
                        }else{
                            var urlPath = '/schedules';
                            $location.url(urlPath);
                        }

                    });


                } else {
                    console.log('取消');
                }
            });
        };
    }])

    .controller('PostponeScheduleCtrl',['$scope', '$filter', '$location', '$ionicHistory', '$ionicPopover', '$ionicPopup', '$stateParams', 'dateFilter', 'ddAddScheduleServices', 'ddDoctorHospitalDetailServices', 'ddPostponeScheduleServices', function ($scope, $filter, $location, $ionicHistory, $ionicPopover, $ionicPopup, $stateParams, dateFilter, ddAddScheduleServices, ddDoctorHospitalDetailServices, ddPostponeScheduleServices) {
        $scope.ctrlScope = $scope;

        var data = new Date();

        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
        $scope.datepickerObject = {
            setButtonType: 'button-assertive',  //Optional
            inputDate: new Date(),  //Optional
            mondayFirst: true,  //Optional
            templateType: 'modal', //Optional
            showTodayButton: 'true', //Optional
            modalHeaderColor: 'bar-positive', //Optional
            modalFooterColor: 'bar-positive', //Optional
            from: new Date(1910, 8, 2), //Optional
            to: new Date(2030, 8, 25),  //Optional
            callback: function (val) {    //Mandatory
                datePickerCallback(val);
            }
        };
        var datePickerCallback = function (val) {
            if (typeof(val) === 'undefined') {
                console.log('No date selected');
            } else {
                $scope.datepickerObject.inputDate = val;
                console.log('Selected date is : ', val)
            }
        };
        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
                console.log(str);
            });
        };

        $scope.postponeSchedule = function () {
            ddPostponeScheduleServices.postponeSchedule({
                id: $stateParams.scheduleId,
                scheduleDate: dateFilter($scope.datepickerObject.inputDate, 'yyyy-MM-dd')
            }, function (result) {
                showQueue("延迟成功！");

                var urlPath = 'tab/schedules';
                $location.url(urlPath);

            });
        }
    }])


    .controller('ScheduleDetailCtrl',['$scope', '$timeout','$cookies','$stateParams', '$filter', '$location','doctorUtils',  'ddDoctorSchedulesServices', function ($scope, $timeout,$cookies, $stateParams, $filter, $location,doctorUtils, ddDoctorSchedulesServices) {

        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        ddDoctorSchedulesServices.getDoctorSchedules({
            doctorId: doctorId,
            beginDate: $stateParams.selectedDate,
            endDate: $stateParams.selectedDate
        }, function (result) {
            $scope.schedules = result.scheduleList;
        });

        $scope.doRefresh = function () {

            console.log('Refreshing!');
            $timeout(function () {
                //simulate async response
                ddDoctorSchedulesServices.getDoctorSchedules({
                    doctorId: doctorId,
                    beginDate: $stateParams.selectedDate,
                    endDate: $stateParams.selectedDate
                }, function (result) {
                    $scope.schedules = result.scheduleList;
                });

                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
        };

        //弹出确认对话框
        $scope.showConfirmeRgister = function (str) {
            var orderTime = '<h4 style=" text-align:center;">' + $filter('dateTranfer')(sessionStorage.getItem('currentDate')) + str + '</h4>';
            var urlPath = 'tab/scheduleDoctorHospitals';
            $location.url(urlPath);
        };
    }])


    .controller('FunInformationCtrl',['$scope', '$timeout','$cookies','$ionicHistory', '$stateParams', '$filter', '$location','doctorUtils', 'ddUserServices', 'getRegisterByStatusServices', function ($scope, $timeout,$cookies,$ionicHistory, $stateParams, $filter, $location,doctorUtils, ddUserServices, getRegisterByStatusServices) {

        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        $scope.$on('$ionicView.enter', function (e) {
            $scope.goBack = function () {
                $ionicHistory.goBack(-1);
            };
            ddUserServices.get({userId: $stateParams.userId}, function (result) {
                $scope.user = result.users[0];
            });

            getRegisterByStatusServices.getRegisterByStatus({
                userId: $stateParams.userId,
                status: 5
            }, function (result) {
                $scope.registersHistorys = result.registers;
                if ($scope.registersHistorys && $scope.registersHistorys.length > 0) {
                    $scope.showOrNot = false;
                } else {
                    $scope.showOrNot = true;
                }
            })
        });
    }])

    .controller('UserTransferCtrl',['$scope', '$timeout','$cookies', '$stateParams', '$filter', '$location','$ionicPopup','doctorUtils', 'ddUserServices', 'ddUserTransfersServices', function ($scope, $timeout,$cookies, $stateParams, $filter, $location,$ionicPopup,doctorUtils,  ddUserServices,ddUserTransfersServices) {

        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        $scope.expanderTitle = '账户明细';
        $scope.$on('$ionicView.enter', function (e) {
            var vm = $scope.vm = {
                moredata: true,
                transferList: [],
                pagination: {
                    perPage: 15,
                    currentPage: 1
                },
                afterInit: false,
                init: function () {
                    ddUserTransfersServices.getUserTransfers({
                        userId: ddybUserId,
                        type: $stateParams.transferType,
                        size: vm.pagination.perPage,
                        page: vm.pagination.currentPage
                    }, function (result) {
                        vm.transferList = result.transfers;
                        vm.afterInit = true;
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
                    console.log('Refreshing!');
                    $timeout(function () {
                        //simulate async response
                        ddUserTransfersServices.getUserTransfers({
                            userId: ddybUserId,
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
                        //Stop the ion-refresher from spinning
                        $scope.$broadcast('scroll.refreshComplete');
                    }, 1000);
                },
                loadMore: function () {
                    vm.pagination.currentPage += 1;
                    if (vm.moredata && vm.afterInit ) {
                        ddUserTransfersServices.getUserTransfers({
                            userId: ddybUserId,
                            type: $stateParams.transferType,
                            size: vm.pagination.perPage,
                            page: vm.pagination.currentPage
                        }, function (result) {

                            vm.transferList = vm.transferList.concat(result.transferList);
                            if (result.transferList && result.transferList.length == 0) {
                                vm.moredata = false;
                            }
                            if (result.pages <= vm.pagination.currentPage + 1) vm.moredata = false;
                            $scope.$broadcast('scroll.infiniteScrollComplete');

                        })
                    }
                }
            };
            vm.init();
        });


        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
                console.log(str);
            });
        };

        //弹出确认对话框
        $scope.showConfirme = function (str) {
            //弹出确认对话框
            showQueue("　1）什么是叮咚？<br/>        &nbsp;&nbsp;&nbsp;&nbsp;叮咚是叮咚医邦在线给予广大用户的虚拟货币的奖励，可以用于支付，直抵现金。                <br/>  &nbsp;&nbsp;&nbsp; 2）叮咚折抵现金比例是多少？<br/>        &nbsp;&nbsp;&nbsp;&nbsp; 叮咚折抵现金比例是100:1，100叮咚相当于1元人民币。");
        };

        $scope.showTransfer = function (str) {

            ddUserTransfersServices.getUserTransfers({
                userId: ddybUserId,
                type: str,
                size: vm.pagination.perPage,
                page: vm.pagination.currentPage
            }, function (result) {
                vm.transferList = result.transferList;
                vm.transferType0 = "button";
                vm.transferType1 = "button";
                if (str == "0") {
                    vm.transferType = "余额账单";
                    vm.transferType0 = "button activated";
                } else {
                    vm.transferType = "积分账单";
                    vm.transferType1 = "button activated";
                }

                angular.forEach(vm.transferList, function (data, index, array) {
                    //data等价于array[index]
                    ddUserServices.get({userId: array[index].fromUserId}, function (result) {
                        $scope.user = (result.users)[0];

                        if (array[index].fromUserId == "0") {
                            vm.transferList[index].headImgUrl = "http://www.yushansoft.com/dingdong/images/sys/money_bag.png";
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
        }


    }])

    .controller('SmsValidCtrl',['$scope', '$filter', '$cookies','$ionicPopover', '$location', '$ionicPopup', '$stateParams','doctorUtils', 'ddUserServices', 'ddSmsValiServices', 'ddUpdateSmsValiServices', function ($scope, $filter, $cookies,$ionicPopover, $location, $ionicPopup, $stateParams,doctorUtils, ddUserServices, ddSmsValiServices, ddUpdateSmsValiServices) {

        $scope.ctrlScope = $scope;
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');

        ddUserServices.get({userId: ddybUserId}, function (result) {
            $scope.user = result.users[0];
            $scope.ctrlScope.phoneOld = result.users[0].phone;
        });
        var countdown = 60;

        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
                console.log(str);
            });
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
            var imgCode = 1;
            if (mobileNo != null) {
                ddUpdateSmsValiServices.updateSmsValid({
                    userId: ddybUserId,
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
                                ddUserServices.get({userId: ddybUserId}, function (result) {
                                    $scope.user = result.users[0];
                                    $scope.ctrlScope.phoneOld = result.users[0].phone;
                                });

                                console.log('完成');
                                var urlPath = '/tab/smsValid';
                                $location.url(urlPath);

                            } else {
                                console.log('取消');
                            }
                        });
                    } else {
                        alert(result.retMap.msg);
                    }
                })
            }else{
                showQueue("请输入要验证的手机号码！");
            }

        }

    }])


    .controller('SmsNowCtrl',['$scope', '$filter', '$cookies','$ionicPopover', '$location', '$ionicPopup', '$stateParams','doctorUtils', 'ddUserServices', 'ddSmsValiServices', 'ddUpdateSmsValiServices', function ($scope, $filter, $cookies,$ionicPopover, $location, $ionicPopup, $stateParams,doctorUtils, ddUserServices, ddSmsValiServices, ddUpdateSmsValiServices) {

        $scope.ctrlScope = $scope;
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');

        ddUserServices.get({userId: ddybUserId}, function (result) {
            $scope.user = result.users[0];
            $scope.ctrlScope.phoneOld = result.users[0].phone;
        });

        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
                console.log(str);
            });
        };

        $scope.changePhone = function (str) {

            var urlPath = 'tab/smsValid';
            $location.url(urlPath);

        }


    }])

    .controller('SmsValidHomePageCtrl',['$scope','$cookies', '$filter', '$ionicPopover', '$location', '$ionicPopup', '$stateParams','doctorUtils', 'ddUserServices', 'ddSmsValiServices', 'ddUpdateSmsValiServices','doctorInforList', function ($scope,$cookies, $filter, $ionicPopover, $location, $ionicPopup, $stateParams,doctorUtils, ddUserServices, ddSmsValiServices, ddUpdateSmsValiServices,doctorInforList) {

        $scope.ctrlScope = $scope;
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');

        ddUserServices.get({userId: ddybUserId}, function (result) {
            $scope.user = result.users[0];
            $scope.ctrlScope.phoneOld = result.users[0].phone;
        });
        var countdown = 60;

        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
                console.log(str);
            });
        };

        $scope.ctrlScope.countdown = "获取验证码";
        $scope.showConfirmeGetValid = function (obj) {

            var mobileNo = $scope.ctrlScope.mobileNo;
            if (mobileNo != null) {
                var imgCode = 1;
                ddSmsValiServices.validNum({mobileNo: mobileNo}, function (result) {
                    if(result.retMap.ok == "0"){
                        showQueue(result.retMap.msg);
                    }else{
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
                    }
                });
            } else {
                showQueue("请输入要验证的手机号码！");
            }
        };

        $scope.showConfirmePutValid = function (str) {

            var mobileNo = $scope.ctrlScope.mobileNo;
            var msgCode = $scope.ctrlScope.msgCode;
            var imgCode = 1;
            if (mobileNo != null) {
                ddUpdateSmsValiServices.updateSmsValid({
                    userId: ddybUserId,
                    mobileNo: mobileNo,
                    msgCode: msgCode,
                    imgCode: imgCode,
                    mode:1
                }, function (result) {
                    if (result.retMap.ok == '1' && result.retMap.doctorId) {
                        var doctorId = result.retMap.doctorId;
                        var d = new Date();
                        var exdays = 30;
                        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                        doctorUtils.setCookie("doctorId", doctorId, d, "/", null);
                        doctorInforList.doctorId = doctorId;
                        var urlPath = 'http://www.yushansoft.com/dingdong/v1/dddoctor/index.html#/tab/patientsAll';
                        $location.url(urlPath);
                        console.log('完成');

                    } else {
                        showQueue("您还未入驻，请与客服联系！");
                    }
                })
            }else{
                showQueue("请输入要验证的手机号码！");
            }
        }
    }])




    .controller('DoctorCodeCtrl',['$scope', '$ionicPopup', '$cookies','$ionicPopover','$ionicHistory','doctorUtils', 'ddDoctorInformationServices', 'ddUpdateDoctorInformationServices', function ($scope, $ionicPopup, $cookies,$ionicPopover,$ionicHistory,doctorUtils, ddDoctorInformationServices, ddUpdateDoctorInformationServices) {
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        $scope.ctrlScope = $scope;
        ddDoctorInformationServices.get({id: doctorId}, function (result) {
            $scope.doctor = result.doctors[0];
            $scope.ctrlScope.name = result.doctors[0].name;
            $scope.ctrlScope.hospitalName = result.doctors[0].hospitalName;
            $scope.ctrlScope.level = result.doctors[0].level;
        });
        $scope.goBack = function () {
            $ionicHistory.goBack(-1);
        };
    }])

    .controller('AccountAllCtrl',['$scope', '$ionicPopup', '$ionicPopover','$timeout', '$q',  'doctorUtils','ddUserServices','ddDoctorInformationServices', 'ddUpdateDoctorInformationServices', 'getUnSignedDoctorsServices', 'submitSignDoctorsterServices', function ($scope, $ionicPopup, $ionicPopover, $timeout, $q, doctorUtils, ddUserServices,ddDoctorInformationServices,ddUpdateDoctorInformationServices, getUnSignedDoctorsServices, submitSignDoctorsterServices) {
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        $scope.ctrlScope = $scope;
        var doctor = {
            name: ''
        };
        $scope.doctor = doctor;
        var confirmPopup;//确认医生信息对话框
        var myPopup;//输入医生姓名对话框

        getDoctorInfor = function () {
            if ($scope.doctor.name) {
                var deferred = $q.defer();
                getUnSignedDoctorsServices.get({doctorName: $scope.doctor.name}, function (result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            }
        };

        $scope.$on('$ionicView.enter', function (e) {
            if (doctorId) {
                ddDoctorInformationServices.get({id: doctorId}, function (result) {
                    $scope.doctor = result.doctors[0];
                    $scope.ctrlScope.name = result.doctors[0].name;
                    $scope.ctrlScope.gender = result.doctors[0].gender;
                    $scope.ctrlScope.level = result.doctors[0].level;

                    ddUserServices.get({userId: ddybUserId}, function (result) {
                        $scope.user = result.users[0];
                        $scope.ctrlScope.phoneOld = result.users[0].phone;


                        if(result.users[0].phone){
                            $scope.ctrlScope.verificationResult = "已通过核验";
                            $scope.ctrlScope.smsUrl =  '#/tab/smsNow';
                        }else{
                            $scope.ctrlScope.verificationResult = "未核验";
                            $scope.ctrlScope.smsUrl =  '#/tab/smsValid';
                        }
                    });

//                    $scope.inforUrl = '#/tab/doctorInformation';
                    $scope.inforUrl = '#/tab/personalInformation';

                });
            } else {
//                showPopup();
            }
        });
    }])

    .controller('ScoreCtrl',['$scope', '$ionicPopup','$cookies', '$ionicPopover','doctorUtils', 'ddUserServices', function ($scope, $ionicPopup,$cookies, $ionicPopover,doctorUtils, ddUserServices) {
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        $scope.ctrlScope = $scope;

        $scope.$on('$ionicView.enter', function (e) {
            ddUserServices.get({userId: doctorId}, function (result) {
                $scope.user = result.users[0];
                $scope.ctrlScope.score = result.users[0].score;
            });
        });
    }])


    .controller('WxpayCtrl',['$scope', '$ionicPopup','$cookies', '$timeout', '$stateParams', '$ionicHistory', '$ionicPopover','doctorUtils', 'ddUserTransfersServices', '$window', 'ddUserServices', function ($scope, $ionicPopup,$cookies, $timeout, $stateParams, $ionicHistory, $ionicPopover,doctorUtils, ddUserTransfersServices, $window, ddUserServices) {
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        $scope.ctrlScope = $scope;
        $scope.expanderTitle = '财富明细';
        $scope.$on('$ionicView.enter', function (e) {
            $scope.goBack = function () {
                $ionicHistory.goBack(-1);
            };
            ddUserServices.get({userId: ddybUserId}, function (result) {
                $scope.user = result.users[0];
                $scope.ctrlScope.balance = result.users[0].balance;
                $scope.ctrlScope.score = result.users[0].score;
            });

            var vm = $scope.vm = {
                moredata: true,
                transferList: [],
                pagination: {
                    perPage: 15,
                    currentPage: 1
                },
                afterInit: false,
                init: function () {
                    ddUserTransfersServices.getUserTransfers({
                        userId: ddybUserId,
                        type: 0,
                        size: vm.pagination.perPage,
                        page: vm.pagination.currentPage
                    }, function (result) {
                        vm.transferList = result.transfers;
                        vm.afterInit = true;
                        if (result.pages <= vm.pagination.currentPage + 1) vm.moredata = false;
                        angular.forEach(vm.transferList, function (data, index, array) {
                            //data等价于array[index]
                            ddUserServices.get({userId: array[index].fromUserId}, function (result) {
                                $scope.user = (result.users)[0];

                                if (array[index].fromUserId == "0") {
                                    vm.transferList[index].headImgUrl = "http://www.yushansoft.com/dingdong/images/sys/money_bag.png";
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
                    console.log('Refreshing!');
                    $timeout(function () {
                        //simulate async response
                        ddUserTransfersServices.getUserTransfers({
                            userId: ddybUserId,
                            type: 0,
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
                        //Stop the ion-refresher from spinning
                        $scope.$broadcast('scroll.refreshComplete');
                    }, 1000);
                },
                loadMore: function () {
                    vm.pagination.currentPage += 1;
                    if (vm.moredata && vm.afterInit) {
                        ddUserTransfersServices.getUserTransfers({
                            userId: ddybUserId,
                            type: $stateParams.transferType,
                            size: vm.pagination.perPage,
                            page: vm.pagination.currentPage
                        }, function (result) {

                            vm.transferList = vm.transferList.concat(result.transferList);
                            if (result.transferList && result.transferList.length == 0) {
                                vm.moredata = false;
                            }
                            if (result.pages <= vm.pagination.currentPage + 1) vm.moredata = false;
                            $scope.$broadcast('scroll.infiniteScrollComplete');

                        })
                    }
                }
            };
            vm.init();


        });

        $scope.doRefresh = function () {
            console.log('Refreshing!');
            $timeout(function () {
                //simulate async response
                ddUserServices.get({userId: doctorId}, function (result) {
                    $scope.user = result.users[0];
                    $scope.ctrlScope.balance = result.users[0].balance;
                });
                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
        };

        //弹出确认对话框
        $scope.showConfirmeCharge = function (str) {
            //弹出确认对话框
            var urlPath = 'http://www.yushansoft.com/dingdong/sys/wxpay/tab-wxpay.html';
            $window.open(urlPath);
        };
    }])

    .controller('AccountCtrl',['$scope', function ($scope) {
        $scope.settings = {
            enableFriends: true
        };
    }])


    .controller('AccountListCtrl',['$scope', '$ionicPopup','$cookies', '$timeout','$rootScope','$stateParams', '$ionicPopover', '$location','$ionicHistory','doctorUtils','ddDeleteDoctorAccountServices', 'ddDoctorAccountsServices','doctorInforList', function ($scope, $ionicPopup,$cookies, $timeout,$rootScope,$stateParams, $ionicPopover, $location,$ionicHistory,doctorUtils,ddDeleteDoctorAccountServices, ddDoctorAccountsServices,doctorInforList) {
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        $scope.ctrlScope = $scope;

        $scope.$on('$ionicView.enter', function (e) {
            ddDoctorAccountsServices.getDoctorAccounts({
                userId: ddybUserId
            }, function (result) {
                $scope.ctrlScope.accounts = result.accounts;
            });
            $scope.goBack = function () {
                $ionicHistory.goBack(-1);
            };
            $scope.ctrlScope.getAccount = function (account) {
                if($stateParams.operationType && $stateParams.operationType=="getCard"){
                    doctorInforList.card = account;
                    $ionicHistory.goBack(-1);
                }
            };

        });

        $scope.doRefresh = function () {
            console.log('Refreshing!');
            $timeout(function () {
                //simulate async response
                ddDoctorAccountsServices.getDoctorAccounts({
                    userId: ddybUserId
                }, function (result) {
                    $scope.ctrlScope.accounts = result.accounts;
                });
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
        };

        $scope.showConfirmeAdd = function (str) {
            var urlPath = 'tab/addAccount';
            $location.url(urlPath);
        };


        $scope.remove = function (account) {
            ddDeleteDoctorAccountServices.deleteDoctorAccount({id: account.id}, function (result) {
                ddDoctorAccountsServices.getDoctorAccounts({
                    userId: ddybUserId
                }, function (result) {
                    $scope.ctrlScope.accounts = result.accounts;
                });
            });
            console.log('完成');
        };
    }])

    .controller('doctorRecommendCtrl',['$scope', '$ionicPopup','$cookies', '$timeout','$rootScope','$stateParams', '$ionicPopover', '$location','$ionicHistory','doctorUtils','inviteDoctorQrServices',  function ($scope, $ionicPopup,$cookies, $timeout,$rootScope,$stateParams, $ionicPopover, $location,$ionicHistory,doctorUtils,inviteDoctorQrServices) {
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        $scope.ctrlScope = $scope;

        $scope.$on('$ionicView.enter', function (e) {
            $scope.ctrlScope.inviteDoctorQr = "http://www.yushansoft.com/dingdong/ddyb/inviteDoctorQr/"+doctorId;
        })


    }])




    .controller('assistantDoctorCtrl',['$scope','$cookies','$timeout', '$filter', '$ionicPopover', '$location', '$ionicPopup', '$stateParams','doctorUtils', 'ddUserServices', 'ddDoctorInformationServices',  function ($scope,$cookies,$timeout, $filter, $ionicPopover, $location, $ionicPopup, $stateParams,doctorUtils, ddUserServices, ddDoctorInformationServices) {

        var ddyzUserId =  doctorUtils.getCookies('ddyzUserId');


        $scope.$on('$ionicView.enter', function (e) {
            doctorUtils.setCookie("ddybUserId", "", null, "/", null);
            doctorUtils.setCookie("doctorId", "", null, "/", null);

            ddUserServices.get({userId: ddyzUserId}, function (result) {
                $scope.user = result.users[0];
//                var assistantDoctorId = result.users[0].address;
                var assistantDoctorId = result.users[0].assistantDoctors;
                if( assistantDoctorId){
                    var assistantDoctorList = assistantDoctorId.split(",");
                    var assistantDoctor = [];
                    for (var kk=0;kk<assistantDoctorList.length ;kk++ )
                    {
                        ddDoctorInformationServices.get({ id: assistantDoctorList[kk]}, function (result) {
                            assistantDoctor.push(result.doctors[0]);
                        })
                    }
                }
                $scope.assistantDoctorList = assistantDoctor;
            });

        });
        $scope.doRefresh = function () {
            console.log('Refreshing!');
            $timeout(function () {
                ddUserServices.get({userId: ddyzUserId}, function (result) {
                    $scope.user = result.users[0];
//                    var assistantDoctorId = result.users[0].address;
                    var assistantDoctorId = result.users[0].assistantDoctors;

                    if( assistantDoctorId){
                        var assistantDoctorList = assistantDoctorId.split(",");
                        var assistantDoctor = [];
                        for (var kk=0;kk<assistantDoctorList.length ;kk++ )
                        {
                            ddDoctorInformationServices.get({ id: assistantDoctorList[kk]}, function (result) {
                                assistantDoctor.push(result.doctors[0]);
                            })
                        }
                    }
                    $scope.assistantDoctorList = assistantDoctor;
                });
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
        };


        $scope.showDoctorFunction = function (doctor) {
            doctorUtils.setCookie("ddybUserId", doctor.userId, d, "/", null);
            doctorUtils.setCookie("doctorId", doctor.id, d, "/", null);


            var urlPath = '/doctorFunction';
            $location.url(urlPath);
        };


    }])
    .controller( 'doctorHeadCtrl',['$scope','$ionicActionSheet','$timeout','$cookies', '$q','doctorUtils','ddDoctorInformationServices','ddJsConfig', 'ddAddYusFilesServices','showPopupServices','ddUpdateDoctorHeadServices', function($scope,$ionicActionSheet,$timeout,$cookies,$q,doctorUtils,ddDoctorInformationServices,ddJsConfig, ddAddYusFilesServices,showPopupServices,ddUpdateDoctorHeadServices){
        $scope.ctrlScope = $scope;
        var ddybUserId =  doctorUtils.getCookies('ddybUserId');
        var doctorId =  doctorUtils.getCookies('doctorId');
        var yusFiles=[] ;
        $scope.yusFiles = yusFiles;
        var wxConfigCheck = false;

        wx.ready(function (res) {
            wxConfigCheck = true;
        });

        if (!wxConfigCheck) {
            doctorUtils.wxInit();
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
                            "userId": ddybUserId,
                            "wxServerId": serverId
                        }, function (result) {
                            if ("OK" == result.responseDesc) {
                                yusFiles =result.yusFiles[0].id;
                                var fileUrl = result.yusFiles[0].fileUrl;
                                var request =
                                {
                                    "doctors": [
                                    {
                                        "id": doctorId,
                                        "headImgUrl": fileUrl
                                    }
                                ],
                                    "requestDesc": "string",
                                    "requestStatus": 0
                                }

                                if(fileUrl){
                                    ddUpdateDoctorHeadServices.updateDoctorHead({id: doctorId}, request);
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
            yusFiles=[];
            if (yusFiles.length <= 1) {
                wx.ready(function () {
                    wx.chooseImage({
                        count: 1 - yusFiles.length,
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
        $scope.$on('$ionicView.enter', function (e) {

            if (doctorId) {
                ddDoctorInformationServices.get({id: doctorId}, function (result) {
                    $scope.doctor = result.doctors[0];

                });
            } else {
            }
        })

    }])
    .controller('AddAccountCtrl',['$scope', '$filter', '$location','$cookies', '$ionicPopover', '$ionicPopup', '$stateParams', 'ddAddDoctorAccountsServices', function ($scope, $filter, $location,$cookies, $ionicPopover, $ionicPopup, $stateParams, ddAddDoctorAccountsServices) {
        $scope.ctrlScope = $scope;
        showQueue = function (str) {
            var alertPopup = $ionicPopup.alert({

                template: '<h3>' + str + '</h3>',
                buttons: [
                    {text: '确定'}]
            });
            alertPopup.then(function (res) {
                console.log(str);
            });
        };
        //弹出确认对话框
        $scope.showConfirmeAdd = function (str) {

            if ($scope.ctrlScope.bankName == null || $scope.ctrlScope.cardNumber == null || $scope.ctrlScope.cardName == null) {
                showQueue("请补充完必填项信息！");
            } else {
                var message = '<h4 style=" text-align:center;">' + $scope.ctrlScope.bankName + '<br/>' + $scope.ctrlScope.cardNumber  + '<br/>' +$scope.ctrlScope.cardName +'</h4>';
                var confirmPopup = $ionicPopup.confirm({
                    title: '<h4 >您确定添加如下账户吗？</h4>',
                    template: message,
                    cancelText: '取消',
                    okText: '确定'
                });
                confirmPopup.then(function (res) {
                    if (res) {

                        var accounts = null;
                        var ddybUserId = $scope.ddybUserId = $cookies.get('ddybUserId');
                        var doctorId = $scope.doctorId = $cookies.get('doctorId');

                        var request =  {
                            "accounts": [
                                {
                                    "bankAddress": $scope.ctrlScope.bankAddress,
                                    "bankBranchName": $scope.ctrlScope.bankBranchName,
                                    "bankName": $scope.ctrlScope.bankName,
                                    "cardName": $scope.ctrlScope.cardName,
                                    "cardNumber": $scope.ctrlScope.cardNumber,
                                    "userId": ddybUserId
                                }
                            ],
                            "requestDesc": "string",
                            "requestStatus": 0
                        };

                        ddAddDoctorAccountsServices.addDoctorAccounts({}, request);
                        console.log(request);
                        var urlPath = 'tab/accountList';
                        $location.url(urlPath);

                    } else {
                        console.log('取消');
                    }
                });
            }
        }
    }]);