
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