import React, { Component } from 'react'
import MapGL, { Marker, Popup } from 'react-map-gl'

import CityPin from '@components/CityPin'
import LabelInfo from '@components/LabelInfo'

import { LoadMarkers } from '@services/api'

const TOKEN = 'pk.eyJ1IjoidGF2ZXJhc21pc2FlbCIsImEiOiJjamEzenBlcjM5dTFiMzNsZ2JhcWhrYmU0In0.2cYJYBYpTYmYI75TXuc_yA' // Set your mapbox token here

class App extends Component {
  state = {
    viewport: {
      latitude: 18.4708059,
      longitude: -69.886825,
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
    window.addEventListener('resize', this.resize)
    this.resize()
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { longitude, latitude } = coords
      this.setState(state => ({
        ...state,
        viewport: {
          ...state.viewport,
          longitude,
          latitude
        }
      }))
    })
    LoadMarkers()
      .then(locations => this.setState({ locations }))
      .catch(err => {
        console.error('ERROR LOADING MARKERS: ', err)
      })
  }
  resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      }
    })
  }

  renderPopup = () => {
    const { popupInfo } = this.state

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onClose={() => this.setState({ popupInfo: null })}
        >
          <LabelInfo info={popupInfo} />
        </Popup>
      )
    )
  }

  renderCityMarker = (city, index) => {
    return (
      <Marker key={`marker-${index}`} longitude={city.longitude} latitude={city.latitude}>
        <CityPin size={20} onClick={() => this.setState({ popupInfo: city })} />
      </Marker>
    )
  }

  updateViewport = viewport => {
    this.setState({ viewport })
  }
  render() {
    const { viewport, locations } = this.state
    return (
      <MapGL
        {...viewport}
        onViewportChange={this.updateViewport}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken={TOKEN}
      >
        {locations.map(this.renderCityMarker)}
        {this.renderPopup()}
      </MapGL>
    )
  }
}

export default App
