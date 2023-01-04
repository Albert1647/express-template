var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");
var formidable = require('formidable')
var path = require('path')
var fs = require('fs');

// DATABASE SETUP
var ObjectId = require('mongodb').ObjectId;

var ReturnCode = require('../model/returnCode.js');
let config = require('../../config/config.js');
var Researcher = require('../model/researcher_model.js');
var User = require('../model/user.js');

var flow = require('./flow.js')
var Validate = require("./validation.js");
var auth = require("../controller/auth.js");
var Return = require("./return.js");
var Researcher_Control = require('../controller/researcher_control.js');
var User_Control = require('../controller/user_control.js');

let researcherPicFolder = "./public/file/image/researcherPic"
let attachmentPicFolder = "./public/file/image/attachment"
let highlightPicFolder = "./public/file/image/highlightCoverPic"
let newsPicFolder = "./public/file/image/newsCoverPic"

console.log("File Location Detecting")

let folderName = researcherPicFolder.split("/")
let folderNameTmp = "."
for (let i = 1; i < folderName.length; i++) {
    folderNameTmp = folderNameTmp + "/" + folderName[i]
    console.log("checking DIR == " + folderNameTmp)
    if (!fs.existsSync(folderNameTmp)) {
        console.log("NO DIR")
        fs.mkdirSync(folderNameTmp);
    }
    else {
        console.log("DIR researcherPicFolder already available")
    }
}

let folderName2 = attachmentPicFolder.split("/")
let folderNameTmp2 = "."
for (let i = 1; i < folderName2.length; i++) {
    folderNameTmp2 = folderNameTmp2 + "/" + folderName2[i]
    console.log("checking DIR == " + folderNameTmp2)
    if (!fs.existsSync(folderNameTmp2)) {
        console.log("NO DIR")
        fs.mkdirSync(folderNameTmp2);
    }
    else {
        console.log("DIR attachmentPicFolder already available")
    }
}

let folderName3 = highlightPicFolder.split("/")
let folderNameTmp3 = "."
for (let i = 1; i < folderName3.length; i++) {
    folderNameTmp3 = folderNameTmp3 + "/" + folderName3[i]
    console.log("checking DIR == " + folderNameTmp3)
    if (!fs.existsSync(folderNameTmp3)) {
        console.log("NO DIR")
        fs.mkdirSync(folderNameTmp3);
    }
    else {
        console.log("DIR highlightPicFolder already available")
    }
}

let folderName4 = newsPicFolder.split("/")
let folderNameTmp4 = "."
for (let i = 1; i < folderName4.length; i++) {
    folderNameTmp4 = folderNameTmp4 + "/" + folderName4[i]
    console.log("checking DIR == " + folderNameTmp4)
    if (!fs.existsSync(folderNameTmp4)) {
        console.log("NO DIR")
        fs.mkdirSync(folderNameTmp4);
    }
    else {
        console.log("DIR newsPicFolder already available")
    }
}

router.post('/researcher/upload/pic', function (request, response) {
    let responseJSON = {}
    let incomingForm = new formidable.IncomingForm();
    incomingForm.parse(request, function (err, fields, files) { // ใช้ตัวแปลงนี้ ถ้าเกิดส่งมาแบบผสม (ข้อมูล + ไฟล์ต่างๆ)
        console.log("Parsing Request COMPLETED...")
        if (err) {
            responseJSON.err = "ERROR in incomingForm.parse >>" + err
            console.log('ERROR: ' + err)
            res.status(200).json(responseJSON);
        } else {

            if (files) {

                if (files.researcherPicture) {
                    let oldpath1 = files.researcherPicture.path;
                    let fileExt1 = files.researcherPicture.name.split('.')[1];
                    let newfilename1 = randomstring.generate(12) + Date.now()
                    let newpath1 = researcherPicFolder + "/" + newfilename1 + "." + fileExt1
                    let rawData = fs.readFileSync(oldpath1)

                    // console.log(files.researcherPicture)
                    fs.writeFile(newpath1, rawData, function (err) {
                        let obj = {
                            // newFilePath: newpath1.replace(/\.\/public/i, `https://research.science.kmitl.ac.th/uploads`)
                            newFilePath: newpath1.replace(/\.\/public/i, config.saveImagePath)
                        }
                        console.log(oldpath1)
                        console.log(newpath1)
                        Return.responseWithCodeAndData(ReturnCode.success, "New file is saved successfully", obj, response);
                    });

                    // fs.rename(oldpath1, newpath1, function (err) {
                    //     let obj = {
                    //         newFilePath: newpath1.replace(/\.\/public/i,`https://research.science.kmitl.ac.th/uploads`)
                    //     }
                    //     console.log(oldpath1)
                    //     console.log(newpath1)
                    //     Return.responseWithCodeAndData(ReturnCode.success, "New file is saved successfully", obj, response);
                    // });
                }
                else {
                    Return.responseWithCodeAndData(ReturnCode.success, "No file is sent", null, response);
                }

            }
        }
        // }
    });
});
router.post('/intProperty/upload/pic', function (request, response) {
    let responseJSON = {}
    let incomingForm = new formidable.IncomingForm();
    incomingForm.parse(request, function (err, fields, files) { // ใช้ตัวแปลงนี้ ถ้าเกิดส่งมาแบบผสม (ข้อมูล + ไฟล์ต่างๆ)
        console.log("Parsing Request COMPLETED...")
        if (err) {
            responseJSON.err = "ERROR in incomingForm.parse >>" + err
            console.log('ERROR: ' + err)
            res.status(200).json(responseJSON);
        } else {

            if (files) {
                if (files.attachment) {
                    let oldpath1 = files.attachment.path;
                    let fileExt1 = files.attachment.name.split('.')[1];
                    let newfilename1 = randomstring.generate(12) + Date.now()
                    let newpath1 = attachmentPicFolder + "/" + newfilename1 + "." + fileExt1
                    let rawData = fs.readFileSync(oldpath1)
                    // console.log(files.researcherPicture)
                    fs.writeFile(newpath1, rawData, function (err) {
                        let obj = {
                            newFilePath: newpath1.replace(/\.\/public/i, config.saveImagePath)
                            // newFilePath: newpath1.replace(/\.\/public/i, `https://research.science.kmitl.ac.th/uploads`)
                        }
                        console.log(oldpath1)
                        console.log(newpath1)
                        Return.responseWithCodeAndData(ReturnCode.success, "New file is saved successfully", obj, response);
                    });

                    // fs.rename(oldpath1, newpath1, function (err) {
                    //     let obj = {
                    //         newFilePath: newpath1.replace(/\.\/public/i,`https://research.science.kmitl.ac.th/uploads`)
                    //     }
                    //     console.log(oldpath1)
                    //     console.log(newpath1)
                    //     Return.responseWithCodeAndData(ReturnCode.success, "New file is saved successfully", obj, response);
                    // });
                }
                else {
                    Return.responseWithCodeAndData(ReturnCode.success, "No file is sent", null, response);
                }

            }
        }
        // }
    });
});
router.post('/highlight/upload/pic', function (request, response) {
    let responseJSON = {}
    let incomingForm = new formidable.IncomingForm();
    incomingForm.parse(request, function (err, fields, files) { // ใช้ตัวแปลงนี้ ถ้าเกิดส่งมาแบบผสม (ข้อมูล + ไฟล์ต่างๆ)
        console.log("Parsing Request COMPLETED...")
        if (err) {
            responseJSON.err = "ERROR in incomingForm.parse >>" + err
            console.log('ERROR: ' + err)
            res.status(200).json(responseJSON);
        } else {
            if (files) {
                if (files.coverImage) {
                    let oldpath1 = files.coverImage.path;
                    let fileExt1 = files.coverImage.name.split('.')[1];
                    let newfilename1 = randomstring.generate(12) + Date.now()
                    let newpath1 = highlightPicFolder + "/" + newfilename1 + "." + fileExt1
                    let rawData = fs.readFileSync(oldpath1)
                    // console.log(files.researcherPicture)
                    fs.writeFile(newpath1, rawData, function (err) {
                        let obj = {
                            newFilePath: newpath1.replace(/\.\/public/i, config.saveImagePath)
                            // newFilePath: newpath1.replace(/\.\/public/i, `https://research.science.kmitl.ac.th/uploads`)
                        }
                        Return.responseWithCodeAndData(ReturnCode.success, "New file is saved successfully", obj, response);
                    });

                    // fs.rename(oldpath1, newpath1, function (err) {
                    //     let obj = {
                    //         newFilePath: newpath1.replace(/\.\/public/i,`https://research.science.kmitl.ac.th/uploads`)
                    //     }
                    //     console.log(oldpath1)
                    //     console.log(newpath1)
                    //     Return.responseWithCodeAndData(ReturnCode.success, "New file is saved successfully", obj, response);
                    // });
                }
                else {
                    Return.responseWithCodeAndData(ReturnCode.success, "No file is sent", null, response);
                }

            }
        }
        // }
    });
});
router.post('/news/upload/pic', function (request, response) {
    let responseJSON = {}
    let incomingForm = new formidable.IncomingForm();
    incomingForm.parse(request, function (err, fields, files) { // ใช้ตัวแปลงนี้ ถ้าเกิดส่งมาแบบผสม (ข้อมูล + ไฟล์ต่างๆ)
        console.log("Parsing Request COMPLETED...")
        if (err) {
            responseJSON.err = "ERROR in incomingForm.parse >>" + err
            console.log('ERROR: ' + err)
            res.status(200).json(responseJSON);
        } else {

            if (files) {
                if (files.coverImage) {
                    let oldpath1 = files.coverImage.path;
                    let fileExt1 = files.coverImage.name.split('.')[1];
                    let newfilename1 = randomstring.generate(12) + Date.now()
                    let newpath1 = newsPicFolder + "/" + newfilename1 + "." + fileExt1
                    let rawData = fs.readFileSync(oldpath1)
                    // console.log(files.researcherPicture)
                    fs.writeFile(newpath1, rawData, function (err) {
                        let obj = {
                            newFilePath: newpath1.replace(/\.\/public/i, config.saveImagePath)
                            // newFilePath: newpath1.replace(/\.\/public/i, `https://research.science.kmitl.ac.th/uploads`)
                        }
                        console.log(oldpath1)
                        console.log(newpath1)
                        Return.responseWithCodeAndData(ReturnCode.success, "New file is saved successfully", obj, response);
                    });

                    // fs.rename(oldpath1, newpath1, function (err) {
                    //     let obj = {
                    //         newFilePath: newpath1.replace(/\.\/public/i,`https://research.science.kmitl.ac.th/uploads`)
                    //     }
                    //     console.log(oldpath1)
                    //     console.log(newpath1)
                    //     Return.responseWithCodeAndData(ReturnCode.success, "New file is saved successfully", obj, response);
                    // });
                }
                else {
                    Return.responseWithCodeAndData(ReturnCode.success, "No file is sent", null, response);
                }
            }
        }
    });
});

module.exports = router;