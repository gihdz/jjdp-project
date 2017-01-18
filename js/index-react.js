var Main = React.createClass({
    getInitialState(){
    var config = {
    apiKey: "AIzaSyCW4JydH6A5H6AGhyGGt5Lr2br3aHdWdxM",
    authDomain: "shining-heat-317.firebaseapp.com",
    databaseURL: "https://shining-heat-317.firebaseio.com",
    storageBucket: "shining-heat-317.appspot.com",
    messagingSenderId: "752402622831"
  };
    firebase.initializeApp(config);    
        return {
            selectedType: null
        }
    },
    handleSelChange(type){
        this.setState({selectedType: type});
    },
    render(){
        return(<div>
       <h3>Search Places by Type</h3>
    <Sel handleSelChange={this.handleSelChange}/>
    <br/>
    <br/>
    <Map type={this.state.selectedType} />
        </div>
        );
    }
});
var Sel = React.createClass({
    getInitialState(){
        return {
            options: [],
            selected: null
        };
    },
    componentDidMount(){
          var ac = firebase.database().ref("ac");
          ac.on("child_added", snap => {
var placeTypes = snap.val();
var options = [];
for(var key in placeTypes){
  if(placeTypes.hasOwnProperty(key)){
    var option = {value: key, label: placeTypes[key].split(",")[0]};
    options.push(option);
  }
}
this.updateSelectOptions(options)
});

    },
    updateSelectOptions(options){
        let defVal = options[0].value;
        this.setState({options: options, selected: defVal});
        this.props.handleSelChange(defVal);
    },
    changeSel(val){
        this.setState({selected: val.value});
        this.props.handleSelChange(val.value);
    },
    render(){
        return (
            
            <Select
    name="select_types"
    value= {this.state.selected}
    options={this.state.options}
    onChange={this.changeSel}/>
        )
    }
});
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
        if(nextProps.type) this.getNearbyPlaces(nextProps.type);

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
            
            if (status == google.maps.places.PlacesServiceStatus.OK) {
    let markers = this.state.markers;
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      markers.push(this.createMarker(results[i]));
    }  
        this.setState({markers:markers});
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
          var request = {placeId: place.place_id};
          let service = new google.maps.places.PlacesService(map);          
          service.getDetails(request, this.callbackGetDetails);        

        });
        return marker;
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
ReactDOM.render(
  <Main />,
  document.getElementById('root')
);