var dddoctorServices = angular.module('dddoctorServices', ['ngResource']);


var serverName='www.yushansoft.com';
//var serverName='127.0.0.1';

//医生信息，存储医生日程信息，用于控制器之间的通信服务
dddoctorServices.factory('doctorInforList',[function () {
    return {};
}]);

//通用工具服务，存储医生日程信息，用于控制器之间的通信服务
dddoctorServices.factory('doctorUtils', ['ddJsConfig',function (ddJsConfig) {
    var doctorUtils={
        getCookies:function(cookieName) {
            var strCookie = document.cookie;
            var arrCookie = strCookie.split("; ");
            for(var i = 0; i < arrCookie.length; i++){
                var arr = arrCookie[i].split("=");
                if(cookieName == arr[0]){
                    return arr[1];
                }
            }
            return "";
        },
        setCookie:function(name, value, expires, path, domain, secure) {
        document.cookie = name + "=" + escape(value) + ((expires) ? "; expires=" + expires.toGMTString() : "") + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
        },
        wxInit:function(){
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
        }
    }
    return doctorUtils;
}]);

//GET /wechat/jsConfig 获得jsapi的config信息
dddoctorServices.factory('ddJsConfig', ['$resource', '$http', '$q', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/ddmz/jsConfig', {}, {
        jsConfig: {method: 'GET', params: {url: '@url'}, isArray: false}
    });
}]);
//邀请患者
dddoctorServices.factory('ddQr', ['$resource', '$http', '$q', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/ddmz/qr/:id', {id: '@id'}, {
        getQr: {method: 'GET', params: {}, isArray: false}
    });
}]);

//邀请医生
dddoctorServices.factory('inviteDoctorQrServices', ['$resource', '$http', '$q', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/ddyb/inviteDoctorQr/:id', {id: '@id'}, {
        getInviteDoctorQr: {method: 'GET', params: {}, isArray: false}
    });
}]);

//添加文件
dddoctorServices.factory('ddAddYusFilesServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/yusFiles', {
        userId: '@userId',
        wxServerId: '@wxServerId'
    });
}]);
//GET /registers/{id} 查询某一指定编号的挂号信息
dddoctorServices.factory('ddRegistersServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://'+serverName+'/dingdong/registers/:id', {id: '@id'}, {
    });
}]);

//医生查询-查询某一天已成功挂号的病患信息
dddoctorServices.factory('ddPatientServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://'+serverName+'/dingdong/doctors/:id/registers/scheduleDate', {id: '@id'}, {
        queryMyPatient_Hos_Date: {method: 'GET', params: {scheduleDate: '@scheduleDate'}, isArray: false}
    });
}]);
//医生查询-查询已经预约和成功挂号的病患信息
//暂时与医院没有对接，只取unfinished
dddoctorServices.factory('ddPatientRegistersServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://'+serverName+'/dingdong/doctors/:id/registers/unfinished', {id: '@id'}, {
        queryDoctor_Registers: {method: 'GET', params: {}, isArray: false}
    });
}]);
//医生查询-查询某个状态下的预约信息，挂号状态 // 状态 ,0—草稿，1-已预约，2-已挂号，3-已诊疗，4-取消
dddoctorServices.factory('ddPatientHistoryServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://'+serverName+'/dingdong/doctors/:id/registers/status', {id: '@id'}, {
        queryHistory_Registers: {method: 'GET', params: {status: '@status'}, isArray: false}
    });
}]);
//获得患者信息-获得指定id患者信息
dddoctorServices.factory('ddPatientDetailServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://'+serverName+'/dingdong/patients/:patientId', {patientId: '@patientId'}, {
    });
}]);
//获得患者病情信息-获得指定id患者病情信息
dddoctorServices.factory('ddPatientCondServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://'+serverName+'/dingdong/patientConds/patientConds/:registerId', {registerId: '@registerId'}, {
        getByRegisterId: {method: 'GET', params: {}, isArray: false}
    });
}]);
//医生确认患者已就诊
dddoctorServices.factory('ddPatientFinishTreatmentServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://'+serverName+'/dingdong/registers/:registerId/finish', {registerId: '@registerId'}, {
        finishTreatment: {method: 'PATCH', params: {}, isArray: false}
    });
}]);

//按医生查询执业医院信息
dddoctorServices.factory('ddDoctorHospitalsServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://'+serverName+'/dingdong/docotors/:doctorId/doctorHospitals', {doctorId: '@doctorId'}, {
        getDoctorHospitals: {method: 'GET', params: {}, isArray: false}
    });
}]);

//按医生查询执业医院信息
dddoctorServices.factory('ddDoctorHospitalsByStatusServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://'+serverName+'/dingdong/docotors/:doctorId/doctorHospitals', {doctorId: '@doctorId'}, {
        getDoctorByStatusHospitals: {method: 'GET', params: {status:'@status'}, isArray: false}
    });
}]);

//按照医生执业编号
dddoctorServices.factory('ddDoctorHospitalDetailServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://'+serverName+'/dingdong/doctorHospitals/:id', {id: '@id'}, {
    });
}]);

//名医出诊-名医创建出诊日程
dddoctorServices.factory('ddAddScheduleServices', ['$resource',  function ($resource) {
    return $resource('http://'+serverName+'/dingdong/schedules', null,{
        addSchedule: {method: 'POST',params: {doctorId:'@doctorId',hospitalId: '@hospitalId',scheduleDate: '@scheduleDate',timeSlot: '@timeSlot',issueNum: '@issueNum',creatorId: '@creatorId'} }
    });
}]);

//添加执业医院信息-新增执业医院个人信息
dddoctorServices.factory('ddAddDoctorHospitalServices', ['$resource',  function ($resource) {
    return $resource('http://'+serverName+'/dingdong/doctorHospitals', null,{
        addDoctorHospital: {method: 'POST'}
    });
}]);

//更新执业医院信息，主要包括最低排队人数，挂号费等信息，按照执业编号
dddoctorServices.factory('ddUpdateDoctorHospitalServices', ['$resource', function($resource) {
    return $resource('http://'+serverName+'/dingdong/doctorHospitals/:id',  {id: '@id'}, {
        updateDoctorHospital: { method:'PATCH',params: {deptName:'@deptName',minQueue: '@minQueue',registerFee: '@registerFee',status: '@status'} }
    });
}]);

//0————表示创建,1--表示有效 ，2————表示 已取消
dddoctorServices.factory('ddUpdateDoctorHospitalStatusServices', ['$resource', function($resource) {
    return $resource('http://'+serverName+'/dingdong/doctorHospitals/:id/status', {id: '@id'}, {
        updateDoctorHospitalStatus: { method:'PATCH',params: {status: '@status'} }
    });
}]);

//按执业编号删除
dddoctorServices.factory('ddDeleteDoctorHospitalServices', ['$resource', function($resource) {
    return $resource('http://'+serverName+'/dingdong/doctorHospitals/:id', null, {
        deleteDoctorHospital: { method:'DElETE', params: {id:'@id'} }
    });
}]);

//按医生查询
dddoctorServices.factory('ddDoctorSchedulesServices', ['$resource', '$http', '$q', function ($resource, $http, $q) {
    return $resource('http://'+serverName+'/dingdong/doctors/:doctorId/schedules', {doctorId: '@doctorId'}, {
        getDoctorSchedules: {method: 'GET', params: {beginDate:'@beginDate',endDate:'@endDate'}, isArray: false}
    });
}]);


//按天查询。 状态值： 1:可预约, 2:预约满,3: 不出诊,4:不可预约
dddoctorServices.factory('ddDoctorScheduleDatesServices', ['$resource', '$http', '$q', function ($resource, $http, $q) {
    return $resource('http://'+serverName+'/dingdong/doctors/:doctorId/scheduleDates', {doctorId: '@doctorId'}, {
        getDoctorScheduleDates: {method: 'GET', params: {beginDate:'@beginDate',endDate:'@endDate'}, isArray: false}
    });
}]);

//获得短信验证码
dddoctorServices.factory('ddSmsValiServices', ['$resource', '$http', '$q', function ($resource, $http, $q) {
    return $resource('http://'+serverName+'/dingdong/sms/validNum', {}, {
        validNum: {method: 'GET', params: {mobileNo:'@mobileNo'}, isArray: false}
    });
}]);
//用户验证,通过验证后才写入电话号码
dddoctorServices.factory('ddUpdateSmsValiServices', ['$resource', function($resource) {
    return $resource('http://'+serverName+'/dingdong/sms/validation', null, {
        updateSmsValid: { method:'PUT',params: {userId:'@userId',mobileNo:'@mobileNo',msgCode:'@msgCode',imgCode:'@imgCode',mode:'@mode'} }
    });
}]);

//更新医生信息-更新医生个人信息
dddoctorServices.factory('ddUpdateDoctorHeadServices', ['$resource', function($resource) {
    return $resource('http://'+serverName+'/doctors/:id/bySelective', {id: '@id'}, {
        updateDoctorHead: { method:'PUT'}
    });
}]);

//按医生查询医生的粉丝信息
dddoctorServices.factory('ddDoctorFansServices', ['$resource', '$http', '$q', function ($resource, $http, $q) {
    return $resource('http://'+serverName+'/dingdong/docotors/:doctorId/doctorFans', {doctorId: '@doctorId'}, {
        getDoctorFans: {method: 'GET', params: {}, isArray: false}
    });
}]);

//获得医生信息-获得指定id医生信息
dddoctorServices.factory('ddDoctorInformationServices', ['$resource', '$http', '$q', function ($resource, $http, $q) {
    return $resource('http://'+serverName+'/dingdong/doctors/:id', {id: '@id'}, {

    });
}]);


//更新医生的基本信息
dddoctorServices.factory('ddUpdateDoctorInformationServices', ['$resource', function($resource) {
    return $resource('http://'+serverName+'/dingdong/doctors/:id', {id: '@id'}, {
        updateDoctorInformation: { method:'PUT',params: {name:'@name',gender:'@gender',hospitalName:'@hospitalName',level:'@level',specialty:'@specialty',introduction:'@introduction'} }
    });
}]);


// 获得名医的排队信息
dddoctorServices.factory('ddGetDoctorQueuesServices', ['$resource', function($resource) {
    return $resource('http://'+serverName+'/dingdong/doctors/:doctorId/statQueue', {doctorId: '@doctorId'}, {
        getDoctorQueues: {method: 'GET', params: {}, isArray: false}
    });
}]);

// 获得名医某个医院的排队信息
dddoctorServices.factory('ddDoctorQueuesListServices', ['$resource', function($resource) {
    return $resource('http://'+serverName+'/dingdong/doctors/:doctorId/queues', {doctorId: '@doctorId'}, {
        getDoctorQueuesList: {method: 'GET', params: {hospitalId:'@hospitalId'}, isArray: false}
    });
}]);

//医生查询-查询某个状态下的预约信息，挂号状态 -1--排队中 ，0—草稿，1-已预约，2-已挂号，3-已诊疗，4-取消，5-已评价
dddoctorServices.factory('ddRegistersByDoctorIdAndStatusServices', ['$resource', function($resource) {
    return $resource('http://'+serverName+'/dingdong/doctors/:doctorId/hospitals/:hospitalId/registers/status', {doctorId: '@doctorId'}, {
        getRegistersByDoctorIdAndStatus: {method: 'GET', params: {hospitalId:'@hospitalId',status: '@status'}, isArray: false}
    });
}]);


// 获得患者信息-获得指定id患者信息
dddoctorServices.factory('ddUserServices', ['$resource', function($resource) {
    return $resource('http://'+serverName+'/dingdong/users/:userId', {userId: '@userId'}, {
    });
}]);

//病患查询-查询某个状态下的预约信息，
dddoctorServices.factory('getRegisterByStatusServices', ['$resource', function ($resource) {
    return $resource('http://'+serverName+'/dingdong/users/:userId/registers/status', {userId: '@userId'}, {
        getRegisterByStatus: {method: 'GET', params: {status:'@status'}, isArray: false}
    });
}]);

//按医生查询医生的粉丝信息
dddoctorServices.factory('ddGetDoctorFunsServices', ['$resource', function($resource) {
    return $resource('http://'+serverName+'/dingdong/docotors/:doctorId/doctorFans', {}, {
        getDoctorFuns: { method:'GET',params: {doctorId:'@doctorId',size:'@size',page:'@page',order:'@order',orderBy:'@orderBy'} }
    });
}]);


//根据id延迟出诊日程
dddoctorServices.factory('ddPostponeScheduleByIdServices', ['$resource', function($resource) {
    return $resource('http://'+serverName+'/dingdong/schedules/:id/postponeScheduleById', {id: '@id'}, {
        postponeScheduleById: { method:'PATCH',params: {} }
    });
}]);

//将出诊日程延迟到固定日期
dddoctorServices.factory('ddPostponeScheduleServices', ['$resource', function($resource) {
    return $resource('http://'+serverName+'/dingdong/schedules/:id/postponeSchedule', {id:'@id'}, {
        postponeSchedule: { method:'PATCH',params: {scheduleDate:'@scheduleDate'} }
    });
}]);

//或取转账信息，type=0 表示余额， =1表示 积分.
dddoctorServices.factory('ddUserTransfersServices', ['$resource', function ($resource) {
    return $resource('http://'+serverName+'/dingdong/users/:userId/Transfers', {userId: '@userId'}, {
        getUserTransfers: {method: 'GET', params: {type:'@type',size:'@size',page:'@page'}, isArray: false}
    });
}]);


//获得医院信息-获得所有医院信息
dddoctorServices.factory('ddHospitalsServices', ['$resource', function($resource) {
    return $resource('http://'+serverName+'/dingdong/hospitals', {}, {
        getHospitals: { method:'GET',params: {size:'@size',page:'@page',order:'@order',orderBy:'@orderBy'} }
    });
}]);

//查询，获得医院信息-获得所有医院信息
dddoctorServices.factory('ddHospitalsByFilterTextServices', ['$resource', function($resource) {
    return $resource('http://'+serverName+'/dingdong/hospitals', {}, {
        getHospitalsByFilterText: { method:'GET',params: {filterText:'@filterText',size:'@size',page:'@page',order:'@order',orderBy:'@orderBy'} }
    });
}]);


//获得医院科室信息-获得指定id医院科室信息
dddoctorServices.factory('ddHospitalDeptsServices', ['$resource', function($resource) {
    return $resource('http://'+serverName+'/dingdong/hospitals/:id/hospitalDepts', {id:'@id'}, {
        getHospitalDepts: { method:'GET',params: {size:'@size',page:'@page'} }
    });
}]);


//获得某次诊疗的评价列表
dddoctorServices.factory('getDoctorEvalsByRegisterServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://'+serverName+'/dingdong/registers/:registerId/doctorEvals', {registerId: '@registerId'}, {
        getDoctorEvalsByRegisterId: {method: 'GET', params: {}, isArray: false}
    });
}]);

//获得未注册的医生
dddoctorServices.factory('getUnSignedDoctorsServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/doctors/unsigned', {}, {
            getUnSignedDoctors: {method: 'GET', params: {doctorName: '@doctorName'}, isArray: false}
        }
    );
}]);

//签约医生
dddoctorServices.factory('submitSignDoctorsterServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/doctors/:id/submitSignDoctor', {id: '@id'}, {
            submitSign: {method: 'PATCH', params: { userId: '@userId',officeTele:'@officeTele'}, isArray: false}
        }
    );
}]);

//取得医生信息
dddoctorServices.factory('doctorServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://'+serverName+'/dingdong/doctors/:id', null, {
        queryAll: {method: 'get', params: {size: '@size', page: '@number', orderBy: '@orderBy',order:'@order'}, isArray: false}
    });
}]);

//获得医生信息-获得所有医生信息---查询filterText，姓名和特长查询
dddoctorServices.factory('ddGetDoctorsByNameOrSpecialty', ['$resource', '$http',function ($resource) {
    return $resource('http://'+serverName+'/dingdong/doctors',{}, {
        getDoctorsByNameOrSpecialty: {method: 'GET', params: {filterText:'@filterText',size:'@size',page:'@page',order:'@order',orderBy:'@orderBy'}, isArray: false}
    });
}]);

//添加提现账户
dddoctorServices.factory('ddAddDoctorAccountsServices', ['$resource',  function ($resource) {
    return $resource('http://'+serverName+'/dingdong/accounts', null,{
        addDoctorAccounts: {method: 'POST'}
    });
}]);
//获得用户账户
dddoctorServices.factory('ddDoctorAccountsServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://'+serverName+'/dingdong/accounts/:userId/userId', {userId: '@userId'}, {
        getDoctorAccounts: {method: 'GET', params: {}, isArray: false}
    });
}]);

//删除账户信息
dddoctorServices.factory('ddDeleteDoctorAccountServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://'+serverName+'/dingdong/accounts/:id', null, {
        deleteDoctorAccount: {method: 'DElETE', params: {id:'@id'}}
    });
}]);

//提交提现申请
dddoctorServices.factory('ddDoctorCashApplyServices', ['$resource',  function ($resource) {
    return $resource('http://'+serverName+'/dingdong/transfers/getCashApply', {},{
        postCashApply: {method: 'POST',params: {accountId: '@accountId',amount: '@amount'}}
    });
}]);

dddoctorServices.factory('showPopupServices', ['$ionicPopup', function ($ionicPopup) {
    var showPopupServices = {
        showPopup: function () {
            var myPopup = $ionicPopup.show({
                template: '<input type="password" ng-model="data.wifi">',
                title: 'Enter Wi-Fi Password',
                subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [
                    {text: '取消'},
                    {
                        text: '<b>确定</b>',
                        type: 'button-stable',
                        onTap: function (e) {
                            if (!$scope.data.wifi) {
                                e.preventDefault();
                            } else {
                                return $scope.data.wifi;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        },
        // A confirm dialog
        showConfirm: function (title,text,todoFunc) {
            var confirmPopup = $ionicPopup.confirm({
                title: title,
                template: text,
                cancelText: '取消',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    todoFunc();
                }
            });
        },
        // An alert dialog
        showAlert: function (title, message) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: message,
                buttons: [
                    {text: '确定'}
                ]
            });
            alertPopup.then(function (res) {
            });
        }

    };
    return showPopupServices;
}]);