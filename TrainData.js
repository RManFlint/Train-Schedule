// Initialize Firebase
var config = {
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
//console.log("Firsttrain time is " + firstTrainConverted);
var frequency = " ";
var arrival = " ";
var minutesAway = " ";
var storeTrainData;
var superData=[];
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
      storeFrequency: frequency,
    };

    //superData.push(trainData);
    
    database.ref().push(trainData);
})

database.ref().on("child_added", function(snapshot){
  console.log(snapshot.val());
     
  diffTime = moment().diff(moment(firstTrainConverted), "minutes");
  remainderTime = diffTime % snapshot.val().storeFrequency;
  console.log("snapshot.val().storeFrequency is " + snapshot.val().storeFrequency);
  console.log("rmainderTime is " + remainderTime);
  minutesAway = snapshot.val().storeFrequency - remainderTime;
  console.log("MinutesAway is  " + minutesAway);
  var nextTrain = moment().add(minutesAway, "minutes");
  console.log("nextTrain is " + nextTrain);
  arrival = moment(nextTrain).format("hh:mm");
  console.log("arrival is " + arrival);

  var empRow = $("<tr>");
  var trainNameCell = $("<td>").text(snapshot.val().storeTrainName);
  var destinationCell = $("<td>").text(snapshot.val().storeDestination);
  var arrivalCell = $("<td>").text(arrival);
  
  console.log("next arrival is " + arrivalCell);
  var frequencyCell = $("<td>").text(snapshot.val().storeFrequency)
  var storeMinutesAwayCell = $("<td>").text(minutesAway);

  empRow.append(trainNameCell, destinationCell, frequencyCell, arrivalCell, storeMinutesAwayCell);
  $(".table tbody").append(empRow);
});


