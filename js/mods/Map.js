var Map = React.createClass({
    getInitialState() {
        return {
            map: null,
            infoWindow: null,
            markers: [],
            places: [],
            localized: false
        };
    },
    componentWillReceiveProps(nextProps){
      console.log(nextProps.type);       
        this.getNearbyPlaces(nextProps.type, nextProps.radius);
    },
    
    handleMarkerListClick(id){
        this.getPlaceDetailById(id);
    },
    render(){        
        return(
          <div id="container">
          <div id="map-container">
          <div id="map"></div> 
          </div>
           <MarkerList markers={this.state.places} handleMarkerListClick={this.handleMarkerListClick} />
        </div>
        )
    },
    componentDidMount (){       
        let defaultLoc = {lat: -25.363, lng: 131.044};        
        let map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: defaultLoc
        });
        let infoWindow = new google.maps.InfoWindow({map: map});
        infoWindow.close();
        this.setState({
            map: map,
            infoWindow: infoWindow
        }, this.setMyLocation);        
        },
        setMyLocation(){
            let map = this.state.map;
            if(!map) return;
            
            if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            let myLoc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            map.setCenter(myLoc);
            map.setZoom(15);
            
            this.setState({
                map, localized: true
            });            

          }, () => alert("Unable to retrieve your location."));
        }
        else alert("HTML5 geolocation not supported by browser! :(");
        

        },
        getNearbyPlaces(type, radius){
           let {map, localized} = this.state;
           if(!map || !type || !localized) return;
        let request = {
    location: map.getCenter(),
    radius: radius,
    types: [type]
  };
  let service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, this.callbackNearbySearch);

        },
        callbackNearbySearch(results, status){
    this.deleteCurrentMarkers();
    let places = [];
    let markers = [];            
            if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      markers.push(this.createMarker(results[i]));
      places.push(results[i]);
    }  
       
  } else
  {
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
   this.setState({markers, places});       
        },
              createMarker(place){
        let {map} = this.state;
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();
        var pos = {
              lat: lat,
              lng: lng
            };
        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: place.name,
          pid: place.place_id
        });
        
        marker.addListener("click", () => {
          this.getPlaceDetailById(place.place_id);
        });
        return marker;
      },
      getPlaceDetailById(id){
        let {map} = this.state;
        let request = {placeId: id};        
        let service = new google.maps.places.PlacesService(map);          
          service.getDetails(request, this.callbackGetDetails);         
      },
      callbackGetDetails (place, status){
          let {map, markers, infoWindow} = this.state;
          if(!map || !infoWindow) return;
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      let marker = markers.find(mark => mark.pid == place.place_id);
          infoWindow.setContent(this.getPlaceInfoHtml(place));
          infoWindow.open(map, marker);
            }
         },
          getPlaceInfoHtml(place){
           var snip =
           "<strong>" + place.name + "</strong></br>" +
           place.formatted_address + "</br>" +
           "<a href ='"+place.url+"' target='_blank'>View on Google Maps</a>";
           return snip;
         },
         deleteCurrentMarkers(){
             var {map, markers} = this.state;
             for(var i = 0; i< markers.length; i++){
                     markers[i].setMap(null);
                      }
  markers = [];
  this.setState({markers});
}

});