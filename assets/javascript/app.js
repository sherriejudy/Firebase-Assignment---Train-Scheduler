$(document).ready(function() {
  //authenticate firebase
  var config = {
    apiKey: "AIzaSyBi0XJcieqIYQAFCDdDhqKjgW_wZHDdnyA",
    authDomain: "train-project-1c071.firebaseapp.com",
    databaseURL: "https://train-project-1c071.firebaseio.com",
    projectId: "train-project-1c071",
    storageBucket: "train-project-1c071.appspot.com",
    messagingSenderId: "692887489747"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  //onclick for submitting a train schedule
  $("#submit").on("click", function() {
    event.preventDefault(); // stop refresh
    var name = $("#name").val();
    var dest = $("#dest").val();
    var time = $("#time").val();
    var freq = $("#freq").val();
    var obj = {
      trainName: name,
      trainDest: dest,
      trainTime: time,
      trainFreq: freq
    };
    database.ref().push(obj);
  });
  //grab info from firebase according to what was submitted
  database.ref().on("child_added", function(childSnapshot) {
    // console.log(childSnapshot.val());
    var trainFreq = childSnapshot.val().trainFreq;
    var trainTime = childSnapshot.val().trainTime;
    var tRow = $("<tr>");

    var nextTrain = generateTime(trainFreq, trainTime);
    var nextTrainMilitary = nextTrain.format("hh:mm A");
    var minutesLeft = nextTrain.diff(moment(), "minutes");

    var nameTd = $("<td>").text(childSnapshot.val().trainName);
    var destTd = $("<td>").text(childSnapshot.val().trainDest);
    var nextTrainMilitaryTd = $("<td>").text(nextTrainMilitary);
    var freqTd = $("<td>").text(trainFreq);
    var minutesLeftTd = $("<td>").text(minutesLeft);
    //time

    //display firebase info on html - table
    tRow.append(nameTd, destTd, freqTd, nextTrainMilitaryTd, minutesLeftTd);
    $("tbody").append(tRow);
  });

  function generateTime(tFrequency, firstTime) {
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % tFrequency;
    var tMinutesTillTrain = tFrequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    return nextTrain;
  }
});
//css or bootstrap
