class Main extends React.Component{
    constructor(props){
        super(props);
    var config = {
    apiKey: "AIzaSyCW4JydH6A5H6AGhyGGt5Lr2br3aHdWdxM",
    authDomain: "shining-heat-317.firebaseapp.com",
    databaseURL: "https://shining-heat-317.firebaseio.com",
    storageBucket: "shining-heat-317.appspot.com",
    messagingSenderId: "752402622831"
  };
    firebase.initializeApp(config);
    }
    render(){
        return(<div>
       <h3>Search Places by Type</h3>
    <Sel />
    <br/>
    <br/>
    <Map />
        </div>
        );
    }
};
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
        this.setState({options: options, selected: options[0].value});
    },
    changeSel(val){
        this.setState({selected: val.value});
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
            infoWindow: null
        };
    }
    render(){
        return(<div id="map"></div> )
    }
    componentDidMount (){
        var defaultLoc = {lat: -25.363, lng: 131.044};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: defaultLoc
        });
        this.setState({map: map}, this.setMyLocation);
        }
        setMyLocation(){
            if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            var myLoc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var map = this.state.map;
            if(map){
            map.setCenter(myLoc);
            map.setZoom(15);
            }
            // getNearbyPlaces();
            var infoWindow = new google.maps.InfoWindow({map: map});
            this.setState({
                map: map,
                infoWindow: infoWindow,
            });

            

          }, function() {
          });
        }

        }

};
ReactDOM.render(
  <Main />,
  document.getElementById('root')
);