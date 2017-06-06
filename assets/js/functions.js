// Update twitchUsers array with all Twitch usernames you want included in the JSON and web app.
var twitchUsers = ["ESL_SC2", "brunofin", "comster404", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
var usersObj = {};

$(document).ready(function() {
  populateObj();
  //toggleUsers();
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
      usersObj[currentUser].username = currentUser;
      if (data.stream == null) {
        usersObj[currentUser].online = "offline";
      } else if (data.stream.hasOwnProperty("_id")) { //Tests if the user is streaming
        usersObj[currentUser].online = "online";
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
  setTimeout(displayUsers, 500)
}

function displayUsers() { // Populates interface with the data stored in usersObj
  for (var user in usersObj) {
    let logo = logoVerify(usersObj[user].logo);
    let game = gameVerify(usersObj[user].game);
    let online = onlineStatus(usersObj[user].online);
    let link = accountLink(usersObj[user].game, usersObj[user].username);
    $('.twitch-viewer').append('<div class="twitch-user ' + usersObj[user].online + '">\
      <div class="twitch-avatar-container">\
        ' + logo + '\
        </div>\
      <div>\
        <p class="twitch-username">' + usersObj[user].username + '</p>\
        <p class="twitch-game">' + game + '</p>\
      </div>\
      <div class="icons">\
         ' + online + '\
        ' + link + '\
      </div>\
    </div>');
  }
}

function logoVerify(logoValue) {  // Verifies that logo does not contain null or undefined and returns HTML to populate twitch-user
  var image = "";
  if (logoValue == null || logoValue == undefined) {
    return image = '<img class="twitch-avatar img-placeholder" />';
  } else {
    return image = '<img class="twitch-avatar" src=' + logoValue + ' />'
  }
}

function gameVerify(gameValue) { // Removes undefined values to not display visually.
  var game = "";
  if (gameValue == undefined) {
    return game = "Offline";
  } else {
    return game = gameValue;
  }
}

function onlineStatus(onlineValue) { // Changes the color of the icon for each account based off their onlien status
  var online = "";
  if (onlineValue == "online") {
    return online = '<img src="/assets/img/online.png" class="online-icon" />'
  } else {
    return online = '<img src="/assets/img/offline.png" class="online-icon" />'
  }
}

function accountLink(game, username) { // Sets link of camera icon to account page after filtering out accounts which don't exist
  var link = "";
  if (game == "Account does not exist" || game == "Account is unavailable") {
    return link;
  } else {
    return link = '<a href="https://www.twitch.tv/' + username + '" target="_blank"><i class="fa fa-2x fa-video-camera"></i></a>';
  }
}


// When creating template generation apply extra class of online or offline to main div element to serve as toggle

function toggleUsers() {
  $('#all').on('click', function(e) {
    e.preventDefault();
    $('.online').css('display', 'block');
    $('.offline').css('display', 'block');
    $('#all').css('background-color', 'red');
  });
  $('#online').on('click', function(e) {
    e.preventDefault();
    $('.online').css('display', 'block');
    $('.offline').css('display', 'hidden');
    $('#offline').css('background-color', 'red');
  });
  $('#offline').on('click', function(e) {
    e.preventDefault();
    $('.online').css('display', 'hidden');
    $('.offline').css('display', 'block');
    $('#offline').css('background-color', 'red');
  });
}
