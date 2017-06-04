// Update twitchUsers array with all Twitch usernames you want included in the JSON and web app.
var twitchUsers = ["ESL_SC2", "brunofin", "comster404", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
var usersObj = {};

$(document).ready(function() {
  populateObj();
  console.log(usersObj);
});

/* Free Code Camp Twitch API pass-through to not utilize/publish API key
 * Use base url: https://wind-bow.gomix.me/twitch-api in API calls
 * Server only accepts GET requests and only routes /users/:user, /channels/:channel, and /streams/:stream
*/

function populateObj() {
  for (var i = 0; i < twitchUsers.length; i++) {
    let currentUser = twitchUsers[i];
    $.get("http://wind-bow.glitch.me/twitch-api/streams/" + twitchUsers[i], function(data) {
      usersObj[currentUser] = {};
      if (data.stream == null) {
        usersObj[currentUser].online = false;
      } else if (data.stream.hasOwnProperty("_id")) { //Tests if the user is streaming
        usersObj[currentUser].online = true;
        usersObj[currentUser].game = data.stream.game;
      }
      $.get("http://wind-bow.glitch.me/twitch-api/users/" + currentUser, function(data) {
        usersObj[currentUser].logo = data.logo;
        if (data.hasOwnProperty("status")) {
          /* Checks if account does not exist or is "unavailable" and stores infornation into game
          property. User will dispaly as being offline and the text stating the account does not exist
          or us unavailable will display under the user name where game information is displayed. */
          switch (data.status) {
            case 422:
              usersObj[currentUser].game = "Account is unavailable"
              break;
            case 404:
              usersObj[currentUser].game = "Account does not exist"
              break;
          }
        }
      });
    });
  }
}
