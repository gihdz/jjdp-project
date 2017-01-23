
var Sel = React.createClass({
    getInitialState(){
        return {
            options: [],
            selected: null,
            radius: 500
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
let defVal = options[0].value;
this.setState({options: options, selected: defVal}, this.updateTypeOnMap);
});
    },
    updateTypeOnMap(){
        let {selected, radius} = this.state;        
        this.props.handleSelChange(selected, radius);
    },
    changeSel(val){
        this.setState({selected: val.value}, this.updateTypeOnMap);
    },
    handleRadiusChange(val){
        let radius = (val.target.value ? val.target.value <= 50000 : val.target.value) || 500;
        this.setState({radius});
    },
    handleBtnClick(){
        this.updateTypeOnMap();
    },
    render(){
        return (
            <div id="places-form" >
            <Select className="p-form"
    name="select_types"
    value= {this.state.selected}
    options={this.state.options}
    onChange={this.changeSel}/>
    <input className="input-radius p-form" placeholder="radius in meters, default: 500m, max: 50,000m" onChange={this.handleRadiusChange}/>
    
        <button className="btn btn-default submit-places-form p-form" type="button" onClick={this.handleBtnClick}>
        Search
        </button>
    </div>
        )
    }
});