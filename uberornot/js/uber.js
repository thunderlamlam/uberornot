// Uber API Constants
var uberClientId = "akXrXIBooURR4n6NkuKmzfwCkiLXKVnX"
  , uberServerToken = "4Qh__5PGBwEd1s2ot-oSmo2t7OT85gTfLzayz3iT";

//departure date and return date
var departureDate
  , returnDate;

// create placeholder variables
var userLatitude
  , userLongitude
  , sfoLatitude = 37.623182
  , sfoLongitude = -122.379213;

var timer;

navigator.geolocation.watchPosition(function(position) {
    // Update latitude and longitude
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;
	if (typeof timer === typeof undefined) {
	    timer = setInterval(function() {
	        getEstimatesForUserLocation(userLatitude, userLongitude);
	    }, 60000);
		
	    getEstimatesForUserLocation(userLatitude, userLongitude);
    }
});

$("a").click(function(event){
    // Intercepted Click Event
	var uberURL = "https://m.uber.com/sign-up?";

	// Add parameters
	uberURL += "client_id=" + uberClientId;
	if (typeof userLatitude != typeof undefined) uberURL += "&" + "pickup_latitude=" + userLatitude;
	if (typeof userLongitude != typeof undefined) uberURL += "&" + "pickup_longitude=" + userLongitude;
	uberURL += "&" + "dropoff_latitude=" + sfoLatitude;
	uberURL += "&" + "dropoff_longitude=" + sfoLongitude;
	uberURL += "&" + "dropoff_nickname=" + "SFO";

	// Redirect to Uber
	window.location.href = uberURL;
});

$("#departDate").datepicker({
	onSelect: function(dateText, inst) {
	    departureDate = new Date(dateText);
	  },
});
$("#retDate").datepicker({
	onSelect: function(dateText, inst) {
	    returnDate = new Date(dateText);
		var timeDiff = Math.abs(returnDate.getTime() - departureDate.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
		var parkCost = diffDays * 18;
		$("#parking").text("$"+ parkCost);
	  },
});



function getEstimatesForUserLocation(latitude,longitude) {
  $.ajax({
    url: "https://api.uber.com/v1/estimates/price",
    headers: {
        Authorization: "Token " + uberServerToken
    },
    data: {
        start_latitude: latitude,
        start_longitude: longitude,
        end_latitude: sfoLatitude,
        end_longitude: sfoLongitude
    },
    success: function(result) {
        console.log(result);
		var data = result["prices"];
		if (typeof data != typeof undefined) {
		  // Sort Uber products by time to the user's location
		  data.sort(function(t0, t1) {
		    return t0.low_estimate - t1.low_estimate;
		  });

		  // Update the Uber button with the shortest time
		  var cheapest = data[0];
		  if (typeof cheapest != typeof undefined) {
		    console.log("Updating lowest cost...");
		    $("#time").html("Roundtrip starts at $" + Math.ceil(cheapest.low_estimate)*2);
		  }
		}
    }
  });
}

