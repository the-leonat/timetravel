import React, { Component } from 'react';

export default function withData(WrappedComponent) {
  
  return class extends Component {
    constructor(props) {
      super(props)
      
      this.state = {
        data: []
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

    render() {
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  }
  
}