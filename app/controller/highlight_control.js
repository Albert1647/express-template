var Return = require("../service/return.js");
var ReturnCode = require('../model/returnCode.js');
var Researcher = require('../model/researcher_model.js');


module.exports = {
  getAllHighlight: async function (pageNum, pageSize, callback) {
    let needSkip = (pageNum - 1) * pageSize;
    let query = [
      { $unwind: "$highlight" },
      { $match: { $and: [{ "highlight.isVisible": true }, { "highlight.show": true }] } },
      { $project: { "_id": true, "researcherName_TH": true, "researcherName_EN": true, "highlight": true } },
      { $sort: { 'highlight.createdAt': -1 } },
    ]

    Researcher.aggregate(query, function (error, highlightResponse) {
      if (error) {
        var alert = "[func. getRewardForResearcherIdByAdmin] Error: " + error.message;
        callback("171", alert, null)
      } else {
        let returnObj = {};
        returnObj.pageSize = pageSize;
        returnObj.currentPage = pageNum;
        returnObj.maxPage = Math.ceil(highlightResponse.length / pageSize);
        returnObj.maxItemCount = highlightResponse.length;
        let pageNumLimit = ((pageSize * pageNum) - 1) < highlightResponse.length ? pageSize * pageNum : highlightResponse.length
        returnObj.dataInPage = highlightResponse.slice(needSkip, pageNumLimit);
        callback("172", null, returnObj)
      }
    });
  },
  getHighlight: async function (researcherId, callback) {
    let query = { '_id': researcherId, 'show': true }
    let projection = { researcherName_EN: true, researcherName_TH: true, highlight: true }

    Researcher.find(query, projection, function (error, researcherResponse) {
      if (error) {
        var alert = "[func. getHighlightByResearcherId] Error: " + error.message;
        callback("171", alert, null)
      } else if (researcherResponse.length > 0) {
        // show newest highlight
        researcherResponse[0].highlight = researcherResponse[0].highlight.filter(hl => hl.show && hl.isVisible)
        researcherResponse[0].highlight.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt)
        })
        callback("172", null, researcherResponse)
      }
      else {
        var alert = "[func. getRewardByResearcherId] Error: length 0";
        callback("171", alert, null)
      }
    });
  },
  getHighlightById: function (highlightId, callback) {
    let query = [{ $unwind: "$highlight" }, {
      $match: {
        $and: [{ "highlight._id": highlightId }
          , { "highlight.show": true }
          , { "highlight.isVisible": true }]
      }
    }, {
      $project: {
        "_id": true
        , "researcherName_TH": true
        , "researcherName_EN": true
        , "highlight": true
      }
    }, { $sort: { 'highlight.createdAt': 1 } }]

    Researcher.aggregate(query, function (error, researcherResponse) {
      if (error) {
        var alert = "[func. getRewardForResearcherIdByAdmin] Error: " + error.message;
        callback("171", alert, null)
      } else {
        callback("172", null, researcherResponse[0])
      }
    });
  },
  getHighlightByIdByAdmin: function (highlightId, callback) {
    let query = [{ $unwind: "$highlight" }, { $match: { $and: [{ "highlight._id": highlightId }] } }
      , { $project: { "_id": true, "researcherName_TH": true, "researcherName_EN": true, "highlight": true } }]

    Researcher.aggregate(query, function (error, researcherResponse) {
      if (error) {
        var alert = "[func. getRewardForResearcherIdByAdmin] Error: " + error.message;
        callback("171", alert, null)
      } else {
        callback("172", null, researcherResponse[0])
      }
    });
  },
  // by id and general 
  getHighlightByAdmin: function (researcherId, callback) {
    let projection = {
      _id: true, researcherName_TH: true, researcherName_EN: true,
      'highlight._id': true, 'highlight.show': true,
      'highlight.title': true, 'highlight.authorName': true, 'highlight.createdAt': true,
      'highlight.updatedAt': true,
    }

    if (researcherId == null) {
      let query = { show: true }
      Researcher.find(query, projection, function (error, researcherResponse) {
        if (error) {
          var alert = "[func. getCollaborationByAdmin] Error: " + error.message;
          callback("171", alert, null)
        } else {
          researcherResponse.forEach((eachResearcher, index) => {
            if (!eachResearcher.highlight) return
            researcherResponse[index].highlight = eachResearcher.highlight.filter(eachPublication => eachPublication.show == true)
          });
          callback("172", null, researcherResponse)
        }
      });
    }
    else {
      let query = { _id: researcherId, show: true }
      Researcher.find(query, projection, function (error, researcherResponse) {
        if (error) {
          var alert = "[func. getCollaborationByAdmin] Error: " + error.message;
          callback("171", alert, null)
        } else {
          researcherResponse.forEach((eachResearcher, index) => {
            if (!eachResearcher.highlight) return
            researcherResponse[index].highlight = eachResearcher.highlight.filter(eachPublication => eachPublication.show == true)
          });
          callback("172", null, researcherResponse)
        }
      });
    }

  },
  getPinnedHighlight: function (callback) {
    let query = [{ $unwind: "$highlight" }, { $match: { $and: [{ "highlight.isPinned": true }, { "highlight.show": true }, { "highlight.isVisible": true }] } }
      , { $project: { "_id": true, "researcherName_TH": true, "researcherName_EN": true, "highlight": true } }]

    Researcher.aggregate(query, function (error, researcherResponse) {
      if (error) {
        var alert = "[func. getPinnedHighlightForResearcherIdByAdmin] Error: " + error.message;
        callback("171", alert, null)
      } else {
        console.log(researcherResponse)
        callback("172", null, researcherResponse)
      }
    });
  },
  unpinHighlight: async function (callback) {
    Researcher.updateMany(
      { 'highlight.isPinned': true },
      { '$set': { 'highlight.$.isPinned': false } },
      function (error, researcherResponse) {
        if (error) {
          var alert = "[func. getPinnedHighlightForResearcherIdByAdmin] Error: " + error.message;
          callback("171", alert, null)
        } else {
          console.log("unpin", researcherResponse)
          callback("172", null, researcherResponse[0])
        }
      })
  },
  pinHighlight: async function (pinIdArray, callback) {
    pinIdArray.forEach((highlightId, index) => {
      Researcher.updateOne(
        { 'highlight._id': highlightId },
        { '$set': { 'highlight.$.isPinned': true } },
        function (error, researcherResponse) {
          if (error) {
            var alert = "[func. getPinnedHighlightForResearcherIdByAdmin] Error: " + error.message;
            callback("171", alert, null)
          } else {
            console.log("pin", researcherResponse)
            if (pinIdArray.length - 1 === index) {
              callback("172", null, pinIdArray)
            }
          }
        })
    })

  },
}