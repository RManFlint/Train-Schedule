// Initialize Firebase
$(document).ready (function() {var config = {
  apiKey: "AIzaSyDi96aiWEoP64Y9_G2nj5o0fEZSDFmZ3SA",
  authDomain: "second-revision-train-schedule.firebaseapp.com",
  databaseURL: "https://second-revision-train-schedule.firebaseio.com",
  projectId: "second-revision-train-schedule",
  storageBucket: "",
  messagingSenderId: "702325528936"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainName= "";
var destination="";
var firstTrain = "00:01";
var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
var minutesAway = " ";
var superData = [];
var diffTime = " ";
var remainderTime = " ";

//every time i add a new train i want to update minutesaway and arrival 
$("#submit").on("click", function(event) {
    event.preventDefault();
    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    frequency = $("#frequency").val().trim();

    trainData = {
      storeTrainName: trainName,
      storeDestination: destination,
      storeFrequency: frequency
    }
    console.log("trainData is " + trainData);
    superData.push(trainData); 

    database.ref().push(trainData);
    

    console.log("superData is " + superData);
    var henry = superData.length-1;
    console.log("superData.length is " + superData.length);
    console.log("superData[henry] is " + superData[henry]);
    console.log("superData[henry].storeTrainName is " + superData[henry].storeTrainName);
    
    //console.log("superData[1].storeTrainName is " + superData[1].storeTrainName);

})

database.ref().on("child_added", function(snapshot){
  console.log(snapshot.val());
  $(".table tbody").html("");
  for (var i = 0; i< superData.length; i++){

  diffTime = moment().diff(moment(firstTrainConverted), "minutes");
  remainderTime = diffTime % superData[i].storeFrequency;
  minutesAway = superData[i].storeFrequency - remainderTime;
  var nextTrain = moment().add(minutesAway, "minutes");
  arrival = moment(nextTrain).format("hh:mm");

  var empRow = $("<tr>");
  var trainNameCell = $("<td>").text(superData[i].storeTrainName);
  var destinationCell = $("<td>").text(superData[i].storeDestination);
  var arrivalCell = $("<td>").text(arrival);
  
  var frequencyCell = $("<td>").text(superData[i].storeFrequency)
  var storeMinutesAwayCell = $("<td>").text(minutesAway);

  empRow.append(trainNameCell, destinationCell, frequencyCell, arrivalCell, storeMinutesAwayCell);
  $(".table tbody").append(empRow);
  }
});

database.ref().on("value", function(snapshot){
  console.log(snapshot.val());
})
})