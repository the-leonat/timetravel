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
         return <circle key={data.City} cx={ this.props.projection()([data.Longitude,data.Latitude])[0] } cy={ this.props.projection()([data.Longitude,data.Latitude])[1] } r={ 2 } fill="#000" className="marker" />;
        })
    )
  }
}

export default CityLayer