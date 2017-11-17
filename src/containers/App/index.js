import React, { Component } from 'react'
import MapGL, { Marker } from 'react-map-gl'

import CityPin from '@components/CityPin'

import { LoadMarkers } from '@services/api'

const TOKEN = 'pk.eyJ1IjoidGF2ZXJhc21pc2FlbCIsImEiOiJjamEzenBlcjM5dTFiMzNsZ2JhcWhrYmU0In0.2cYJYBYpTYmYI75TXuc_yA' // Set your mapbox token here

class App extends Component {
  state = {
    viewport: {
      latitude: 18.4800199,
      longitude: -69.982031,
      zoom: 12,
      bearing: 0,
      pitch: 0,
      width: 500,
      height: 500
    },
    popupInfo: null,
    locations: []
  }
  componentDidMount() {
    window.addEventListener('resize', this._resize)
    this._resize()
    LoadMarkers()
      .then(locations => this.setState({ locations }))
      .catch(err => {
        console.error('ERROR LOADING MARKERS: ', err)
      })
  }
  _resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      }
    })
  }

  _renderCityMarker = (city, index) => {
    return (
      <Marker key={`marker-${index}`} longitude={city.longitude} latitude={city.latitude}>
        <CityPin size={20} onClick={() => this.setState({ popupInfo: city })} />
      </Marker>
    )
  }

  _updateViewport = viewport => {
    this.setState({ viewport })
  }
  render() {
    const { viewport, locations } = this.state
    return (
      <MapGL
        {...viewport}
        onViewportChange={this._updateViewport}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken={TOKEN}
      >
        {locations.map(this._renderCityMarker)}
      </MapGL>
    )
  }
}

export default App
