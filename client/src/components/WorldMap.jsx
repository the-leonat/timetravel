// src/components/WorldMap.js

import React, { Component } from "react"
import { geoMercator, geoPath, geoCircle } from "d3-geo"
import CityLayer from "components/CityLayer.jsx"
import DirectionLayer from "components/DirectionLayer.jsx"

class WorldMap extends Component {
  constructor() {
    super()
    this.state = {
      selectedCityId: undefined
    }
    this.projection = this.projection.bind(this)
    this.selectCityHandler = this.selectCityHandler.bind(this)
    this.getPX = this.getPX.bind(this)
    this.getPY = this.getPY.bind(this)

  }
  
  getWidth() {
    return window.innerWidth
  }
  
  getHeight() {
    return window.innerHeight
  }
  
  getPX(data) {
    return this.projection()([data.long, data.lat])[0]
  }
  
  getPY(data) {
    return this.projection()([data.long, data.lat])[1]
  }
  
  projection() {
    if(this.state.outline === undefined) return geoMercator()
    
    let b = geoPath().bounds(this.state.outline)
    
    let cLong = (b[0][0] + b[1][0]) / 2
    let cLat = (b[1][1] + b[0][1]) / 2
    
    let zoom  = this.getHeight() * 25 / Math.abs((b[1][1] - b[0][1]))

    return geoMercator().center([cLong, cLat]).scale(zoom).translate([this.getWidth() / 2, this.getHeight() / 2])
  }
  
  selectCityHandler(cityId) {
    if(typeof cityId !== "number") throw "cityId not type int"
    
    this.setState({
      selectedCityId: cityId
    })
  }
  
  componentDidMount() {

    fetch("/countries.geo.json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(data => {
          this.setState({
            outline: data.features.filter((d) => {              
              return d.id === "DEU"
            })[0],
          }, () => {
          })
        })
      })
  }
  render() {
    if(this.state.outline === undefined) return (<span>Loading...</span>)
    return (
      <svg width={ this.getWidth() } height={ this.getHeight() } viewBox={`0 0 ${this.getWidth()} ${this.getHeight()}`}>
        <g className="countries">
          {
              <path
                d={ geoPath().projection(this.projection())(this.state.outline) }
                className="country"
                fill="none"
                stroke="#000"
                strokeWidth={ 0.5 }
              />
          }
        </g>
        <g className="markers">
          <DirectionLayer getPX={this.getPX} getPY={this.getPY} projection={this.projection} selectedCityId={this.state.selectedCityId} />

          <CityLayer getPX={this.getPX} getPY={this.getPY} projection={this.projection} onSelectCity={this.selectCityHandler} selectedCityId={this.state.selectedCityId} />
        </g>
      </svg>
    )
  }
}

export default WorldMap