var mlb = require('mlb');

function getGames(callback) {
  mlb.games.get(function(err, res) {
    callback(res);
  });
}
function getScore(team, callback) {
  getGames(function(res){
    var found = false;
    for (var i in res) {
      var gameId = i;
      var game = res[i];
      var homeTeam = game.home.toLowerCase();
      var awayTeam = game.away.toLowerCase();
      if (team.toLowerCase() === homeTeam || team.toLowerCase() === awayTeam) {
        found = true;
        var gameStatus =  res[gameId].status;
        var gameTime = res[gameId].time;
        var gameFound = mlb.games.url(gameId);
        mlb.score(gameFound, function(err, result){
          if (result) {
            var teams = [];
            var scores = []
            for (var team in result) {
              teams.push(team);
              scores.push(result[team]);
            }
            var firstScore = parseInt(scores[0]);
            var secondScore = parseInt(scores[1]);
            if (gameStatus == 'Final') {
              if (firstScore > secondScore) {
                callback('The ' + teams[0] + ' beat the ' + teams[1] + ' ' + firstScore + ' to ' + secondScore);
              } else if (secondScore > firstScore) {
                callback('The ' + teams[1] + ' beat the ' + teams[0] + ' ' + secondScore + ' to ' + firstScore);
              } else {
                callback('The ' + teams[0] + ' are currently tied with the ' + teams[1] + ' ' + firstScore + ' to ' + secondScore);
              }
            } else {
              if (firstScore > secondScore) {
                callback('The ' + teams[0] + ' are currently leading the ' + teams[1] + ' ' + firstScore + ' to ' + secondScore);
              } else if (secondScore > firstScore) {
                callback('The ' + teams[1] + ' are currently leading the ' + teams[0] + ' ' + secondScore + ' to ' + firstScore);
              } else {
                callback('The ' + teams[0] + ' are currently tied with the ' + teams[1] + ' ' + firstScore + ' to ' + secondScore);
              }
            }
          } else {
            callback('The game will start at ' + gameTime);
          }
        });
        return;
      }
    }
    if (!found) callback("I can't seem to find a game for the " + team + " today");
  });
}
getScore('mariners', function(data){
  console.log(data);
})
exports.getScores = getScore;
