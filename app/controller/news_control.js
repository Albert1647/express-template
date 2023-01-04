var Return = require("../service/return.js");
var ReturnCode = require('../model/returnCode.js');
var News = require('../model/news_model.js');
var ObjectId = require('mongodb').ObjectId;

module.exports = {
  createNews: function (news, callback) {
    news.save(function (error, saveResponse) {
      if (error) {
        var alert =
          "[func. newResearcher] Error in saving Researcher Error: " +
          error.message;
        // Return.responseWithCode(ReturnCode.clientError, alert, res);
        return callback("171", alert, null)
      } else {
        // Return.responseWithCodeAndData(ReturnCode.success, 'Create News Success', saveResponse, res);
        return callback("171", null, saveResponse)
      }
    });
  },
  getNews: async function (pageNum, pageSize, callback) {
    let needSkip = (pageNum - 1) * pageSize;
    let query = { show: true }
    if (needSkip < 0) {
      let alert = `Something wrong with query... unable to gather data with required query`;
      callback("172", alert, null);
    } else {
      News.find(query).skip(needSkip).limit(pageSize).sort({ createdAt: -1 }).exec(function (err, newsResponse) {
        if (err) {
          var alert = "[func. getNews] Error: " + err.message;
          callback("171", alert, null)
        } else {
          newsResponse = newsResponse.filter(news => news.show)
          News.countDocuments(query, function (err, Response) {
            if (err) {
              var alert =
                "[func. getResearcherByKeyword] Error in finding News Error: " +
                err;
              callback("171", alert, null);
            } else {
              let returnObj = {};
              returnObj.pageSize = pageSize;
              returnObj.currentPage = pageNum;
              returnObj.maxPage = Math.ceil(Response / pageSize);
              returnObj.maxItemCount = Response;
              returnObj.dataInPage = newsResponse;
              callback("172", null, returnObj);
            }
          });
        }
      })
    }
  },
  getNewsForAdmin: async function (callback) {
    News.find().sort({ createdAt: -1 }).exec(function (err, data) {
      if (err) {
        var alert = "[func. getNews] Error: " + err.message;
        callback("171", alert, null)
      } else {
        data = data.filter(item => item.show)
        callback("171", null, data)
      }
    })
  },
  getNewsById: async function (newsId, callback) {
    News.find({ _id: ObjectId(newsId) },
      function (err, data) {
        if (err) {
          var alert = "[func. getNewsById] Error: " + err.message;
          callback("171", alert, null)
        } else {
          callback("171", null, data[0])
        }
      })
  },
  deleteNewsById: async function (newsId, callback) {
    News.findOneAndUpdate({ _id: newsId }, { '$set': { 'show': false } },
      function (err, data) {
        if (err) {
          var alert = "[func. deleteNewsById] Error: " + err.message;
          callback("171", alert, null)
        } else {
          callback("171", null, data)
        }
      })
  },
  editNews: async function (newsId, newsData, callback) {
    News.updateOne({ _id: new ObjectId(newsId) }, { $set: newsData },
      function (err, data) {
        if (err) {
          var alert = "[func. editNews] Error: " + err.message;
          callback("171", alert, null)
        } else {
          callback("171", null, data)
        }
      })
  },
  getPinnedNews: async function (callback) {
    News.find({ isPinned: true },
      function (err, data) {
        if (err) {
          var alert = "[func. getPinnedNews] Error: " + err.message;
          callback("171", alert, null)
        } else {
          callback("171", null, data)
        }
      })
  },
  unPinNews: function (callback) {
    News.updateMany({ isPinned: true }, { $set: { isPinned: false } },
      function (err, data) {
        if (err) {
          var alert = "[func. unPinNews] Error: " + err.message;
          callback("171", alert, null)
        } else {
          callback("171", null, null)
        }
      })
  },
  pinNews: function (idArray, callback) {
    News.updateMany({ _id: { $in: idArray } }, { $set: { isPinned: true } },
      function (err, data) {
        if (err) {
          var alert = "[func. pinNews] Error: " + err.message;
          callback("171", alert, null)
        } else {
          callback("171", null, data)
        }
      })
  },
}