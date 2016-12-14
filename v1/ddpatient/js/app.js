var ddpatientApp = angular.module('ddpatientApp', ['ionic', 'ddpatientFilters', 'ddpatientControllers', 'ddChatController', 'ddpatientServices', 'ddpatientDirectives']);
ddpatientApp
    .run(['$ionicPlatform', function ($ionicPlatform) {
        $ionicPlatform.ready(function () {

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

    }])
    .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.templates.maxPrefetch(0);

        $stateProvider
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                controller: 'TabsCtrl'
            })

            .state('tab.main', {
                url: '/main',
                views: {
                    'tab-main': {
                        templateUrl: 'templates/tab-main.html',
                        controller: 'MainCtrl'
                    }
                }
            })

            .state('tab.hosipitals', {
                url: '/hospitalsAll',
                views: {
                    'tab-hosipitals': {
                        templateUrl: 'templates/hospital/hospitals.html',
                        controller: 'HospitalsAllCtrl'
                    }
                }
            })

            .state('tab.doctorsFan', {
                url: '/doctorsFan',
                views: {
                    'tab-doctorsFan': {
                        templateUrl: 'templates/tab-doctorsFan.html',
                        controller: 'DoctorsFanCtrl'
                    }
                }
            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'accountCtrl'
                    }
                }
            });


        $stateProvider.state('newpatitent', {
            url: '/newpatient/:scheduleId/:doctorId/:type',
            templateUrl: 'templates/newpatient.html',
            controller: 'newPatientCtrl'
        });


        $stateProvider.state('doctorList', {
                url: '/doctorList',
                templateUrl: 'templates/doctorList.html',
                controller: 'DoctorsCtrl'
            })
            .state('doctorDeptList', {
                url: '/doctorDeptList/:deptId',
                templateUrl: 'templates/doctor/doctorDeptList.html',
                controller: 'DoctorDeptListCtrl'
            })
            .state('deptListAll', {
                url: '/deptListAll',
                templateUrl: 'templates/doctor/deptListShow.html',
                controller: 'deptListAllCtrl'
            })


            //叮咚名医列表仅仅展示
            .state('doctorListShow', {
                url: '/doctorListShow',
                templateUrl: 'templates/doctor/doctorDeptList.html',
                controller: 'DoctorDeptListCtrl'
            })


            //叮咚名医列表
            .state('hospitalDoctorList', {
                url: '/hospitalDoctorList/:hospitalId',
                templateUrl: 'templates/hospital/hospitalDoctorList.html',
                controller: 'hospitalDoctorsCtrl'
            })

            //根据姓名或特长查出的叮咚名医列表
            .state('doctorSearchList', {
                url: '/doctorSearchList/:filterText',
                templateUrl: 'templates/doctor/doctorSearchList.html',
                controller: 'DoctorsSearchListCtrl'
            })


            //医生预约详情
            .state('doctor-detail', {
                url: '/doctors/:doctorId/hospital/:hospitalId',
                templateUrl: 'templates/doctor-detail.html',
                controller: 'DoctorDetailCtrl'
            })

            //医生预约详情,用于就诊历史处的显示
            .state('tab.doctor-detail-history', {
                url: '/doctor-detail-history/:doctorId',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/doctor-detail.html',
                        controller: 'DoctorDetailCtrl'
                    }
                }
            })

            //医生详细信息
            .state('doctor-infor', {
                url: '/doctors/:doctorId/doctorInfor',
                templateUrl: 'templates/doctor-infor.html',
                controller: 'DoctorInforCtrl'
            })


            .state('user-patient-account', {
                url: '/userPatientAccount/:type',
                templateUrl: 'templates/patient/user-patient-account.html',
                controller: 'UserPatientCtrl'
            })

            .state('user-patient-add-main', {
                url: '/userPatientAddMain',
                templateUrl: 'templates/patient/user-patient-add.html',
                controller: 'UserPatientAddCtrl'
            })

            .state('user-patient-add-account', {
                url: '/userPatientAddAccount/:type',
                templateUrl: 'templates/patient/user-patient-add.html',
                controller: 'UserPatientAddCtrl'
            })

            //医生详细信息,仅仅展示
            .state('doctor-infor-show', {
                url: '/doctors/:doctorId/doctorInforShow',
                templateUrl: 'templates/doctor/doctor-infor-show.html',
                controller: 'DoctorInforCtrl'

            })
            //医生详细信息,仅用于分享
            .state('doctor-infor-share', {
                url: '/doctors/:doctorId/doctorInforShare',
                templateUrl: 'templates/doctor/doctor-infor-share.html',
                controller: 'DoctorInforShareCtrl'

            })
            //医院情况
            .state('tab.hospital-infor', {
                url: '/hospitals/:doctorId',
                views: {
                    'tab-main': {
                        templateUrl: 'templates/hospitallist.html',
                        controller: 'hospitalCtrl'
                    }
                }
            })

            //医院情况
            .state('hospital-introduction', {
                url: '/hospitals/:hospitalId/hospitalIntro',
                cache: true,
                templateUrl: 'templates/hospital/hospitals_infor_show.html',
                controller: 'hospitalIntroCtrl'
            })

            //医生开放排队的医院
            .state('doctorHospitals', {
                url: '/doctorHospitals/:doctorId',
                templateUrl: 'templates/doctor/doctorHospitalList.html',
                controller: 'doctorHospitalsCtrl'
            })


            //医生预约详情,用于关注医生处显示
            .state('tab.doctor-detail-funs', {
                url: '/doctor-detail-funs/:doctorId',
                views: {
                    'tab-doctorsFan': {
                        templateUrl: 'templates/doctorFun/doctor-detail-funs.html',
                        controller: 'DoctorDetailCtrl'
                    }
                }
            })
            //医院情况,用于关注医生处显示
            .state('tab.hospital-doctorsFan', {
                url: '/hospitals-doctorsFan/:doctorId',
                views: {
                    'tab-doctorsFan': {
                        templateUrl: 'templates/hospitallist.html',
                        controller: 'hospitalCtrl'
                    }
                }
            })

            //医生详细信息,用于关注医生处显示
            .state('tab.doctor-infor-funs', {
                url: '/doctors-funs/:doctorId/doctorInfor',
                views: {
                    'tab-doctorsFan': {
                        templateUrl: 'templates/doctorFun/doctor-infor-funs.html',
                        controller: 'DoctorInforCtrl'
                    }
                }
            })

            //用户排队情况
            .state('tab.userQueue', {
                url: '/user/userQueue',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/userQueueList.html',
                        controller: 'userQueueCtrl'
                    }
                }
            })

            //用户预约情况
            .state('tab.userRegister', {
                url: '/user/userRegister',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/userRegisterList.html',
                        controller: 'userRegisterCtrl'
                    }
                }
            })

            //用户预约后显示
            .state('tab.userAfterRegister', {
                url: '/user/userAfterRegister',
                views: {
                    'tab-main': {
                        templateUrl: 'templates/userRegisterList.html',
                        controller: 'userRegisterCtrl'
                    }
                }
            })
            //用户就诊纪录
            .state('tab.userRegisterHistory', {
                url: '/user/userRegisterHistory',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/userRegisterHistoryList.html',
                        controller: 'userRegisterHistoryCtrl'
                    }
                }
            })


            //患者对医生的评价纪录
            .state('doctorEvaluationList', {
                url: '/user/doctorEvaluationList/:doctorId',
                templateUrl: 'templates/doctor/doctorEvaluationListShow.html',
                controller: 'doctorEvaluationListCtrl'
            })

            //我对医生的评价纪录
            .state('tab.myEvaluationList', {
                url: '/user/myEvaluationList/:userId/:registerId/:doctorId',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/evaluation/evaluation-list.html',
                        controller: 'myEvaluationListCtrl'
                    }
                }
            })


            //待评价纪录
            .state('tab.needEvaluationList', {
                url: '/user/needEvaluationList',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/evaluation/tab-evaluation-list.html',
                        controller: 'needEvaluationListCtrl'
                    }
                }
            })


            //追加对医生的评价
            .state('addEvaluation', {
                url: '/user/addEvaluation/:registerId',
                templateUrl: 'templates/evaluation/add-evaluation.html',
                controller: 'addEvaluationCtrl'
            })


            //用户预约挂号确认
            .state('tab.userRegisterConfirm', {
                url: '/user/register/userRegisterConfirm',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/register/userRegisterConfirmList.html',
                        controller: 'UserRegisterConfirmListCtrl'
                    }
                }
            })

            //用户积分
            .state('tab.score', {
                url: '/user/score',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/account/tab-score.html',
                        controller: 'ScoreCtrl'
                    }
                }
            })

            .state('scoreTerms', {
                url: '/scoreTerms',
                cache: true,
                templateUrl: 'templates/transfers/score-terms.html',
                controller: ''
            })
            .state('accountList', {
                url: '/accountList',
                templateUrl: 'templates/transfers/accounts-list.html',
                controller: 'AccountListCtrl'

            })

            .state('getAccount', {
                url: '/accountList/:operationType',
                templateUrl: 'templates/transfers/accounts-list.html',
                controller: 'AccountListCtrl'
            })
            .state('cashApply', {
                url: '/cashApply',
                templateUrl: 'templates/wxpay/cashApply.html',
                controller: ''
            })
            .state('addAccount', {
                url: '/addAccount',
                templateUrl: 'templates/transfers/add-account.html',
                controller: 'AddAccountCtrl'
            })

            //用户帮助
            .state('terms', {
                url: '/user/terms',
                cache: true,
                templateUrl: 'templates/terms.html',
                controller: 'TermsCtrl'
            })

            .state('userTransfer', {
                url: '/userTransfer/:transferType',
                templateUrl: 'templates/transfers/user-transfers.html',
                controller: 'UserTransferCtrl'
            })
            //短信验证
            .state('tab.smsValid', {
                url: '/user/smsValid',
                templateUrl: 'templates/smsValid.html',
                controller: 'SmsValidCtrl'
            })


            //微信充值
            .state('wxpay', {
                url: '/user/wxpay',
                templateUrl: 'templates/wxpay/tab-wxpay.html',
                controller: 'WxpayCtrl'
            })

            //用户账户充值
            .state('wxpayRecharge', {
                url: '/user/wxpay/recharge',
                templateUrl: 'templates/wxpay/userRecharge.html',
                controller: 'WxpayRechargeCtrl'
            })


            //用户信息
            .state('userInformation', {
                url: '/user/userInformation',
                templateUrl: 'templates/user-information.html',
                controller: 'UserInformationCtrl'
            })
            //获得患者信息-获得指定微信号获得患者信息
            .state('user-patient-main', {
                url: '/userPatientMain/:type',
                templateUrl: 'templates/patient/user-patient-main.html',
                controller: 'UserPatientCtrl'
            })

            //获得患者信息-获得指定微信号获得患者信息,用于确认挂号
            .state('tab.user-patient-main-confirm', {
                url: '/userPatientMainConfirm/:type',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/patient/user-patient-main.html',
                        controller: 'UserPatientCtrl'
                    }
                }
            })
            .state('tab.patients-history-detail', {
                url: '/patientHistory/:patientId/:registerId',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/patient/patient-history-detail.html',
                        controller: 'PatientDetailCtrl'
                    }
                }
            })

            .state('enchashment', {
                url: '/enchashment',
                templateUrl: 'templates/wxpay/enchashment.html',
                controller: 'EnchashmentCtrl'
            })
            //用户信息实时交流
            .state('userSetting', {
                url: '/user/setting',
                templateUrl: 'templates/userSetting.html',
                controller: 'UserSettingCtrl'
            })

            //用户信息实时交流
            .state('userChat', {
                url: '/userChat/:ddUserId/:doctorId',
                templateUrl: 'templates/chat/chat-user.html',
                controller: 'ChatMessagesCtrl'
            })
            //用户交流界面
            .state('userChatRoom', {
                url: '/tab/userChat',
                templateUrl: 'templates/chat/chatRoom.html',
                controller: 'ChatRoomCtrl'
            });


        $urlRouterProvider.otherwise('/tab/main');

        $ionicConfigProvider.backButton.text('').icon('ion-chevron-left');
        $ionicConfigProvider.tabs.style("standard");
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.views.transition('none');
        $ionicConfigProvider.scrolling.jsScrolling(false);

    }]);


