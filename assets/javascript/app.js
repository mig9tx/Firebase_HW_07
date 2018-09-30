$(document).ready(function () {
    //global variables
    var database = firebase.database();
    var trainName = '';
    var destination = '';
    var firstTrainTime = '';
    var frequency = '';
    var n = 0;

    getdate(); //calls function

    function getdate() { //function that get the exact time/date from moment.js
        var time = moment().format("HH:mm:ss"); //formats the time 
        var seconds = moment().format("ss");
        if (seconds === "00") { //everytime seconds get to 00, the timeUpdate function is called
            timeUpdate();
        }

        $("#clock").text("Current Time: " + time); //displays the clock on the page
        setTimeout(function () {
            getdate()
        }, 500);
    };


    $("#add-train").on("click", function (event) { //upon adding the information and clicking the button, adds the information to the div
        event.preventDefault(); //prevents data from begin submitted
        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrainTime = $("#first-train-time").val().trim();
        frequency = $("#frequency").val().trim();

        // console.log(trainName);
        // console.log(destination);
        // console.log(firstTrainTime);
        // console.log(frequency);

        database.ref().push({ //pushes the data to firebase in an object
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            // dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
    })

    //Firebase watcher .on ("child_added")
    database.ref().on("child_added", function (snapshot) { //obtains the object information from firebase
        var sv = snapshot.val(); //variable used to truncate the method so that its easier to see.
        n++;
        var row = $("<tr>"); //variable that store table for element
        row.append("<td>" + n); //appends td elements to the row
        row.append("<td>" + sv.trainName + "</td>");
        row.append("<td>" + sv.destination + "</td>");
        row.append("<td id='tFirst" + n + "'>" + sv.firstTrainTime + "</td>"); //appends td element to the row and include ids for obtaining the values and calculating next train and minutes away time
        row.append("<td id= 'tFreq" + n + "'>" + sv.frequency + "</td>");

        $('tbody').append(row); //appends row to tbody once all data for the row has been added
        var tFrequency = sv.frequency;
        var firstTime = sv.firstTrainTime;
        firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

        //current time
        var current = moment();

        //difference between two times in minutes
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        //time appart (remainder)
        var tRemainder = diffTime % tFrequency;

        //Minute Until Train
        var tMinutesUntilTrain = tFrequency - tRemainder;

        //Next Train
        var nextTrain = moment().add(tMinutesUntilTrain, "minutes"); //add the minutes left until next train to the current time
        nextArrival = moment(nextTrain).format("HH:mm");
        var arrivalId = "arrival" + n; //creates id for arrival time td
        row.append("<td id='" + arrivalId + "'>" + nextArrival + "</td>"); //appends the value for the next train time
        var awayId = "away" + n; //creates id for minutes away td
        row.append("<td id='" + awayId + "'>" + tMinutesUntilTrain + "</td>"); //appnd the value for the next train time
    })

    //Function that loops through the values 
    function timeUpdate() { //function check the values in the table and re-calculates the formulas for the 'next train time' and 'minutes away' columns, function is run every minute.
        for (i = 1; i <= n; i++) {
            var arrivalId = "arrival" + i;
            var awayId = "away" + i;
            var tFirstId = "tFirst" + i;
            var tFreqId = "tFreq" + i;
            var tFirst = $("#" + tFirstId).text();
            var tFreq = $("#" + tFreqId).text();
            var firstTimeConverted = moment(tFirst, "HH:mm").subtract(1, "years");
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            var tRemainder = diffTime % tFreq;
            var tMinutesUntilTrain = tFreq - tRemainder;
            var nextTrain = moment().add(tMinutesUntilTrain, "minutes");
            var nextArrival = moment(nextTrain).format("HH:mm");
            $("#" + arrivalId).text(nextArrival);
            $("#" + awayId).text(tMinutesUntilTrain);
        }

    }
});