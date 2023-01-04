var GSuiteMailer = require('../service/mailer.js');

module.exports = {
  sendEmail: function (req, callback) {
    {
      let path = 'https://research.science.kmitl.ac.th/uploads/file/image/logo.png'
      let to = '62050155@gmail.com'
      let from = 'wittech.development@gmail.com' // doesn't matter / depend on GCP and secret
      let subject = req.title
      let content =
        `<!DOCTYPE html>
      <html lang="th">
        <head>
          <meta charset="utf-8" />
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              font-family: sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI",
                "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
                "Helvetica Neue", sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              width: 100%;
              height: auto;
              overflow-x: hidden;
            }
            div.container {
              width: 100%;
              max-width: 1024px;
              margin: 0 auto;
            }
            img.header {
              width: 700px;
              padding: 1em 2em 2em;
            }
            div.content {
              padding: 3em 2em;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img class="header" src="${path}" />
            <div class="content">
              <h4 style="font-size: 24px">
                To Web Master,
              </h4>
              <p style="font-size: 18px">
              ${req.detail}
              </p>
              <p style="font-size: 18px">
                Contact: ${req.tel}
              </p>
              <p style="font-size: 18px">Best Regards.</p>
              <p style="font-size: 18px">${req.email}</p>
            </div>
          </div>
        </body>
      </html>
      `
      GSuiteMailer.sendingMailViaGSuite(to, from, subject, content, function () {
        callback("172", null, null)
      })
    }
  },
};


//----------------