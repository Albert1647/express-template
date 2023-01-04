var express = require('express');
var router = express.Router();

var flow = require('../service/flow.js')
var Return = require("../service/return.js");
var ReturnCode = require('../model/returnCode.js');
var Test_Control = require('../controller/test_control.js');

router.post('/sendEmail', function (request, response) {
    flow.exec(
        function () {
            Test_Control.sendEmail(this);
        },
        function (code, err, getResponse) {
            if (err) {
                Return.responseWithCode(ReturnCode.serviceError + code, err, response);
            } else {
                Return.responseWithCodeAndData(ReturnCode.success, "sendMail Successfully executed", getResponse, response);
            }
        }
    );
});

router.post('/randomTargetIndustry', function (request, response) {
    flow.exec(
        function () {
            Test_Control.getTargetIndustry(this);
        },
        function (code, err, getResponse) {
            Test_Control.randomTargetIndustry(getResponse, this);
        },
        function (code, err, getResponse) {
            if (err) {
                Return.responseWithCode(ReturnCode.serviceError + code, err, response);
            } else {
                Return.responseWithCodeAndData(ReturnCode.success, "sendMail Successfully executed", getResponse, response);
            }
        }
    );
});
// Convert Newly RESTORED Database to New Requriement 
router.post('/convertField/', function (request, response) {
    flow.exec(
        function () {
            Test_Control.unset(this);
        },
        function (code, err, getResponse) {
            Test_Control.unsetNested(this);
        },
        function (code, err, getResponse) {
            Test_Control.getTargetIndustry(this);
        },
        function (code, err, getResponse) {
            Test_Control.updateTargetIndustryArray(getResponse, this);
        },
        function (code, err, getResponse) {
            Test_Control.getEducation(this);
        },
        function (code, err, getResponse) {
            Test_Control.updateEducationArray(getResponse, this);
        },
        function (code, err, getResponse) {
            Test_Control.getAllPublication(this);
        },
        // function (code, err, getResponse) {
        //     Test_Control.convertPublicationType(getResponse, this);
        // },
        // function (code, err, getResponse) {
        //     Test_Control.resetField(this);
        // },
        function (code, err, getResponse) {
            if (err) {
                Return.responseWithCode(ReturnCode.serviceError + code, err, response);
            } else {
                Return.responseWithCodeAndData(ReturnCode.success, "updateTargetIndustry Successfully executed", getResponse, response);
            }
        }
    );
});

module.exports = router;