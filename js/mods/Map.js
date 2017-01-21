var Map = React.createClass({
    getInitialState() {
        return {
            map: null,
            loc: null,
            infoWindow: null,
            markers: []
        };
    },
    componentWillReceiveProps(nextProps){       
        if(nextProps.type && this.props.type != nextProps.type) this.getNearbyPlaces(nextProps.type);
        if(nextProps.placeId && this.props.placeId != nextProps.placeId)
        this.getPlaceDetailById(nextProps.placeId);
    },
    render(){
        
        return(<div id="map"></div> )
    },
    componentDidMount (){       
        let defaultLoc = {lat: -25.363, lng: 131.044};        
        let map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: defaultLoc
        });
        let infoWindow = new google.maps.InfoWindow({map: map});
        infoWindow.close();
        // let service = new google.maps.places.PlacesService(map);
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
            // getNearbyPlaces();
            
            this.setState({
                map: map,
                loc: myLoc
            });            

          }, function() {
          });
        }

        },
        getNearbyPlaces(type){
           let {map, loc} = this.state;
           if(!map || !loc || !type) return;
        let myLatLng = new google.maps.LatLng(loc.lat,loc.lng);
        let request = {
    location: myLatLng,
    radius: '500',
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
   this.setState({markers:markers}, 
        this.props.setMarkerList(places)
        );
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
          // var request = {placeId: place.place_id};
          // let service = new google.maps.places.PlacesService(map);          
          // service.getDetails(request, this.callbackGetDetails);        

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
  this.setState({markers: markers});
}

});