'use strict';

/* Filters */

var dddoctorFilters=angular.module('dddoctorFilters', []);

dddoctorFilters.filter('titleCase', function() {
  var titleCaseFilter= function (input) {
    var words = input.split(' ');
    for (var i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(' ');
  };
    return  titleCaseFilter;
});

dddoctorFilters.filter('dateFormat1', function() {
	  var userdate= function (input) {
	  var tempDate = new Date(input);
	  var year=tempDate.getFullYear();
	  var month=tempDate.getMonth()+1;
	  var dddate=tempDate.getDate();
	  var tempDD=year+"."+month+"."+dddate;
	  return tempDD;
	  };
	    return  userdate;
	});
dddoctorFilters.filter('dateFormatAge', function () {
    var userAge = function (input) {
        var nowDate = new Date();
        var now = nowDate.getFullYear();
        var tempDate = new Date(input);
        var year = tempDate.getFullYear();
        var age = now-year;
        return age;
    };
    return userAge;
});

dddoctorFilters.filter('dateFormatAge1', function () {
    var userAge = function (idCard) {
        var year = "";
        if(idCard && idCard.length==18)
        {
            year = idCard.substring(6,10);
            var month = idCard.substring(10,12);
            var date=idCard.substring(12,14);
            var nowDate = new Date();
            var now = nowDate.getFullYear();

            var age = now-year;
            return age;
        }else{
            return "*";
        }
    }

    return userAge;
});


dddoctorFilters.filter('timeSlot', function() {
	  var timeSlot= function (input) {
		  var tempSlot = '全天';
		  if(input=='1'){
			  tempSlot = '上午';
		  }else if(input=='2'){
			  tempSlot = '下午';
		  }else if(input=='3'){
			  tempSlot = '晚上';
		  }
	  return tempSlot;
	  };
	    return  timeSlot;
	});

dddoctorFilters.filter('gender', function() {
	  var gender= function (input) {
		  var tempGender = '未知';
		  if(input=='1'){
              tempGender = '男';
		  }else if(input=='2'){
              tempGender = '女';
          }
	  return tempGender;
	  };
	    return  gender;
	});
//排队状态
dddoctorFilters.filter('queueStatus', function() {
    var status= function (input) {
        var tempStatus = '排队中';
        if(input=='1'){
            tempStatus =  "http://www.yushansoft.com/dingdong/images/doctors/queue.png";
        }else{
            tempStatus = '';
        }
        return tempStatus;
    };
    return  status;
});
//日期格式化
dddoctorFilters.filter('dateTranfer', function () {
    var dateCaseFilter = function (input) {
        var inputDate = new Date(input);
        var month=inputDate.getMonth()+1;
        var words = inputDate.getFullYear() + '年' + month +'月'+ inputDate.getDate()+'日'+'星期'
            + '日一二三四五六'.charAt(inputDate.getDay())+'<br/><br/>';
        return words;
    };
    return dateCaseFilter;
});
// 状态 ,0-排队中，1-预约成功，2、已挂号 ，3——已看完病，4——已作废取消
dddoctorFilters.filter('registerStatus', function() {
	  var registerStatus= function (input) {
          var status = '排队中';
          if (input == '0') {
              status = '草稿';
          } else if (input == '1') {
              status = '已预约';
          } else if (input == '2') {
              status = '已挂号';
          } else if (input == '3') {
              status = '已诊疗';
          }else if (input == '4') {
              status = '已取消';
          }else if (input == '5') {
              status = '已评价';
          }
	  return status;
	  };
	    return  registerStatus;
	});
//‘0’转化为false,'1'转化为true，用于医院是否开放排队状态转化
dddoctorFilters.filter('hospitalFilter', function () {
    var timeSlot = function (input) {
        var tempSlot = true;
        if (input == '1') {
            tempSlot = true;
        } else{
            tempSlot = false;
        }
        return tempSlot;
    };
    return timeSlot;
});
//false转化为'0',true转化为'1'，用于医院是否开放排队状态转化
dddoctorFilters.filter('hospitalRevFilter', function () {
    var timeSlot = function (input) {
        var tempSlot = 1;
        if (input == true) {
            tempSlot = 1;
        } else if (input == false) {
            tempSlot = 0;
        }
        return tempSlot;
    };
    return timeSlot;
});

dddoctorFilters.filter('transferStatus', function () {
    var transferStatus= function (input) {
        var status = '';
        if(input=='0'){
            status = '(交易中)';
        }else{
        }
        return status;
    };
    return  transferStatus;
});