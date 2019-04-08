// Initialize Firebase
var config = {
  apiKey: "AIzaSyBJw0FfHDoGlTZMyiBw8XPly6fu0Om8-k8",
  authDomain: "revised-train-schedule.firebaseapp.com",
  databaseURL: "https://revised-train-schedule.firebaseio.com",
  projectId: "revised-train-schedule",
  storageBucket: "revised-train-schedule.appspot.com",
  messagingSenderId: "1071985640508"
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
var storeTrainData = [];
var superData=[];

$("#submit").on("click", function(event) {
    event.preventDefault();
    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    //firstTrain = $("#firstTrain").val().trim();
    frequency = $("#frequency").val().trim();
    //arrival = $("#arrival").val().trim();
    //minutesAway = $("#minutesAway").val().trim();
    var diffTime = " ";
    var remainderTime = " ";

    function arrival(){
      diffTime = moment().diff(moment(firstTrainConverted), "minutes");
      console.log("diffTime is " + diffTime);
      remainderTime = diffTime % frequency;
      minutesAway = frequency - remainderTime;
      var nextTrain = moment().add(minutesAway, "minutes");
      arrival = moment(nextTrain).format("hh:mm")
    }
    arrival();

    storeTrainData = {
      storeTrainName: trainName,
      storeDestination: destination,
      storeFirstTrain: firstTrain,
      storeFrequency: frequency,
      storeArrival: arrival,
      storeMinutesAway: minutesAway
      //dateAdded: firebase.database.ServerValue.TIMESTAMP
    }
    console.log("storeTrainData for arrival is " + storeTrainData[4]);
    //Store the data for each storeTrainData array in superData array, so table
    //can be populated.
    superData.push(storeTrainData);
    //console.log("The minutes away is " + storeTrainData.storeMinutesAway);
    for (var i=0; i <superData.length; i++)
      {
        superData[i].storeMinutesAway = superData[i].storeFrequency - remainderTime;
        superData[i].storeArrival = moment().add(superData[i].storeMinutesAway, "minutes");
      }

    database.ref().push(storeTrainData);
      console.log("After push, the database is " + database);

    var TrainDataRow = $("<tr>");
})

database.ref().on("child_added", function(snapshot){
  //console.log(snapshot.val())
  //console.log(snapshot.val().storeTrainName)
  //console.log(snapshot.val().storeDestination)
  //console.log(snapshot.val().storeFirstTrain)
  //console.log(snapshot.val().storeArrival)
  //console.log(snapshot.val().storeFrequency)
  //console.log(snapshot.val().storeMinutesAway)
   //console.log(snapshot.val().dateAdded)


  /*var convertedDate= moment.unix(snapshot.val().startDate);
  var monthsAgo = moment().diff(convertedDate, "months");
  var totalBilled = (monthsAgo*snapshot.val().monthlyRate);
  console.log(convertedDate)
  */
  
  var empRow = $("<tr>")
  var trainNameCell = $("<td>").text(snapshot.val().storeTrainName)
  var destinationCell = $("<td>").text(snapshot.val().storeDestination)
  //var firstTrainCell = $("<td>").text(snapshot.val().storeFirstTrain)
  var arrivalCell = $("<td>").text(snapshot.val().storeArrival)
  var frequencyCell = $("<td>").text(snapshot.val().storeFrequency)
  var storeMinutesAwayCell = $("<td>").text(snapshot.val().storeMinutesAway);

  empRow.append(trainNameCell, destinationCell, arrivalCell, frequencyCell, storeMinutesAwayCell);
  $(".table tbody").append(empRow);
});


