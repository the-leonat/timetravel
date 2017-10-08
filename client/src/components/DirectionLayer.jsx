// src/components/Cities.js

import React, { Component } from "react"  
import withDirectionData from "components/withDirectionData.jsx"

class DirectionLayer extends Component {
  constructor() {
    super()
    this.state = {
        data: []
    }
  }
 
  isCitySelected(cityId) {
    return this.props.selectedCityId === cityId
  }
  
  isAnyCitySelected() {
    return this.props.selectedCityId !== undefined
  }
  
  getSelectedCity() {
    if(this.props.selectedCityId === undefined) return
    
    return this.props.data.directions[this.props.selectedCityId]
  }
  
  getMaxTravelDuration() {
    this.props.data
  }
  
  
  
  render() {
      if (this.props.data === undefined) return(<span>Loading ...</span>)
    
      if(this.props.connections === undefined) return(<g></g>)
    
      let lines = this.props.connections.map((c, index) => {
        return (
          <line key={index} x1={c.origin.x} y1={c.origin.y} x2={c.destination.x} y2={c.destination.y}  strokeWidth={ 1 + c.travelTime / 60 / 60 * 5} stroke="rgba(0,0,0,0.2)"></line>
        )
      })
      return (
        <g>
          {lines}
        </g>
      )
  }
}

export default withDirectionData(DirectionLayer, (data, props) => {
  if(props.selectedCityId === undefined) return []
  return data.directions[props.selectedCityId]
})