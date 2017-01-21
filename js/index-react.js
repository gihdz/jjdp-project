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
            selectedType: null,
            markerList: []
        }
    },
    handleSelChange(type){
        this.setState({selectedType: type});
    },
    setMarketList(markers){
        this.setState({markerList: markers});

    },
    
    render(){
        return(<div>
       <h3>Search Places by Type</h3>
    <Sel handleSelChange={this.handleSelChange}/>
    <br/>
    <br/>
    <Map type={this.state.selectedType} setMarkerList={this.setMarketList} />
    <hr />
        <MarkerList markers={this.state.markerList} />

        </div>
        );
    }
});

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);