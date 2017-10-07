import fetch from "node-fetch"
import fs from "fs"
import distance from "google-distance-matrix"
import jsonfile from "jsonfile"

let apiKey = "AIzaSyD5itzQ3zqnfTO9qrLQRfvGS3slIHFrokU"
let cityFile = "cities.json"
let directionFile = "directions.json"

//set api key
distance.key(apiKey)
distance.language("de")

//set request time
let requestDate = new Date();

let d1 = new Date()
d1.setDate(d1.getDate() + 3)
d1.setHours(10,0,0,0)

let d2 = new Date()
d2.setHours(0,0,0,0)

let requestList = []


let departureTimes = [d1]


let transportModes = ["driving", "transit"]


fs.readFile("./" + cityFile, 'utf8', (err,data) => {
  if (err) {
    return console.log(err);
  }
  
  let directions = []

  
  let d = JSON.parse(data);
  
  //two sample cities
  //d = [d[0], d[1]]
  
  d.forEach((origin) => {
    let filteredDestinations = d.filter((refCity, index) => {
      return origin.City !== refCity.City 
    })

    let cityToCities = {
      //overwritten later by api
      origin: origin.City,
      lat: origin.Latitude,
      long: origin.Longitude,
      population: origin.Population,
      destinations: []
    }
    directions.push(cityToCities)

    filteredDestinations.forEach((destination) => {
      
      let cityToCity = {
        //overwritten later by api 
        destination: destination.City,
        directions: []
      }
      cityToCities.destinations.push(cityToCity)
      
      departureTimes.forEach((time, timeIndex) => {
        transportModes.forEach((mode, modeIndex) => {
          
          
          requestList.push(
            requestDistance(
              origin.City, 
              destination.City, 
              time.getTime() / 1000, 
              mode
            ).then((resp) => {
                let e = resp.rows[0].elements[0]

                cityToCities.origin = resp.origin_addresses[0]
                cityToCity.destination = resp.destination_addresses[0]

                let directionObject = {
                  modeIndex: modeIndex,
                  travelTime: e.duration.value,
                  travelDistance: e.distance.value,
                  departureIndex: timeIndex,
                  hour: time.getHours(),
                  apiResponse: resp
                }

                if(e.duration_in_traffic !== undefined) {
                  directionObject["duration_in_traffic"] = e.duration_in_traffic.value
                }

                cityToCity.directions.push(directionObject) 
            }, (err) => {
              console.error("rejected" )
              console.error(err);
            }) 
          )
        })  
      })
    })
  })
  
  
  Promise.all(requestList).then(() => {
    jsonfile.writeFile("./" + directionFile, {
      countryLabel: "DEU",
      departureTimes: departureTimes,
      transportModes: transportModes,
      directions: directions
    }, (err) => {
      if(!err) return;
      
      console.log("error")
      console.error(err)
    })
  })
}) 
  

function requestDistance(origin, destination, departureTime, transportMode) {
  return new Promise((resolve, reject) => {
    distance.departure_time(departureTime)
    distance.mode(transportMode)
    
    console.log("TRY: " + origin + " -> " + destination)


    let y = distance.matrix([origin], [destination], function (err, response) {
      if (err || response.status != "OK") {
        console.log("FAILED: " + origin + " -> " + destination)
        reject(err)
        return
      } else {
        resolve(response)
      }
    })
  })
}

 