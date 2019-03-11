$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBe9psEr5SwjJ9xIbvjGZWOM1lWk9t5dFk",
        authDomain: "my-1st-project-d4961.firebaseapp.com",
        databaseURL: "https://my-1st-project-d4961.firebaseio.com",
        projectId: "my-1st-project-d4961",
        storageBucket: "my-1st-project-d4961.appspot.com",
        messagingSenderId: "353096619593"
    };
    firebase.initializeApp(config);

    //Reference to Firebase
    var database = firebase.database();

    // Define each input with an empty string
    var trainName = "";
    var destination = "";
    var trainTime = "";
    var frequency = "";

    // Run the following function when the submit button is pressed
    $("#submit-button").on("click", function (event) {
        event.preventDefault();

        // Grabbed values from text boxes
        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        trainTime = $("#trainTime").val().trim();
        frequency = $("#frequency").val().trim();

        // Code for handling the push
        database.ref().push({
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency
        });

        // Empty the text boxes when the user data is submitted
        $("#trainName").val("");
        $("#destination").val("");
        $("#trainTime").val("");
        $("#frequency").val("");

    });

    // Firebase watcher + initial loader
    database.ref().on("child_added", function (childSnapshot) {

        // Log everything that's coming out of snapshot
        console.log(childSnapshot.val().trainName);
        console.log(childSnapshot.val().destination);
        console.log(childSnapshot.val().trainTime);
        console.log(childSnapshot.val().frequency);

        // Apply all of the snapshot data to table variables
        var trainNameTable = childSnapshot.val().trainName;
        var destinationTable = childSnapshot.val().destination;
        var frequencyTable = childSnapshot.val().frequency;
        var nextArrivalTable = childSnapshot.val().trainTime;

        // Apply the trainTime to the time format of hh:mm and then subtract one year
        var firstTimeConverted = moment(nextArrivalTable, "hh:mm").subtract(1, "years");
        // Apply the current time to the variable
        var currentTime = moment();
        // Convert the variable firstTimeConverted to minutes
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        // Get the remainder of diffTime and frequencyTable
        var tRemainder = diffTime % frequencyTable;
        // Subtract the tRemainder from frequencyTable
        var minutesTillTrain = frequencyTable - tRemainder;
        var nextTrain = moment().add(minutesTillTrain, "minutes");
        var nextTrainFormatted = moment(nextTrain).format("hh:mm")

        // apply the full list of items to the table
        $("#train-table").append("<tr><td>" +
            trainNameTable + "</td><td>" +
            destinationTable + "</td><td>" +
            frequencyTable + "</td><td>" +
            nextTrainFormatted + "</td><td>" +
            minutesTillTrain + "</td></tr>");

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });




}) 