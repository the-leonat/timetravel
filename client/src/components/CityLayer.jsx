// src/components/Cities.js

import React, { Component } from "react"  
import withData from "components/withData.jsx"

class CityLayer extends Component {
  constructor() {
    super()
    this.state = {
        data: []
    }
    
    this.clickHandler = this.clickHandler.bind(this)
  }

  isCitySelected(cityId) {
    return this.props.selectedCityId === cityId
  }
  
  clickHandler(cityId) {
    this.props.onSelectCity(cityId)
  }
  
  getCircleRadius() {
  }
  

  
  render() {
      if (this.props.data.length===0) return(<span>Loading ...</span>)
      return (
        this.props.data.directions.map((data) => {
         return (
           <g key={data.origin}>
             { this.isCitySelected(data.id) &&
               <text x={ this.props.getPX(data) } y={ this.props.getPY(data) }>{data.origin.split(",")[0]}</text>}
             <circle key={data.orig} onClick={() => this.clickHandler(data.id)} cx={ this.props.getPX(data) } cy={ this.props.getPY(data) } r={ 5 } fill="#000" className="marker" />
             
           </g>);
        })
    )
  }
}

export default withData(CityLayer)