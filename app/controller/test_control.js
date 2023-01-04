var Researcher = require('../model/researcher_model.js');
var nodemailer = require('nodemailer');
var GSuiteMailer = require('../service/mailer.js');

//var pic = require('../files/a.jpg');

// var Position_Control = require("./position_control.js");
// var Division_Control = require("./division_control.js");
// var Department_Control = require("./department_control.js");

var ObjectId = require('mongodb').ObjectId;
var config = require('../../config/config.js');
var flow = require('../service/flow.js')

module.exports = {
  getThesisByResearcherId: function (researcherId, callback) {
    let query = { _id: researcherId }

    let projection = { researcherPicture: true, researcherName_TH: true, researcherName_EN: true, thesis: true }

    Researcher.find(query, projection, function (error, researcherResponse) {
      if (error) {
        var alert = "[func. getThesisByResearcherId] Error: " + error.message;
        callback("171", alert, null)
      } else {
        callback("172", null, researcherResponse)
      }
    });
  },
  getResearcher: function (callback) {
    let query = {};

    let projection = {
    };

    Researcher.find(query, projection, function (error, researcherResponse) {
      if (error) {
        var alert =
          "[func. getAllResearcher] Error in finding Researcher Error: " +
          error.message;
        callback("171", alert, null);
      } else {
        callback("172", null, researcherResponse);
      }
    });
  },
  randomTargetIndustry: function (targetIndustryData, callback) {
    let target = ["Future Mobility",
      "Intelligent Electronics",
      "Advance Agriculture and Biotechnology",
      "Food For The Future",
      "Industrial Robotics",
      "Aviation and Logistics",
      "Bio-based Energy & Chemicals",
      "Digital Industry",
      "Medical Hub",
      "National Defense Industry",
      "Circular Economy"
    ]
    targetIndustryData.forEach((item, index) => {
      let selectRandom = [target[Math.floor(Math.random() * target.length)], target[Math.floor(Math.random() * target.length)]]
      Researcher.findOneAndUpdate(
        { '_id': new ObjectId(item._id) },
        {
          '$set': {
            'targetIndustryArray': selectRandom,
          }
        },
        function (err, updateResponse) {
          if (err) {
            var alert = "[func. getPinnedHighlightForResearcherIdByAdmin] Error: " + err.message;
            callback("171", alert, null)
          } else {
            if (targetIndustryData.length - 1 === index) {
              callback("172", null, null)
            }
          }
        })
    })
  },
  resetField: function (callback) {
    let query = {};

    let projection = {
      '$set': {
        'publication': [],
        'reward': [],
        'intProp': [],
        'researchFund': [],
        'collaboration': [],
        'highlight': [],
      }
    };

    Researcher.updateMany(query, projection, function (error, researcherResponse) {
      if (error) {
        var alert =
          "[func. getAllResearcher] Error in finding Researcher Error: " +
          error.message;
        callback("171", alert, null);
      } else {
        callback("172", null, researcherResponse);
      }
    });
  },
  unset: function (callback) {
    let query = {};

    let projection = {
      '$unset': {
        'instructor': "",
        'thesis': "",
        'develop': "",
        'citizenId': "",
        'course': "",
        'insignia': "",
        'birthDate': "",
        'birthDateText': "",
        'assignDate': "",
        'assignDateText': "",
        'retiredDate': "",
        'retiredDateText': "",
      }
    };

    Researcher.updateMany(query, projection, function (error, researcherResponse) {
      if (error) {
        var alert =
          "[func. getAllResearcher] Error in finding Researcher Error: " +
          error.message;
        callback("171", alert, null);
      } else {
        callback("172", null, researcherResponse);
      }
    });
  },
  unsetNested: function (callback) {
    let query = {};

    let projection = {
      '$unset': {
        "publication.$[].conferenceLocation": "",
        "publication.$[].conferenceStartDate": "",
        "publication.$[].conferenceFinishDate": "",
        "publication.$[].conferenceDurationText": "",
        "publication.$[].bookPublisher": "",
        "publication.$[].bookPublishingLocation": "",
        "publication.$[].year_buddhist": "",
        "publication.$[].impactFactor": "",
        "publication.$[].quartile_sjr": "",
        "publication.$[].quartile_webOfScience": "",
        "publication.$[].weight": "",
        "publication.$[].remark": "",
        "publication.$[].studentId": "",

        "intProp.$[].coInventor": "",
        "intProp.$[].applyDate": "",
        "intProp.$[].applyDateText": "",
        "intProp.$[].grantedDate": "",
        "intProp.$[].grantedDateText": "",
        "intProp.$[].applicant": "",

        "reward.$[].organizer": "",
        "reward.$[].location": "",
        "reward.$[].recieveDate": "",
        "reward.$[].recieveDateText": "",
        "reward.$[].student": "",

        "researchFund.$[].startDate": "",
        "researchFund.$[].finishDate": "",
        "researchFund.$[].remark": "",
        "researchFund.$[].ratio": "",
        "researchFund.$[].fundName": "",
        "researchFund.$[].fundSource": "",
        "researchFund.$[].year_buddhist": "",
        "researchFund.$[].durationText": "",
        "researchFund.$[].progress_6mDate": "",
        "researchFund.$[].progress_6mText": "",
        "researchFund.$[].progress_6m": "",
        "researchFund.$[].progress_12mDate": "",
        "researchFund.$[].progress_12mText": "",
        "researchFund.$[].progress_12m": "",
        "researchFund.$[].extension": "",
        "researchFund.$[].extension_Text": "",
        "researchFund.$[].completeSubmission": "",
        "researchFund.$[].completeSubmissionText": "",
        "researchFund.$[].result": "",
        "researchFund.$[].projectClose": "",
        "researchFund.$[].projectCloseText": "",
        "researchFund.$[].yearExtension": "",
        "researchFund.$[].yearContinuous": "",
        "researchFund.$[].supportFund": "",
      }
    };

    Researcher.updateMany(query, projection, function (error, researcherResponse) {
      if (error) {
        var alert =
          "[func. unsetField] Error in finding Researcher Error: " +
          error.message;
        callback("171", alert, null);
      } else {
        callback("172", null, researcherResponse);
      }
    });
  },
  getTargetIndustry: function (callback) {
    let query = {};

    let projection = {
      _id: true,
      targetIndustry_EN: true,
    };

    Researcher.find(query, projection, function (error, researcherResponse) {
      if (error) {
        var alert =
          "[func. getAllResearcher] Error in finding Researcher Error: " +
          error.message;
        callback("171", alert, null);
      } else {
        console.log(researcherResponse)
        callback("172", null, researcherResponse);
      }
    });
  },
  updateTargetIndustryArray: function (targetIndustryData, callback) {
    targetIndustryData.forEach((item, index) => {
      if (item.targetIndustry_EN !== null) {
        Researcher.findOneAndUpdate(
          { '_id': new ObjectId(item._id) },
          {
            '$push': {
              'targetIndustryArray': item.targetIndustry_EN,
            }
          },
          function (err, updateResponse) {
            if (err) {
              var alert = "[func. getPinnedHighlightForResearcherIdByAdmin] Error: " + err.message;
              callback("171", alert, null)
            } else {
              if (targetIndustryData.length - 1 === index) {
                callback("172", null, null)
              }
            }
          })
      } else {
        Researcher.findOneAndUpdate(
          { '_id': new ObjectId(item._id) },
          {
            '$push': {
              'targetIndustryArray': '',
            }
          },
          function (err, updateResponse) {
            if (err) {
              var alert = "[func. getPinnedHighlightForResearcherIdByAdmin] Error: " + err.message;
              callback("171", alert, null)
            } else {
              if (targetIndustryData.length - 1 === index) {
                callback("172", null, null)
              }
            }
          })
      }

    })
  },
  getEducation: function (callback) {
    let query = {};

    let projection = {
      _id: true,
      doctorDegree: true,
      bachelorDegree: true,
      masterDegree: true,
    };

    Researcher.find(query, projection, function (error, researcherResponse) {
      if (error) {
        var alert =
          "[func. getAllResearcher] Error in finding Researcher Error: " +
          error.message;
        callback("171", alert, null);
      } else {
        console.log(researcherResponse)
        callback("172", null, researcherResponse);
      }
    });
  },
  updateEducationArray: function (educationData, callback) {
    educationData.forEach((item, index) => {
      Researcher.findOneAndUpdate(
        { '_id': new ObjectId(item._id) },
        {
          '$push': {
            'bachelorDegreeArray': item.bachelorDegree,
            'masterDegreeArray': item.masterDegree,
            'doctorDegreeArray': item.doctorDegree
          }
        },
        function (err, updateResponse) {
          if (err) {
            var alert = "[func. getPinnedHighlightForResearcherIdByAdmin] Error: " + err.message;
            callback("171", alert, null)
          } else {
            if (educationData.length - 1 === index) {
              callback("172", null, null)
            }
          }
        })
    })
  },
  unSetTargetField: function (educationData, callback) {
    educationData.forEach((item, index) => {
      Researcher.findOneAndUpdate(
        { '_id': new ObjectId(item._id) },
        {
          '$unset': {
            'targetIndustryArray': true,
          }
        },
        function (err, updateResponse) {
          if (err) {
            var alert = "[func. getPinnedHighlightForResearcherIdByAdmin] Error: " + err.message;
            callback("171", alert, null)
          } else {
            if (educationData.length - 1 === index) {
              callback("172", null, null)
            }
          }
        })
    })
  },
  getAllPublication: async function (callback) {
    let query = [
      { $unwind: "$publication" },
      { $project: { "_id": true, "researcherName_TH": true, "researcherName_EN": true, "publication": true } },
    ]

    Researcher.aggregate(query, function (error, researcherResponse) {
      if (error) {
        var alert = "[func. getAllPublication] Error: " + error.message;
        callback("171", alert, null)
      } else {
        callback("172", null, researcherResponse)
      }
    });
  },
  convertPublicationType: function (data, callback) {
    data.forEach((item, index) => {
      let wantedType = ['วารสารฯ ระดับนานาชาติ',
        'วารสารฯ ระดับชาติ',
      ]
      if (wantedType.includes(item.publication.publicationLevel)) {
        // console.log(item.publication.publicationLevel, "is ", wantedType.includes(item.publication.publicationLevel))
        let selectedPreviousDbType = ["TCI1", "TCI2", "TCI3"]
        let convertDbTypeTo = 'TCI'
        if (selectedPreviousDbType.includes(item.publication.databaseType)) {
          let query = { 'publication._id': new ObjectId(item.publication._id) }
          let project = {
            '$set': {
              'publication.$.databaseType': convertDbTypeTo,
            },
          }
          Researcher.findOneAndUpdate(query, project,
            function (err, updateResponse) {
              if (err) {
                var alert = "[func. update Pub Fail] Error: " + err.message;
                callback("171", alert, null)
              }
            })
        }
      } else {
        // console.log(item.publication.publicationLevel, "is ", wantedType.includes(item.publication.publicationLevel))
        let query = { '_id': new ObjectId(item._id) }
        let project = { $pull: { 'publication': { '_id': item.publication._id } } }
        Researcher.update(query, project,
          function (err, updateResponse) {
            if (err) {
              var alert = "[func. delete Pub Fail] Error: " + err.message;
              callback("171", alert, null)
            }
          })
      }

      if (data.length - 1 === index) {
        callback("172", null, null)
      }
    })
  },
  getFieldData: function (callback) {
    let query = {
    };
    let projection = {
      _id: 1,
      bachelorDegreeArray: 1,
      doctorDegreeArray: 1,
      masterDegreeArray: 1,
    };
    Researcher.find(query, projection, function (error, researcherResponse) {
      if (error) {
        var alert =
          "[func. getAllResearcher] Error in finding Researcher Error: " +
          error.message;
        callback("171", alert, null);
      } else {
        callback("172", null, researcherResponse);
      }
    });
  },
  setTargetField: function (data, callback) {
    data.forEach((item, index) => {
      if (item.bachelorDegreeArray.length > 0) {
        item.bachelorDegreeArray.forEach(degree => {
          Researcher.findOneAndUpdate(
            { 'bachelorDegreeArray._id': new ObjectId(degree._id) },
            {
              '$unset': {
                'bachelorDegreeArray.$.isConsent': "",
                // 'doctorDegreeArray.$.isConsent': true,
                // 'masterDegreeArray.$.isConsent': true,
              }
              // '$set': {
              // 'bachelorDegreeArray.$.isVisible': true,
              // 'doctorDegreeArray.$.isVisible': true,
              //  'masterDegreeArray.$.isVisible': true,
              // },

            },
            function (err, updateResponse) {
              if (err) {
                var alert = "[func. getPinnedHighlightForResearcherIdByAdmin] Error: " + err.message;
                callback("171", alert, null)
              }
            })
        })
      }
      if (data.length - 1 === index) {
        callback("172", null, null)
      }
    })
  },
};

//----------------