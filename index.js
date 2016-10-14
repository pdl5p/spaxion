var spauth = require('node-sp-auth');
var request = require('request-promise');
var Cpass = require('cpass');

var dec = new Cpass();

  var url = "https://[site].sharepoint.com";
  var creds = {
    username: "username",
    password: dec.decode("[cpass encoded password]") 
};

spauth.getAuth(url, creds)
    .then((options) => {

        var headers = options.headers;
        headers['Accept'] = 'application/json;odata=verbose';
        headers['Content-Type'] = 'application/json;odata=verbose';

        request.post({
          url: url + '/_api/contextinfo',
          headers: headers
        })
        .then(
            (response) => {
                var digest = JSON.parse(response).d.GetContextWebInformation.FormDigestValue;

                headers["X-RequestDigest"] = digest;

                var data = { __metadata: { type: 'SP.UserCustomAction' }, 
                            Location:'Microsoft.SharePoint.StandardMenu',
                            Group:'SiteActions', 
                            Sequence:'101', 
                            Title:'Do stuff',
                            Description:'Opens the Shared Documents page', 
                            Url:'~site/Shared%20Documents/Forms/AllItems.aspx' };

                return request.get({
                    url: url + '/_api/web/UserCustomActions',
                    headers: headers,
                   //body: data,
                    //json: true
                })
            }
        )
        .then((response) => {

            console.log(response);

        })
        .catch((error) => {

            console.log("CATCH");
            console.log(error);

        });
    });