var MarkerList = React.createClass({
    render(){    
        let {markers} = this.props;
        if(markers && markers.length === 0) return false;
        let markersList = this.props.markers.map(marker => {
            return (
        <li data-id={marker.place_id} className="list-group-item marker" onClick={this.props.handleMarkerListClick}>
           {marker.name}  
        </li>    )

        });
        return <div id="marker-list">
        <ul className="list-group">
        {markersList}
        </ul>        
        </div>
    }
});