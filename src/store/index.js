import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //Bus Data
    busTag: '',
    selectedRoute: '',
    busRouteOptions: [],
    busStopOptions: [],
    busData: [], 
    noResultsError: '',
    //Map Data
    lat: '',
    long: '',
    //Route Data
    Arrival : '',
    Departure : '',
    Duration: '',
    Steps: []
  },
  getters:{
    getDirectionDetails : state => {
      console.log(state.directionData[0])
      return state.directionData[0]
    },
  },
  mutations: {
    set_coordinates : (state, currentCoordinates) => {
      state.lat = currentCoordinates.lat; 
      state.long = currentCoordinates.long;
    },
    set_directionInformation : (state, payload) => {
      state.Arrival = payload.directionsObj.Arrival;
      state.Departure = payload.directionsObj.Departure;
      state.Duration = payload.directionsObj.Duration;
      state.Steps = payload.directionsObj.Steps;
    },
    set_busRoutes: (state) => {
      axios.get('http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a=ttc')
        .then(resp => {
            let routeList = resp.data.route
            state.busRouteOptions = routeList;
            console.log(state.busRouteOptions)
            //this.getBusStops();
        })
        .catch((error) => {
            console.warn(error)
        })
    },
    set_busStops: (state, busTag) => {
      console.log(payload.val)
      console.log(state.busTag)
    }
  },
  actions: {},
  modules: {}
});
