import React, { Component } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Map, ImageOverlay, Marker, Popup, Tooltip } from 'react-leaflet'
import Control from 'react-leaflet-control';
import util from '../util/date.js'
import camera from '../image/icon/camera.png'
import sfof1 from '../image/floormap/SFO_F01.jpg'
import sfof2 from '../image/floormap/SFO_F02.jpg'
import sfof3 from '../image/floormap/SFO_F03.jpg'



/* robinpowered */
class Floor extends Component {



    customPin = L.divIcon({
        className: 'location-pin',
        html: `<img src=${camera}><div class="pin"></div><div class="pulse"></div>`,
        iconSize: [40, 40],
        iconAnchor: [24, 40]
    });

    constructor(props) {
        super(props);

        const iniBounds = L.latLngBounds(null, null);

        this.state = {
            currentZoomLevel: 0,
            bounds: iniBounds,
            targetFloor: 'delta_sfof1',
            floors: {
                delta_sfof1: {
                    name: "Floor 01",
                    image: sfof1,
                    markers: [
                        {
                            id: 101,
                            name: "Potrero Hill",
                            floor: 1,
                            lat: -67,
                            lng: 357
                        },
                        {
                            id: 102,
                            name: "Dogpatch",
                            floor: 1,
                            lat: -155,
                            lng: 503
                        },
                        {
                            id: 103,
                            name: "The Castro",
                            floor: 1,
                            lat: -44,
                            lng: 637
                        },
                        {
                            id: 104,
                            name: "Noe Valley",
                            floor: 1,
                            lat: -97,
                            lng: 637
                        },
                        {
                            id: 105,
                            name: "Mission",
                            floor: 1,
                            lat: -243,
                            lng: 629
                        },
                        {
                            id: 106,
                            name: "SoMa",
                            floor: 1,
                            lat: -385,
                            lng: 516
                        }
                    ]
                },
                delta_sfof2: {
                    name: "Floor 02",
                    image: sfof2,
                    markers: [{
                        id: 201,
                        name: "Russian Hill",
                        floor: 2,
                        lat: -39,
                        lng: 75
                    },
                    {
                        id: 202,
                        name: "Fisherman's Wharf",
                        floor: 2,
                        lat: -80,
                        lng: 75
                    },
                    {
                        id: 203,
                        name: "Marina",
                        floor: 2,
                        lat: -40,
                        lng: 265
                    },
                    {
                        id: 204,
                        name: "Cow Hollow",
                        floor: 2,
                        lat: -75,
                        lng: 250
                    },
                    {
                        id: 205,
                        name: "Richmond",
                        floor: 2,
                        lat: -54,
                        lng: 377
                    },
                    {
                        id: 206,
                        name: "Financial District",
                        floor: 2,
                        lat: -44,
                        lng: 632
                    },
                    {
                        id: 207,
                        name: "North Beach",
                        floor: 2,
                        lat: -249,
                        lng: 633
                    },
                    {
                        id: 208,
                        name: "Pacific Heights",
                        floor: 2,
                        lat: -405,
                        lng: 634
                    },
                    {
                        id: 209,
                        name: "Union Square",
                        floor: 2,
                        lat: -415,
                        lng: 400
                    },
                    {
                        id: 210,
                        name: "Hayes Valley",
                        floor: 2,
                        lat: -380,
                        lng: 280
                    },
                    {
                        id: 211,
                        name: "Tenderloin",
                        floor: 2,
                        lat: -297,
                        lng: 175
                    },
                    {
                        id: 212,
                        name: "Nob Hill",
                        floor: 2,
                        lat: -415,
                        lng: 45
                    },
                    {
                        id: 213,
                        name: "Telegraph Hill",
                        floor: 2,
                        lat: -380,
                        lng: 1
                    }]
                },
                delta_sfof3: {
                    name: "Floor 03",
                    image: sfof3,
                    markers: [{
                        id: 301,
                        name: "Twin Peaks",
                        floor: 33,
                        lat: -65,
                        lng: 210
                    },
                    {
                        id: 302,
                        name: "Haight-Ashbury",
                        floor: 3,
                        lat: -405,
                        lng: 125
                    },
                    {
                        id: 303,
                        name: "Cole Valley",
                        floor: 3,
                        lat: -405,
                        lng: 70
                    }]
                },
            }
        };
    }

    componentDidMount() {
        const map = this.map.leafletElement;

        map.on('zoomend', () => {
            const updatedZoomLevel = map.getZoom();
            this.handleZoomLevelChange(updatedZoomLevel);
        });

        map.on('click', (e) => {
            this.handleAddMarker(e, map);
            //this.handleChangeFloor();
        });

        const w = 2700 * 2,
            h = 1800 * 2;

        const southWest = map.unproject([0, h], map.getMaxZoom() - 1);
        const northEast = map.unproject([w, 0], map.getMaxZoom() - 1);

        const bounds = new L.LatLngBounds(southWest, northEast);
        this.setState({ bounds: bounds });
        map.setMaxBounds(bounds);
    }

    componentDidUpdate() {
        console.log(this.state);
    }

    handleZoomLevelChange(newZoomLevel) {
        this.setState({ currentZoomLevel: newZoomLevel });
    }

    handleChangeFloor(e) {
        this.setState({ targetFloor: e.target.dataset.floor });
    }

    handleAddMarker(e, map) {
        const cid = util.datetick();

        var _marker = {
            id: cid,
            lat: e.latlng.lat,
            lng: e.latlng.lng
        }

        // add Marker to state
        let _floors = Object.assign({}, this.state.floors);
        _floors[this.state.targetFloor].markers = [..._floors[this.state.targetFloor].markers, _marker];

        this.setState({
            floors: _floors
        })
    }

    updateMarkerPosition(e) {

        const { lat, lng } = e.target.getLatLng()

        let updatedMarkers = this.state.floors[this.state.targetFloor].markers.map(m => {
            if (m.id === e.target.options.id) {
                m.lat = lat
                m.lng = lng
                console.log('lat: ' + m.lat + ' lng: ' + m.lng);
            }
            return m;
        })

        // update Marker to state 
        this.setState({ markers: updatedMarkers });
    }

    render() {

        window.console.log('this.state.currentZoomLevel ->', this.state.currentZoomLevel);

        return (
            <div className="App">

                <Map ref={m => { this.map = m; }}
                    center={[0, 0]}
                    zoom={1}
                    minZoom={1}
                    maxZoom={4}
                    crs={L.CRS.Simple}
                    attributionControl={false}
                >

                    <ImageOverlay
                        url={this.state.floors[this.state.targetFloor].image}
                        bounds={this.state.bounds} >

                        {this.state.floors[this.state.targetFloor].markers.map(m =>
                            <Marker position={[m.lat, m.lng]}>
                                <Popup>
                                    <span>{m.name}</span>
                                </Popup>
                                <Tooltip direction='auto' offset={[55, 20]} opacity={0.9} permanent className='labelstyle'>
                                    <span style={{ color: 'red', fontWeight: 'bold', fontSize: '40' }}>{m.name}</span>
                                </Tooltip>
                            </Marker>

                        )}

                    </ImageOverlay>

                    <Control position="topright">
                        <div style={{ backgroundColor: 'blue', padding: '5px', }}>
                            <button onClick={this.handleChangeFloor.bind(this)} data-floor="delta_sfof1">Floor 01</button>
                            <button onClick={this.handleChangeFloor.bind(this)} data-floor="delta_sfof2">Floor 02</button>
                            <button onClick={this.handleChangeFloor.bind(this)} data-floor="delta_sfof3">Floor 03</button>
                        </div>
                    </Control>

                </Map>
                <ol>
                    {this.state.floors[this.state.targetFloor].markers.map(m => (
                        <li key={m.id}>{`[${m.id}] (${m.lat},${m.lng})`}</li>
                    ))}
                </ol>
            </div>
        );
    }
}


export default Floor;
