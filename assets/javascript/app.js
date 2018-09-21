// Initialize Firebase
var config = {
  apiKey: "AIzaSyAa5pbZRXO4xVCnn4-eoHVkFF6369bRQXI",
  authDomain: "trainscheduler-78dbc.firebaseapp.com",
  databaseURL: "https://trainscheduler-78dbc.firebaseio.com",
  projectId: "trainscheduler-78dbc",
  storageBucket: "trainscheduler-78dbc.appspot.com",
  messagingSenderId: "923868110721"
};
firebase.initializeApp(config);
  
var database = firebase.database();

$("#submitbtn").on("click", function(event) {
  event.preventDefault();

  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var firstTime =  $("#firstTime").val().trim();
  var frequency = $("#frequency").val().trim();
  
  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTime: firstTime,
    frequency: frequency,
  };

  database.ref().push(newTrain);

  console.log(newTrain.trainName);
  console.log(newTrain.destination);
  console.log(newTrain.firstTime);
  console.log(newTrain.frequency);

  alert("Train successfully added");
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTime").val("");
  $("#frequency").val("");
});

database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTime = childSnapshot.val().firstTime;
  var frequency = childSnapshot.val().frequency;

  var firstTrainTime = moment(firstTime, "HH:mm").subtract(1, "years");  
  console.log("TIME CONVERTED: " + firstTrainTime);
    
  var diffTime = moment.duration(moment().diff(moment(firstTime, "HH:mm")), 'milliseconds').asMinutes();  
    
  console.log("DIFFERENCE IN TIME: " + diffTime);

  var timeRemaining = frequency - (Math.floor(diffTime) % frequency); 
  console.log("TIME REMAINING: " + timeRemaining);

  var nextArrival = diffTime > 0 ? moment().add(timeRemaining, 'minutes' ) : moment(firstTime, "HH:mm") ; 
  console.log("ARRIVAL TIME: " + moment(nextArrival).format("HH:mm"));
  
  var timearrive = moment(nextArrival).format("HH:mm");
  
  var mins = Math.ceil(moment.duration(moment(nextArrival).diff(moment()), 'milliseconds').asMinutes()); 
  console.log("MINUTES TILL TRAIN: " + mins);
  
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(timearrive),
    $("<td>").text(mins)
  );
  $(".table > tbody").append(newRow);
});