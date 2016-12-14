var ddpatientServices = angular.module('ddpatientServices', ['ngResource']);

//var serverName = '127.0.0.1:80';
var serverName = 'www.yushansoft.com';

//用户信息，存储用户排队、预约和关注的医生的情况，用于控制器之间通信的服务
ddpatientServices.factory('userInforList', [function () {
    return {}
}]);
//医生信息，存储医生日程信息，用于控制器之间的通信服务
ddpatientServices.factory('doctorInforList', [function () {
    return {};
}]);
//通用工具服务，存储医生日程信息，用于控制器之间的通信服务
ddpatientServices.factory('doctorUtils', ['ddJsConfig',function (ddJsConfig) {
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
//取得医生信息
ddpatientServices.factory('doctorServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/doctors/:id', null, {
        queryAll: {
            method: 'get',
            params: {size: '@size', page: '@number', orderBy: '@orderBy', order: '@order'},
            isArray: false
        }
    });
}]);
//取得所有可预约医生信息
ddpatientServices.factory('doctorRegisteredServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/doctors/status', null, {
        queryAll: {
            method: 'get',
            params: {status: '@status'},
            isArray: false
        }
    });
}]);
//取得新入驻医生信息
ddpatientServices.factory('doctorNewJoinServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/doctors/newJoinDoctors', null, {
        queryAll: {method: 'get', params: {requireNum: '@requireNum'}, isArray: false}
    });
}]);
//取得科室下面的医生信息
ddpatientServices.factory('doctorDeptDoctorsServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/depts/:id/recursiveDoctors', {id: '@id'}, {
        queryAll: {method: 'get', params: {}, isArray: false}
    });
}]);
//医生行程信息
ddpatientServices.factory('scheduleServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/doctors/:id/scheduleDates', null, {
        query: {method: 'get', params: {beginDate: '@beginDate', endDate: '@endDate'}, isArray: false}
    });
}]);
//医生日程信息——含每天三个时段信息
ddpatientServices.factory('scheduleOnedayServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/doctors/:doctorId/hospitals/:hospitalId/schedules', null, {
        query: {method: 'get', params: {beginDate: '@beginDate', endDate: '@endDate'}, isArray: false}
    });
}]);

//查询医生在某一医院的每日可预约信息信息
ddpatientServices.factory('scheduleDatesServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/doctors/:doctorId/hospitals/:hospitalId/scheduleDates', null, {
        query: {method: 'get', params: {beginDate: '@beginDate', endDate: '@endDate'}, isArray: false}
    });
}]);

//用于检验用户是否重复点击预约
ddpatientServices.factory('scheduleUserServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/users/:userId/schedules/:scheduleId/registers', null, {
        getScheduleUser: {method: 'get', params: {userId: '@userId', scheduleId: '@scheduleId'}, isArray: false}
    });
}]);


//取得用户所关注的医生，按医生编号与患者用户编号
ddpatientServices.factory('cancelUserFansServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/users/:userId/doctorFans', null, {
        cancelUserFans: {method: 'DELETE', params: {userId: '@userId', doctorId: '@doctorId'}, isArray: false}
    });
}]);
//关注的医生，医生列表，取消关注
ddpatientServices.factory('userFansServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/users/:id/doctorFans', {
        id: '@id',
        doctorId: '@doctorId'
    });
}]);
//用户排队
ddpatientServices.factory('userQueueServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/users/:id/queues', {
        id: '@id',
        doctorId: '@doctorId',
        hospitalId: '@hospitalId'
    });
}]);
//用户新排队
ddpatientServices.factory('userNewQueueServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/registers/queueUp', {}, {
        userQueueUp: {
            method: 'POST',
            params: {
                userId: '@userId',
                patientId: '@patientId',
                doctorId: '@doctorId',
                hospitalId: '@hospitalId',
                revisit: '@revisit',
                phenomenon: '@phenomenon',
                attachNo: '@attachNo',
            },
            isArray: false
        }
    });
}]);

//用户多个医院排队POST /user/{userId}/mutiQueueUp
ddpatientServices.factory('userMultiQueueServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/users/:id/mutiQueueUp', {
        id: '@id',
        doctorId: '@doctorId',
        hospitalStr: '@hospitalStr'
    });
}]);


//执行医院
ddpatientServices.factory('hospitalServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/docotors/:id/doctorHospitals', {
        id: '@id'
    });
}]);

//更新挂号信息
ddpatientServices.factory('registerUpdateServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/registers/:id', {}, {
        registerUpdate: {
            method: 'PATCH',
            params: {id: '@id', phenomenon: '@phenomenon', attachNo: '@attachNo'},
            isArray: false
        }
    });
}]);

//按医院查询医生
ddpatientServices.factory('hospitalDoctorsServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/hospitals/:hospitalId/doctorHospitals', {}, {
        getHospitalDoctors: {method: 'GET', params: {hospitalId: '@hospitalId'}, isArray: false}
    });
}]);

//查询未完成的预约的信息
ddpatientServices.factory('registerUnFinishedServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/users/:id/registers/unfinished', {
        id: '@id'
    });
}]);

//病患查询-查询某个状态下的预约信息，
ddpatientServices.factory('getRegisterByStatusServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/users/:userId/registers/status', {userId: '@userId'}, {
        getRegisterByStatus: {method: 'GET', params: {status: '@status'}, isArray: false}
    });
}]);


//取消挂号
ddpatientServices.factory('cancelRegisterServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/registers/:id', {id: '@id'}, {
        cancelRegister: {method: 'DELETE', params: {}}
    });
}]);

//GET /registers/{id} 查询某一指定编号的挂号信息
ddpatientServices.factory('getRegisterByIdServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/registers/:id', {id: '@id'}, {});
}]);

//按照排队号取消排队
ddpatientServices.factory('ddDeleteQueueServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/registers/queues/:id', {id: '@id'}, {
        deleteQueue: {method: 'DElETE', params: {}}
    });
}]);

//获得短信验证码
ddpatientServices.factory('ddSmsValiServices', ['$resource', '$http', '$q', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/sms/validNum', {}, {
        validNum: {method: 'GET', params: {mobileNo: '@mobileNo'}, isArray: false}
    });
}]);
//用户验证,通过验证后才写入电话号码
ddpatientServices.factory('ddUpdateSmsValiServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/sms/validation', null, {
        updateSmsValid: {
            method: 'PUT',
            params: {userId: '@userId', mobileNo: '@mobileNo', msgCode: '@msgCode', imgCode: '@imgCode'}
        }
    });
}]);

// 获得患者信息-获得指定id患者信息
ddpatientServices.factory('ddUserServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/users/:userId', {userId: '@userId'}, {});
}]);

// 用户预约名医,预约挂号
ddpatientServices.factory('ddUserRegisterServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/users/:userId/registers', {userId: '@userId'}, {
        userRegister: {method: 'POST', params: {patientId: '@patientId', scheduleId: '@scheduleId'}, isArray: false}
    });
}]);

//更新用户的基本信息
ddpatientServices.factory('ddUpdateUserInformationServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/users/:id', {id: '@id'}, {
        updateUserInformation: {
            method: 'PUT',
            params: {
                name: '@name',
                gender: '@gender',
                address: '@address',
                certificateId: '@certificateId',
                headImgUrl: '@headImgUrl'
            }
        }
    });
}]);

ddpatientServices.factory('ddUserDirectRegisterServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/users/:userId/directRegister', {
        userId: '@userId',
        patientId: '@patientId',
        scheduleId: '@scheduleId',
        phenomenon: '@phenomenon',
        revisit: '@revisit',
        attachNo: '@attachNo'
    });
}]);
// 用户预约挂号,直接输入患者的姓名和身份证号码POST /users/{userId}/directRegister
ddpatientServices.factory('ddUserConfirmRegisterServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/users/{userId}/confirmRegister', {
        registerId: '@registerId',
        patientId: '@patientId',
        phenomenon: '@phenomenon',
        revisit: '@revisit',
        attachNo: '@attachNo'
    });
}]);

//病患查询-查询某个状态下的预约信息，挂号状态 状态参数 ,0-预约成功，1、已挂号成功 、2——已支付，3——已看完病，4——已作废取消
ddpatientServices.factory('ddGetRegistersByStatusServices', ['$resource', '$http', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/users/:userId/registers/status', {userId: '@userId'}, {
        getRegistersByStatus: {method: 'GET', params: {status: '@status'}, isArray: false}
    });
}]);


//获得医生信息-获得所有医生信息---查询filterText，姓名和特长查询
ddpatientServices.factory('ddGetDoctorsByNameOrSpecialty', ['$resource', '$http', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/doctors', {}, {
        getDoctorsByNameOrSpecialty: {
            method: 'GET',
            params: {filterText: '@filterText', size: '@size', page: '@page', order: '@order', orderBy: '@orderBy'},
            isArray: false
        }
    });
}]);

//获得未签约医生列表
ddpatientServices.factory('ddGetDoctorsnsigned', ['$resource', '$http', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/doctors/unsigned', {}, {
        getGetDoctorsnsigned: {method: 'GET', params: {doctorName: '@doctorName'}, isArray: false}
    });
}]);

//按医生查询执业医院信息
ddpatientServices.factory('ddHospitalsServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/hospitals', {}, {
        getHospitals: {
            method: 'GET',
            params: {filterText: '@filterText', size: '@size', page: '@page', orderBy: '@orderBy', order: '@order'},
            isArray: false
        }
    });
}]);

//按医生查询执业医院信息
ddpatientServices.factory('ddHospitalsAllServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/hospitals', {}, {
        getAllHospitals: {
            method: 'GET',
            params: {size: '@size', page: '@page', orderBy: '@orderBy', order: '@order'},
            isArray: false
        }
    });
}]);

//确认预约
ddpatientServices.factory('ddConfirmQueueServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/registers/:id/confirmQueue', {id: '@id'}, {
        ddConfirmQueue: {method: 'POST', params: {}, isArray: false}
    });
}]);

//按医生查询执业医院信息
ddpatientServices.factory('ddDoctorHospitalsServices', ['$resource', '$http', '$q', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/docotors/:doctorId/doctorHospitals', {}, {
        getDoctorHospitals: {method: 'GET', params: {doctorId: '@doctorId', status: '@status'}, isArray: false}
    });
}]);


//按医生查询医生的评价信息
ddpatientServices.factory('ddDoctorEvaluationsServices', ['$resource', '$http', '$q', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/docotors/:doctorId/doctorEvals', {}, {
        getDoctorEvaluations: {
            method: 'GET',
            params: {doctorId: '@doctorId', size: '@size', page: '@page', order: '@order', orderBy: '@orderBy'},
            isArray: false
        }
    });
}]);

//获得用户评价的医生列表
ddpatientServices.factory('ddMyEvaluationsServices', ['$resource', '$http', '$q', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/users/:userId/doctorEvals', {}, {
        getMyEvaluations: {method: 'GET', params: {userId: '@userId'}, isArray: false}
    });
}]);
//获得患者信息-获得指定微信号获得患者信息
ddpatientServices.factory('ddUserPatientServices', ['$resource', '$http', '$q', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/users/:userId/patients', {}, {
        getUserPatient: {method: 'GET', params: {userId: '@userId'}, isArray: false}
    });
}]);

//按评价编号删除评论
ddpatientServices.factory('cancelEvaluationServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/doctorEvals/:id', {id: '@id'}, {
        cancelEvaluation: {method: 'DELETE', params: {}}
    });
}]);

//新增医生评价信息
ddpatientServices.factory('addEvaluationServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/users/:userId/doctorEval', {
        userId: '@userId',
        registerId: '@registerId',
        treatmentEffect: '@treatmentEffect',
        serviceAttitude: '@serviceAttitude',
        evalDesc: '@evalDesc',
        tags: '@tags'
    });
}]);

//获得用户上传的文件
ddpatientServices.factory('yusFilesServices', ['$resource', '$http', '$q', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/yusFiles/:id', {id: '@id'}, {});
}]);

//添加文件
ddpatientServices.factory('ddAddYusFilesServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/yusFiles', {
        userId: '@userId',
        wxServerId: '@wxServerId'
    });
}]);


//userRelation:与患者关系,0-本人,1-家人,2-亲戚,3-朋友,4-其他
ddpatientServices.factory('ddUserPatientAddServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/users/:userId/patients', {userId: '@userId'}, {
        userPatientAdd: {
            method: 'POST',
            params: {
                patientName: '@patientName',
                gender: '@gender',
                certificateId: '@certificateId',
                userRelation: '@userRelation',
                phone: '@phone'
            },
            isArray: false
        }
    });
}]);

//删除患者
ddpatientServices.factory('deleteUserPatientServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/patients/:id', {id: '@id'}, {
        deleteUserPatient: {method: 'DELETE', params: {}}
    });
}]);

// 获得患者信息-获得指定id患者信息
ddpatientServices.factory('getUserPatientServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/patients/:id', {id: '@id'}, {
        getUserPatient: {method: 'GET', params: {}, isArray: false}
    });
}]);
//更新患者信息
//userRelation:与患者关系,0-本人,1-家人,2-亲戚,3-朋友,4-其他
ddpatientServices.factory('ddUserPatientUpdateServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/patients/:id', {id: '@id'}, {
        userPatientUpdate: {
            method: 'PUT',
            params: {
                userId: '@userId',
                name: '@name',
                certificateId: '@certificateId',
                userRelation: '@userRelation',
                gender: '@gender',
                birthday: '@birthday',
                phone: '@phone',
                address: '@address'
            },
            isArray: false
        }
    });
}]);

//医生查询-查询某个状态下的预约信息，挂号状态 // 状态 ,0—草稿，1-已预约，2-已挂号，3-已诊疗，4-取消
ddpatientServices.factory('ddPatientHistoryServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/doctors/:id/registers/status', {id: '@id'}, {
        queryHistory_Registers: {method: 'GET', params: {}, isArray: false}
    });
}]);
// 获得名医的排队信息
ddpatientServices.factory('ddGetDoctorQueuesServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/doctors/:doctorId/statQueue', {doctorId: '@doctorId'}, {
        getDoctorQueues: {method: 'GET', params: {}, isArray: false}
    });
}]);

//GET /wechat/jsConfig 获得jsapi的config信息
ddpatientServices.factory('ddJsConfig', ['$resource', '$http', '$q', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/ddmz/jsConfig', {}, {
        jsConfig: {method: 'GET', params: {url: '@url'}, isArray: false}
    });
}]);

//查询医生在某一医院的日程信息   status=1 而且 issueNum》>registeredNum 时表示可以预约 ，issueNum==registeredNum表示已约满
ddpatientServices.factory('ddGetDoctorScheduleDateServices', ['$resource', '$http', '$q', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/doctors/:doctorId/hospitals/:hospitalId/schedules', {
        doctorId: '@doctorId',
        hospitalId: '@hospitalId'
    }, {
        getDoctorScheduleDate: {method: 'GET', params: {beginDate: '@beginDate', endDate: '@endDate'}, isArray: false}
    });
}]);

//GET /docotors/{doctorId}/doctorHospitalsWithRegisterInfo 获得医生的所有执业信息,含该患者用户的挂号信息
//registerStatus 表示在该医院的挂号状态,非持久态，临时算出 包括，0-未排队 ，1-已排队 ，2-可挂号 3-已挂号 ，availableCount 表示医生在该医院的余票数量
ddpatientServices.factory('ddGetDoctorHospitalsWithRegisterInfoServices', ['$resource', '$http', '$q', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/docotors/:doctorId/doctorHospitalsWithRegisterInfo', {doctorId: '@doctorId'}, {
        getDoctorHospitalsWithRegisterInfo: {method: 'GET', params: {userId: '@userId'}, isArray: false}
    });
}]);

//用户之间交流
ddpatientServices.factory('userChatService', ['$resource', '$http', '$q', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/userChat/:fromId', {}, {});
}]);

//或取转账信息，type=0 表示余额， =1表示 积分.
ddpatientServices.factory('ddUserTransfersServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/users/:userId/Transfers', {userId: '@userId'}, {
        getUserTransfers: {method: 'GET', params: {type: '@type', size: '@size', page: '@page'}, isArray: false}
    });
}]);
//取得用户所有交流信息
ddpatientServices.factory('ddUserChatAllServices', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/users/:userId/msgs/:endDate', {userId: '@userId'},
        {method: 'GET', params: {size: '@size', page: '@page'}, isArray: false}
    );
}]);
//取得用户之间交流的信息
ddpatientServices.factory('ddUserTwoUserMsgs', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/msgs', {userId: '@userId'},
        {
            method: 'GET',
            params: {fromUserId: 'fromUserId', toUserId: 'toUserId', size: '@size', page: '@page'},
            isArray: false
        });
}]);
//阅读消息
ddpatientServices.factory('ddUserReadMsgs', ['$resource', function ($resource) {
    return $resource('http://' + serverName + '/dingdong/msgs/:toId/read', {toId: '@toId'}, {
        readMsgs: {method: 'PATCH', params: {}, isArray: false}
    });
}]);
//GET /registers/{id} 查询某一指定编号的挂号信息
ddpatientServices.factory('ddRegistersServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/registers/:id', {id: '@id'}, {});
}]);
//获得患者信息-获得指定id患者信息
ddpatientServices.factory('ddPatientDetailServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/patients/:patientId', {patientId: '@patientId'}, {});
}]);
//获得某次诊疗的评价列表
ddpatientServices.factory('getDoctorEvalsByRegisterServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/registers/:registerId/doctorEvals', {registerId: '@registerId'}, {
        getDoctorEvalsByRegisterId: {method: 'GET', params: {}, isArray: false}
    });
}]);
//获得医院科室信息-获得指定id医院科室信息
ddpatientServices.factory('hospitalDeptTreeServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/hospitalDepts/:hospitalId/tree', {registerId: '@registerId'},
        {method: 'GET', params: {hospitalId: '@hospitalId', size: '@size', page: '@page'}, isArray: false}
    );
}]);

//获得所有顶层科室信息
ddpatientServices.factory('topDeptServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/depts/topDepts', {},
        {method: 'GET', params: {}, isArray: false}
    );
}]);

//获得子科室信息
ddpatientServices.factory('subDeptServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/depts/:parentId/subDepts', {parentId:"@parentId"},
        {method: 'GET', params: {}, isArray: false}
    );
}]);

//获得所有科室信息
ddpatientServices.factory('allDeptServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/depts', {},
        {method: 'GET', params: {filterText: '@filterText', size: '@size', page:'@page',order: '@order',orderBy:'orderBy'}, isArray: false}
    );
}]);

//获得所有系统标签
ddpatientServices.factory('getDoctorsTagsServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/systag/tags', {}, {
        getDoctorsTags: {method: 'GET', params: {}, isArray: false}
    });
}]);

//获得单个医院介绍信息
ddpatientServices.factory('getHosipitalIntroServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://' + serverName + '/dingdong/hospitals/:hospitalId', {}, {
        getSingleHosiptal: {method: 'GET', params: {hospitalId: '@hospitalId'}, isArray: false}
    });
}]);

//获得用户账户
ddpatientServices.factory('ddAccountsServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://'+serverName+'/dingdong/accounts/:userId/userId', {userId: '@userId'}, {
        getAccounts: {method: 'GET', params: {}, isArray: false}
    });
}]);

//删除账户信息
ddpatientServices.factory('ddDeleteAccountServices', ['$resource', '$q', function ($resource, $q) {
    return $resource('http://'+serverName+'/dingdong/accounts/:id', null, {
        deleteAccount: {method: 'DElETE', params: {id:'@id'}}
    });
}]);
//添加提现账户
ddpatientServices.factory('ddAddAccountsServices', ['$resource',  function ($resource) {
    return $resource('http://'+serverName+'/dingdong/accounts', null,{
        addAccounts: {method: 'POST'}
    });
}]);

//提交提现申请
ddpatientServices.factory('ddCashApplyServices', ['$resource',  function ($resource) {
    return $resource('http://'+serverName+'/dingdong/transfers/getCashApply', {},{
        postCashApply: {method: 'POST',params: {accountId: '@accountId',amount: '@amount'}}
    });
}]);
//充值申请
ddpatientServices.factory('ddRechargeServices', ['$resource',  function ($resource) {
    return $resource('http://'+serverName+'/dingdong/ddmz/payToken', {},{
        postRecharge: {method: 'GET',params: {userId: '@userId',totalFee: '@totalFee'}}
    });
}]);

//弹出框公用服务
ddpatientServices.factory('showPopupServices', ['$ionicPopup', function ($ionicPopup) {
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