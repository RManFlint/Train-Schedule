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
var frequency = " ";
var arrival = " ";
var minutesAway = " ";
var remainderTime = " ";
var diffTime = " ";
var storeTrainData;
var superData=[];
//every time i add a new train i want to update minutesaway and arrival 
$("#submit").on("click", function(event) {
    event.preventDefault();
    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    frequency = $("#frequency").val();    

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
    //superData.push(storeTrainData);
    //console.log("superData length is " + superData.length);
    updateTable();
    
    console.log(typeof arrival);
    
    database.ref().push(storeTrainData);

    var TrainDataRow = $("<tr>");
})
function updateTable(){
  database.ref().on("value", function(snapshot){
    superData=snapshot.val();
    console.log(superData);
  });

  for (var i=0; i <superData.length; i++)
  {
    diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    remainderTime = diffTime % frequency;
  minutesAway = frequency - remainderTime;
  var nextTrain = moment().add(minutesAway, "minutes");
  arrival = moment(nextTrain).format("hh:mm");
    superData[i].storeMinutesAway = superData[i].storeFrequency - remainderTime;
    console.log("superData[i].storeMinutesAway is " + superData[i].storeMinutesAway);
    superData[i].storeArrival = moment().add(superData[i].storeMinutesAway, "minutes").format("hh:mm");
  }
}

database.ref().on("child_added", function(snapshot){

  var empRow = $("<tr>")
  var trainNameCell = $("<td>").text(snapshot.val().storeTrainName)
  var destinationCell = $("<td>").text(snapshot.val().storeDestination)
  //var firstTrainCell = $("<td>").text(snapshot.val().storeFirstTrain)
  var arrivalCell = $("<td>").text(snapshot.val().storeArrival)
  var frequencyCell = $("<td>").text(snapshot.val().storeFrequency)
  var storeMinutesAwayCell = $("<td>").text(snapshot.val().storeMinutesAway);

  empRow.append(trainNameCell, destinationCell, frequencyCell, arrivalCell, storeMinutesAwayCell);
  $(".table tbody").append(empRow);
});

  updateTable();

