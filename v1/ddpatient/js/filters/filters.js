'use strict';

/* Filters */

var ddpatientFilters = angular.module('ddpatientFilters', []);

//大小写转化
ddpatientFilters.filter('titleCase', [function () {
    var titleCaseFilter = function (input) {
        var words = input.split(' ');
        for (var i = 0; i < words.length; i++) {
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        }
        return words.join(' ');
    };
    return titleCaseFilter;
}]);
//日期格式化
ddpatientFilters.filter('dateTranfer', [function () {
    var dateCaseFilter = function (input) {
        var inputDate = new Date(input);
        var month = inputDate.getMonth() + 1;
        var words = inputDate.getFullYear() + '年' + month + '月' + inputDate.getDate() + '日' + '星期'
            + '日一二三四五六'.charAt(inputDate.getDay()) + '<br/><br/>';
        return words;
    };
    return dateCaseFilter;
}]);
//日期事件控制，用于显示可预约日期
ddpatientFilters.filter('dateForOrder', [function () {
    var events = function (input) {
        var eventlist = [];
        for (var i = 0; i < input.length; i++) {
            var pdate = new Date(input[i]);
            var ndate = new Date(pdate.getFullYear() + '-' + (pdate.getMonth() + 1) + '-' + (pdate.getDate() + 1));
            eventlist.push({
                startTime: ndate,
                endTime: ndate,
                allDay: true
            });
        }
        return eventlist;
    };
    return events;
}]);
ddpatientFilters.filter('gender', [function () {
    var gender = function (input) {
        var tempGender = '男';
        if (input == '1') {
            tempGender = '女';
        }
        return tempGender;
    };
    return gender;
}]);
ddpatientFilters.filter('dateFormat1', [function () {
    var userdate = function (input) {
        var tempDate = new Date(input);
        var year = tempDate.getFullYear();
        var month = tempDate.getMonth() + 1;
        var dddate = tempDate.getDate();
        var tempDD = year + "." + month + "." + dddate;
        return tempDD;
    };
    return userdate;
}]);
ddpatientFilters.filter('ageFormat', [function () {
    var userAge = function (input) {
        var nowDate = new Date();
        var tempDate = new Date(input);
        var userTempAge = nowDate.getFullYear() - tempDate.getFullYear();
        return userTempAge;
    };
    return userAge;
}]);


// 状态 ,0-排队中，1-预约成功，2、已挂号 ，3——已看完病，4——已作废取消
ddpatientFilters.filter('registerStatus', [function () {
    var registerStatus = function (input) {
        var status = '排队中';
        if (input == '0') {
            status = '草稿';
        } else if (input == '1') {
            status = '已预约';
        } else if (input == '2') {
            status = '已挂号';
        } else if (input == '3') {
            status = '已诊疗';
        } else if (input == '4') {
            status = '已取消';
        } else if (input == '5') {
            status = '已评价';
        }
        return status;
    };
    return registerStatus;
}]);


ddpatientFilters.filter('timeSlot', [function () {
    var timeSlot = function (input) {
        var tempSlot = '全天';
        if (input == '1') {
            tempSlot = '上午';
        } else if (input == '2') {
            tempSlot = '下午';
        } else if (input == '3') {
            tempSlot = '晚上';
        }
        return tempSlot;
    };
    return timeSlot;
}]);
//名字显示一部分
ddpatientFilters.filter('namePart', [function () {
    var titleCaseFilter = function (input) {
        var words = input.substring(0, 1);
        if (words) {
            return words + '**';
        } else {
            return '***';
        }

    };
    return titleCaseFilter;
}]);

// Status 表示在该医院的挂号状态,非持久态，临时算出 包括，0-未排队 ，1-已排队 ，2-可挂号 3-已挂号 ，availableCount 表示医生在该医院的余票数量
ddpatientFilters.filter('doctorHospitalsStatus', [function () {
    var registerStatus = function (input) {
        var status = '号满排队';
        if (input == '0') {
            status = ' 号满排队';
        } else if (input == '1') {
            status = '已经排队';
        } else if (input == '2') {
            status = '预约挂号';
        } else if (input == '3') {
            status = '已经挂号';
        }
        return status;
    };
    return registerStatus;
}]);

// Status 表示在该医院的挂号状态,非持久态，临时算出 包括，0-未排队 ，1-已排队 ，2-可挂号 3-已挂号 ，availableCount 表示医生在该医院的余票数量
ddpatientFilters.filter('doctorStatus', [function () {
    var doctorStatus = function (input) {
        var doctorStatus = '可预约';
        if (input == '1') {
            doctorStatus = ' 可预约';
        } else  {
            doctorStatus = '可排队';
        }
        return doctorStatus;
    };
    return doctorStatus;
}]);

ddpatientFilters.filter('fontColorFilter', [function () {
    var fontColorStatus = function (input) {
        var fontColor = 'color:green';
        if (input == '挂号诚意金') {
            fontColor = 'color:black';
        } else if (input == '诊疗后退款') {
            fontColor = 'color:blue';
        } else {
            fontColor = 'color:green';
        }
        return fontColor;
    };
    return fontColorStatus;
}]);
ddpatientFilters.filter('cut', [function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
}]);

ddpatientFilters.filter('transferStatus', [function () {
    var transferStatus= function (input) {
        var status = '';
        if(input=='0'){
            status = '(交易中)';
        }else{
        }
        return status;
    };
    return  transferStatus;
}]);