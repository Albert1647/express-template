var User = require('../model/user')
const bcrypt = require('bcryptjs')
const HttpError = require('../model/http-error')
const jwt2 = require("jsonwebtoken");
var config = require('../../config/config');
var ObjectId = require('mongodb').ObjectId;
var randomstring = require("randomstring");

const redis_client = require('../service/redis_connect');
module.exports = {
  checkUser: async function (req, res, next) {
    let allUser = await User.find({})
    res.send(allUser)
  },
  signInGoogle: async function (req, res, next) {
    let ticket = await googleClient.verifyIdToken({
      idToken: req.headers.token,
      audience: config.googleClientId
    })
    const payload = ticket.getPayload();
    let user = await User.findOne({ $and: [{ email: payload.email }, { isBlocked: false }] })
    if (!user) {
      return next(new HttpError(404, "user not found"))
    }

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)
    redis_client.setEx('refreshToken:' + refreshToken, config.refreshTokenExpiration, '')
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
  },
  getNewAccessToken: async function (req, res, next) {
    if (!req.body.token)
      return next(new HttpError(401, "Forbidden"))
    let value = await redis_client.get('refreshToken:' + req.body.token)
    if (value !== "") return next(new HttpError(401, "Forbidden"))
    jwt2.verify(req.body.token, config.refreshTokenSecret, (err, user) => {
      if (err) next(new HttpError(401, "Forbidden"))
      const accessToken = generateAccessToken(user.userId)
      res.json({ accessToken: accessToken })
    })
  },
  checkUserInfo: async function (req, res, next) {
    if (!req.headers.token) {
      next(new HttpError(422, "No token provided"))
    } else {
      let user = await decodeToken(req.headers.token, next)
      // if (!user) {
      //   next(new HttpError(422, "token is expired"))
      // }
      let researcher = null
      let userInfo = {}

      if (user.roles && user.roles.indexOf("researcher") != -1) {
        researcher = await Researcher.findOne({ _id: new ObjectId(user.researcherId) })
        if (researcher == null)
          next(new HttpError(422, "researcher's id not found"))
        else
          userInfo = {
            userId: user._id,
            researcherId: user.researcherId,
            email: researcher.email,
            name: researcher.researcherName_TH,
            roles: user.roles,
            avatar: researcher.researcherPicture,
            department: researcher.department
          }
      }
      else if (user.roles && user.roles.indexOf("staff") != -1) {
        user = await User.findOne({ _id: new ObjectId(user._id) })
        userInfo = {
          userId: user._id,
          email: user.email,
          name: user.firstname + " " + user.lastname,
          roles: user.roles,
          avatar: user.userPicture,
          department: user.department
        }
      }
      req.userInfo = userInfo
      // res.json(userInfo)
      next()
    }
  },
  createUser: function (req, callback) {
    let user = new User()
    let roles = ['staff']
    if (Array.isArray(req.body.roles))
      roles = req.body.roles
    let passwordTxt = randomstring.generate(12)
    if (req.body.fixPassword)
      passwordTxt = req.body.fixPassword
    bcrypt.genSalt(10).then((salt) => {
      let passwordString = passwordTxt
      bcrypt.hash(passwordString, salt).then((password) => {
        user.email = req.body.email
        user.password = password
        user.firstname = req.body.firstname
        user.lastname = req.body.lastname
        user.roles = roles
        User_Control.newUser(user, passwordString, function (code, err, data) {
          if (err) {
          } else {
          }
        })
      })
    })

  },
  decodeTokenAdmin: async function (token) {
    // const payload = jwt2.verify(token, config.accessTokenSecret)
    const user = jwt2.verify(token, config.accessTokenSecret, (err, payload) => {
      if (err) {
        return "token is expired"
      }
      let user = User.findById(payload.userId)
      if (!user) {
        return "user not found"
      }
      return user
    })
    return user
  },
};

function generateAccessToken(userId) {
  const payload = {
    userId: userId,
  }
  return jwt2.sign(payload, config.accessTokenSecret, { expiresIn: '2h' });
}
function generateRefreshToken(userId) {
  const payload = {
    userId: userId,
  }
  return jwt2.sign(payload, config.refreshTokenSecret);
}
async function decodeToken(token, next) {
  const user = jwt2.verify(token, config.accessTokenSecret, (err, payload) => {
    if (err) {
      return next(new HttpError(403, "token is expired"))
    }
    let user = User.findById(payload.userId)
    if (!user) {
      return next(new HttpError(404, "user not found"))
    }
    return user
  })
  return user
}