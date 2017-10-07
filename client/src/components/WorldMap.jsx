// src/components/WorldMap.js

import React, { Component } from "react"
import { geoMercator, geoPath, geoCircle } from "d3-geo"
import { feature } from "topojson-client"
import CityLayer from "components/CityLayer.jsx"

class WorldMap extends Component {
  constructor() {
    super()
    this.state = {
      
    }
    this.projection=this.projection.bind(this)
  }
  
  getWidth() {
    return window.innerWidth
  }
  
  getHeight() {
    return window.innerHeight
  }
  
  projection() {
    if(this.state.outline === undefined) return geoMercator()
    
    let b = geoPath().bounds(this.state.outline)
    
    let cLat = (b[0][0] + b[1][0]) / 2
    let cLong = (b[1][1] + b[0][1]) / 2
    

    return geoMercator().center([cLat, cLong]).scale(2500).translate([this.getWidth() / 2, this.getHeight() / 2])
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
            <CityLayer projection={this.projection} />
        </g>
      </svg>
    )
  }
}

export default WorldMap