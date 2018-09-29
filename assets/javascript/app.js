$(document).ready(function () {
    //obtain values of inputs upon clicking submit
    //create a new <tr> and append it to the table
    //create and place the values of the form into the <td> elements
    //append the <td>s and values to the <tr> and <table>
    // var myVar = setInterval(myTimer, 1000);
    
    
    var database = firebase.database();

    var trainName = '';
    var destination = '';
    var firstTrainTime = '';
    var frequency = '';
    
    getdate();

    function getdate() {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        if (s < 10) {
            s = "0" + s;
        }if (m < 10) {
            m = "0" + m;
        }

        $("#clock").text("Current Time: " + h + " : " + m + " : " + s);
        setTimeout(function () {
            getdate()
        }, 500);
    };


    $("#add-train").on("click", function (event) {
        event.preventDefault();
        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrainTime = $("#first-train-time").val().trim();
        frequency = $("#frequency").val().trim();
        n = 0;

        console.log(trainName);
        console.log(destination);
        console.log(firstTrainTime);
        console.log(frequency);

        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            // dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
    })

    //Firebase watcher .on ("child_added")
    database.ref().on("child_added", function(snapshot){
        var sv = snapshot.val();
        console.log(sv.trainName);
        console.log(sv.destination);
        console.log(sv.firstTrainTime);
        console.log(sv.frequency);
        var n = 0;
        var row = $("<tr>");
        row.append("<td>" + n + 1);
        row.append(`<td>${sv.trainName}</td>`);
        row.append("<td>" + sv.destination + "</td>");
        row.append("<td>" + sv.firstTrainTime + "</td>");
        row.append("<td>" + sv.frequency + "</td>");
        //Calculate the next arrival time based on the current time
        
        // nextArrival = 
        // row.append("<td>" + nextArrival + "</td>");
        //calculate how many minutes away that is from the current time
       
        // minutesAway = 
        // row.append("<td>" + minutesFromNow + "</td>");
       

        $('tbody').append(row);
        console.log(row);
        console.log(moment().format("DD/MM/YY hh:mm A"));
        var current = moment();
        console.log(current, 'minutes');
        minDiff=current.diff(firstTrainTime,'m mm');
        console.log(minDiff);
    })

});