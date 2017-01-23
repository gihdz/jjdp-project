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
            radius: null
        }
    },
    handleSelChange(selectedType, radius){
        this.setState({selectedType, radius});
    },
    render(){
        return(<div>
       <h3>Search Places by Type</h3>
    <Sel handleSelChange={this.handleSelChange}/>
    <Map type={this.state.selectedType} radius={this.state.radius} />
        </div>
        );
    }
});

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);