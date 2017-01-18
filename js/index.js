var config = {
    apiKey: "AIzaSyCW4JydH6A5H6AGhyGGt5Lr2br3aHdWdxM",
    authDomain: "shining-heat-317.firebaseapp.com",
    databaseURL: "https://shining-heat-317.firebaseio.com",
    storageBucket: "shining-heat-317.appspot.com",
    messagingSenderId: "752402622831"
  };
  firebase.initializeApp(config);
    var placeTypes;
    var myLoc;
    var map;
    var currentMarkers = [];
    var selectedMarker;
    var infoWindow; 

var setMapOnMarkers = function(currentMap){
  for(var i = 0; i< currentMarkers.length; i++){
    currentMarkers[i].setMap(currentMap);
  }
}
var deleteCurrentMarkers = function(){
  setMapOnMarkers(null);
  currentMarkers = [];
}
var changeSelectTypes = function(e){
console.log(this.value);
        getNearbyPlaces();
};
  var ac = firebase.database().ref("ac");
  ac.on("child_added", function(snap){
placeTypes = snap.val();
var selectTypes = document.getElementById("select_types");

selectTypes.addEventListener("change", changeSelectTypes, false);
selectTypes.textContent = "";
for(var key in placeTypes){
  if(placeTypes.hasOwnProperty(key)){
    var option = document.createElement("option");
    option.textContent = placeTypes[key].split(",")[0];
    option.setAttribute("value", key);
    selectTypes.appendChild(option);
  }
}});


    var setMyLocation = function(){
 // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            myLoc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            if(map){
            map.setCenter(myLoc);
            map.setZoom(15);
            }
            getNearbyPlaces();
            infoWindow = new google.maps.InfoWindow({map: map});

            

          }, function() {
          });
        } else {
        }
}
var getNearbyPlaces = function(){
  if(!map || !myLoc) return;
        var myLatLng = new google.maps.LatLng(myLoc.lat,myLoc.lng);
var type = document.getElementById("select_types").value;
  var request = {
    location: myLatLng,
    radius: '500',
    types: [type]
  };

  service.nearbySearch(request, callbackNearbySearch);
}
      function callbackNearbySearch(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    deleteCurrentMarkers();
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
    
  }
  else
  {
    deleteCurrentMarkers();
    var n = noty({
    text: 'No places found!',
    type: "warning",
    timeout: 3000,
    animation: {
        open: {height: 'toggle'},
        close: {height: 'toggle'},
        easing: 'swing',
        speed: 500 // opening & closing animation speed
    }
});

  }
      }
        var callbackGetDetails = function(place, status){
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      console.log(place);
          infoWindow.setContent(getPlaceInfoHtml(place));
          infoWindow.open(map, selectedMarker);
            }
         }
         var getPlaceInfoHtml = function(place){
           var snip =
           "<strong>" + place.name + "</strong></br>" +
           place.formatted_address + "</br>" +
           "<a href ='"+place.url+"' target='_blank'>View on Google Maps</a>";
           return snip;
         }
            var createMarker = function(place){
        console.log(place);
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();
        var pos = {
              lat: lat,
              lng: lng
            };
        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: place.name
        });
        marker.addListener("click", function(){
          selectedMarker = marker;
          var request = {placeId: place.place_id};
          service.getDetails(request, callbackGetDetails);
          

        });
        currentMarkers.push(marker);
      }
      function initMap() {
        var defaultLoc = {lat: -25.363, lng: 131.044};
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: defaultLoc
        });
        setMyLocation();  
      };
