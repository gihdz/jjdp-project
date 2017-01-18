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
class Map extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            infoWindow: null,
            service: null,
            loc: null
        };
    }
    render(){
        if(this.props.type){
            this.getNearbyPlaces();
        }
        return(<div id="map"></div> )
    }
    componentDidMount (){       
        let defaultLoc = {lat: -25.363, lng: 131.044};        
        let map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: defaultLoc
        });
        let infoWindow = new google.maps.InfoWindow({map: map});
        let service = new google.maps.places.PlacesService(map);
        this.setState({
            map: map,
            infoWindow: infoWindow,
            service: service
        }, this.setMyLocation);
        
        }
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

        }
        getNearbyPlaces(){
           let {map, loc, service} = this.state;
           if(!map || !loc || !service) return;
        let myLatLng = new google.maps.LatLng(loc.lat,loc.lng);
        let type = this.props.type;
        let request = {
    location: myLatLng,
    radius: '500',
    types: [type]
  };
  service.nearbySearch(request, this.callbackNearbySearch);

        }
        callbackNearbySearch(results, status){
            if (status == google.maps.places.PlacesServiceStatus.OK) {
    // deleteCurrentMarkers();
    console.log(results);
    // for (var i = 0; i < results.length; i++) {
    //   var place = results[i];
    //   this.createMarker(results[i]);
    // }
    
  }

        }

};
ReactDOM.render(
  <Main />,
  document.getElementById('root')
);