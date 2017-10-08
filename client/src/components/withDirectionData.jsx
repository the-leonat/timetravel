import React, { Component } from 'react';
import * as d3 from "d3-array";

export default function withDirectionData(WrappedComponent, selectData) {
  
  return class extends Component {
    constructor(props) {
      super(props)
      
      this.state = {
        data: undefined,
      }
    }
    
    componentDidMount() {
      fetch("/directions.json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(data => {
          data.directions.map((entry, index) => {
            entry["id"] = index
            return entry
          })

          this.setState({
            data: data,
          }, () => {
          })
        })
      })
    }
    
    componentWillReceiveProps(newProps) {
      let selectedOrigin = this.state.data.directions[newProps.selectedCityId];

      if(this.state.data !== undefined && newProps.selectedCityId !== undefined) this.calculate(selectedOrigin)
    }
    
    calculate(selectedOrigin) {
      let connectionObjectList = this.createConnectionObjects(selectedOrigin)    
      let travelTimeExtent = this.calculateExtentTravelTime(connectionObjectList)
      this.normalizeTravelTimes(connectionObjectList, travelTimeExtent)
      
      this.setState({
        connectionObjectList: connectionObjectList,
        minTravelTime: travelTimeExtent[0],
        maxTravelTime: travelTimeExtent[1]
      }, () => {
      })
    }
  
    
    createConnectionObjects(selectedOrigin) {
      //selected all destination for selected city
      let connectionObjectList = []
      
      selectedOrigin.destinations.forEach((d) => {
        //find long lat from destination
        let destination = this.state.data.directions.filter((city) => city.origin === d.destination)[0]
        
        let selectedConnection = d.directions.filter((direction) => direction.departureIndex === 0 && direction.modeIndex === 1)[0]
      
        let c = {
          origin: {
            name: selectedOrigin.origin,
            long: selectedOrigin.long,
            lat: selectedOrigin.lat,
            x: this.props.getPX(selectedOrigin),
            y: this.props.getPY(selectedOrigin)

          },
          destination: {
            name: destination.origin,
            long: destination.long,
            lat: destination.lat,
            x: this.props.getPX(destination),
            y: this.props.getPY(destination),
          },
          travelTime: selectedConnection.travelTime,
          travelDistance: selectedConnection.travelDistance,
          
        }
                
        connectionObjectList.push(c)
      })

      return connectionObjectList;
    }
    
    calculateExtentTravelTime(connectionObjectList) {
      return d3.extent(connectionObjectList, (connection) => connection.travelTime)
    }
    
    normalizeTravelTimes(connectionObjectList, travelTimeExtent) {
      connectionObjectList.map((connection) => {
        connection.normalizedTravelTime = (connection.travelTime - travelTimeExtent[0]) / (travelTimeExtent[1] - travelTimeExtent[0])
      })
    }
    
    distortDestinations(connectionObjectList) {
     connectionObjectList.map((connection) => {
        let dx = connection.destination.x - connection.origin.x
        let dy = connection.destination.y - connection.origin.y
      })
    }
  
    render() {
      return <WrappedComponent data={this.state.data} connections={this.state.connectionObjectList} {...this.props} />;
    }
  }
  
}