var MarkerList = React.createClass({
    render(){    
        let {markers} = this.props;
        if(markers && markers.length === 0) return false;
        let markersList = this.props.markers.map(marker => <Marker marker={marker} /> );
        return <div>
        <ul className="list-group">
        {markersList}
        </ul>        
        </div>
    }
});
var Marker = React.createClass({
    render(){
        let {marker} = this.props;
        return (
        <li className="list-group-item">
           {marker.name}  
        </li>    )
        }
});