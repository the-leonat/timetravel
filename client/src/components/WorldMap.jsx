// src/components/WorldMap.js

import React, { Component } from "react"
import { geoAlbers, geoMercator, geoPath } from "d3-geo"
import { feature } from "topojson-client"

class WorldMap extends Component {
  constructor() {
    super()
    this.state = {
      
    }
  }
  projection() {
    if(this.state.outline === undefined) return geoMercator()
    
    let width = 800
    let height = 450
        
    let b = geoPath().bounds(this.state.outline)
    console.log(b)
    
    let cLat = (b[0][0] + b[1][0]) / 2
    let cLong = (b[1][1] + b[0][1]) / 2

    
    
    

    return geoMercator().center([cLat, cLong]).scale(2000).translate([width / 2, height / 2])
  }
  
  componentDidMount() {
    fetch("/countries.geo.json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(data => {
          console.log(data)
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

    return (
      <svg width={ 800 } height={ 450 } viewBox="0 0 800 450">
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
          //8.8,53.083333
          <circle
            cx={ this.projection()([8.8,53.083333])[0] }
            cy={ this.projection()([8.8,53.083333])[1] }
            r={ 2 }
            fill="#000"
            className="marker"
          />
        </g>
      </svg>
    )
  }
}

export default WorldMap