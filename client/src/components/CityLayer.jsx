// src/components/Cities.js

import React, { Component } from "react"  

class CityLayer extends Component {
  constructor() {
    super()
    this.state = {
        cities: []
    }
  }

 componentDidMount() {
    fetch("/cities.json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(data => {
          console.log(data)
          this.setState({
            cities: data,
          }, () => {
          })
        })
      })
  }
  render() {
      if (this.state.cities.length===0) return(<span>Loading ...</span>)
      return (
        this.state.cities.map((data) => {
         return <circle cx={ this.props.projection()([data.Longitude,data.Latitude])[0] } cy={ this.props.projection()([data.Longitude,data.Latitude])[1] } r={ 2 } fill="#000" className="marker" />;
        })
    )
}
// src/components/WorldMap.js

import React, { Component } from "react"
import { geoAlbers, geoMercator, geoPath } from "d3-geo"
import { feature } from "topojson-client"
import Cities from "components/Cities.jsx"

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
    fetch("/cities.json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(data => {
          console.log(data)
          this.setState({
            cities: data,
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
            <Cities cities={this.state.cities} />
        </g>
      </svg>
    )
  }
}

export default WorldMap
export default CityLayer