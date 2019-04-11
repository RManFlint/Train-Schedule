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
console.log("Firsttrain time is " + firstTrainConverted);
var frequency = " ";
var arrival = " ";
var minutesAway = " ";
var storeTrainData;
var superData=[];
//every time i add a new train i want to update minutesaway and arrival 
$("#submit").on("click", function(event) {
    event.preventDefault();
    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    frequency = $("#frequency").val().trim();
    var diffTime = " ";
    var remainderTime = " ";

    function arrivalFunc(){
      diffTime = moment().diff(moment(firstTrainConverted), "minutes");
      remainderTime = diffTime % frequency;
      minutesAway = frequency - remainderTime;
      var nextTrain = moment().add(minutesAway, "minutes");
      arrival = moment(nextTrain).format("hh:mm");
    }
    arrivalFunc();
    
    storeTrainData = {
      storeTrainName: trainName,
      storeDestination: destination,
      storeFirstTrain: firstTrain,
      storeFrequency: frequency,
      storeArrival: arrival,
      storeMinutesAway: minutesAway
    }
    superData.push(storeTrainData);
    for (var i=0; i <superData.length; i++)
    {
      superData[i].storeMinutesAway = superData[i].storeFrequency - remainderTime;
      superData[i].storeArrival = moment().add(superData[i].storeMinutesAway, "minutes").format("hh:mm");
    }
    database.ref().push(storeTrainData);

    var TrainDataRow = $("<tr>");
})

database.ref().on("child_added", function(snapshot){
  console.log(snapshot.val());
  var diffTime2 = moment().diff(moment(firstTrainConverted), "minutes");
  
  var empRow = $("<tr>")
  var trainNameCell = $("<td>").text(snapshot.val().storeTrainName)
  var destinationCell = $("<td>").text(snapshot.val().storeDestination)
  var arrivalCell = $("<td>").text(snapshot.val().storeArrival)
  var frequencyCell = $("<td>").text(snapshot.val().storeFrequency)
  var storeMinutesAwayCell = $("<td>").text(snapshot.val().storeMinutesAway);

  empRow.append(trainNameCell, destinationCell, frequencyCell, arrivalCell, storeMinutesAwayCell);
  $(".table tbody").append(empRow);
});


