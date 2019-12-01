import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';
import { interpolate } from "@popmotion/popcorn";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //Bus Data
    busTag: '', 
    stopTag: '', 
    busRouteOptions: [],
    busStopOptions: [], 
    busData: [], 
    busIndex: '',
    noResultsError: '',
    //Map Data
    lat: '',
    long: '',
    origin: '',
    startLocation: '',
    destination: '',
    //Route Data
    Arrival : '',
    Departure : '',
    Duration: '',
    Steps: []
  },
  getters:{
    getDirectionDetails : state => {
      return state.directionData[0]
    },
  },
  mutations: {
    //Mutations for Directions (Trip Planner)
    set_coordinates : (state, currentCoordinates) => {
      state.lat = currentCoordinates.lat,
      state.long = currentCoordinates.long
    },
    set_startLocation: (state, payload) => {
      state.startLocation = payload
    },
    set_destination: (state, payload) => {
      state.destination = payload
    },
    set_Arrival: (state, payload) => {
      state.Arrival = payload
    },
    set_Departure: (state, payload) => {
      state.Departure = payload
    },
    set_Duration: (state, payload) => {
      state.Duration = payload
    },
    set_Steps: (state, payload) => {
      state.Steps = payload
    },
    //Mutations for Bus Routes
    set_busRoutes: (state) => {
      axios.get('http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a=ttc')
        .then(resp => {
            let routeList = resp.data.route
            state.busRouteOptions = routeList;
        })
        .catch((error) => {
            console.warn(error)
        })
    },
    set_busStops: (state, payload) => {
      state.busTag = payload;
      let stopListURL = 'http://webservices.nextbus.com/service/publicJSONFeed?command=routeConfig&a=ttc&r='+state.busTag;
      axios.get(stopListURL)
        .then(resp => {
            let busStops = resp.data.route.stop;
            state.busStopOptions = busStops;
        })
        .catch((error) => {
            console.log(error)
        })
    },
    set_stopId: (state, payload) => {
        state.stopTag = payload;
    },
  },
  actions: {
  },
  modules: {}
});
