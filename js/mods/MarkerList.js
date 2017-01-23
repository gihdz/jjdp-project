var MarkerList = React.createClass({
    getInitialState(){
        return {
            markers: [],
            markerList: [],
            inputValue: ""
        }
    },
    componentWillReceiveProps(nextProps){
        let {markers} = nextProps;
        this.setState({markers, markerList: markers}, this.filterList);
    },
    handleInputChange(e){
        let inputValue = e.target.value;        
        this.setState({inputValue}, this.filterList);        
    },    
    filterList(){
        let {inputValue} = this.state;
        let markerList = this.state.markers.filter(marker => marker.name.toLowerCase().includes(inputValue.toLowerCase()));
        this.setState({markerList});
    },
    render(){    
        let markers = this.state.markerList;
        let markerList = markers.map(marker => {
            return (
        <li data-id={marker.place_id} className="list-group-item marker" onClick={this.props.handleMarkerListClick}>
           {marker.name}  
        </li>)

        });
        return <div id="marker-list">
        <input placeholder="Search Markers" className="input-search-marker"  onChange={this.handleInputChange} value={this.state.inputValue} />
        <ul className="list-group">
        {markerList}
        </ul>        
        </div>
    }
});