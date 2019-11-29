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
    busData: {}, 
    busIndex: '',
    noResultsError: '',
    //Map Data
    key: 'AIzaSyDTFd6UTZ6sUOcSRLrRCPCEOAYmfrEz-Zg',
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
    set_busStops: (state, busTag) => {
      state.busTag = busTag;
      if(!state.busTag){
          return
      } 
      let stopListURL = 'http://webservices.nextbus.com/service/publicJSONFeed?command=routeConfig&a=ttc&r='+state.busTag;
      axios.get(stopListURL)
        .then(resp => {
            //resp data format "route":{"stop":[{"title":stopName,"stopID": stopID,"tag":tagNum}]}
            let busStops = resp.data.route.stop;
            state.busStopOptions = busStops;
        })
        .catch((error) => {
            console.log(error)
        })
    },
    set_stopId: (state, stopTag) => {
        state.stopTag = stopTag;
    },
    set_busData: (state, bus_and_stop_tags) => {
      //set_busData can be called at two different times:
      // 1. when user clicks the "Get Bus Information" button
      // 2. on mount
      // When its called on mount, it gets passed the "bus_and_stop_tags" parameter
      // This is the bus and stop tags saved in cookie
      if(bus_and_stop_tags){
        state.busTag = bus_and_stop_tags[0];
        state.stopTag = bus_and_stop_tags[1];
      }
      let predicitionRoute = 'http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=ttc&r='+state.busTag+'&s='+state.stopTag+'&useShortTitles=true';

        axios.get(predicitionRoute)
        .then(resp => { 
            let returnedBusSchedule = resp.data.predictions;
            // If the service returns no predicitons
            if(returnedBusSchedule.dirTitleBecauseNoPredictions){
              state.noResultsError = returnedBusSchedule.dirTitleBecauseNoPredictions + 
              " is either out of service or does not go in this direction"
            } 
            else if (returnedBusSchedule.direction){
              let busSaved = Object.keys(state.busData);
              //Format returned bus schedule data
              let busInfo = {
                routeName : returnedBusSchedule.routeTitle,
                stopName : returnedBusSchedule.stopTitle,
                direction : returnedBusSchedule.direction.title.split(" ")[0],
                timeUntil : returnedBusSchedule.direction.prediction.map( t => t.minutes),
                busTag: state.busTag,
                stopTag: state.stopTag
              }
              let busKey = returnedBusSchedule.routeTitle + ' ' + returnedBusSchedule.stopTitle;
              //Store and Show Max 3 Bus Data with no duplicates
              if(busSaved.length < 3) {
                  state.noResultsError = '';
                  Vue.set(
                    state.busData, 
                    busKey,
                    busInfo
                  );
                  Vue.cookies.isKey(busKey) ?
                    '':
                    Vue.cookies.set(
                    busKey,
                    busInfo
                )
              }
              else if(busSaved.length >= 3){
                let firstKey = Object.keys(state.busData)[0]
                Vue.delete(
                    state.busData,
                    firstKey
                )
                Vue.cookies.remove(firstKey)
                Vue.set(
                  state.busData, 
                  busKey,
                  busInfo
                );
                Vue.cookies.isKey(busKey) ?
                  '':
                  Vue.cookies.set(
                    busKey,
                    busInfo
                  )
              }
            };
        })
        .catch((error) => {
            console.warn(error)
        })
    },
    set_coordinates : (state, currentCoordinates) => {
      state.lat = currentCoordinates.lat,
      state.long = currentCoordinates.long
    },
  },
  actions: {
    set_Origin ({ commit }){
    },
    /*
    getCookieData ({ commit }){
      let cookieKeys = Vue.cookies.keys();
      console.log(cookieKeys)
      if(cookieKeys.length > 0){
        for(let i = 0; i < cookieKeys.length; i++){
            if(cookieKeys[i] != "direction"){
                let busAndStopTags = [
                  Vue.cookies.get(cookieKeys[i]).busTag,
                  Vue.cookies.get(cookieKeys[i]).stopTag,
                ]
                commit('set_busData', busAndStopTags)
            }
            else if(cookieKeys[i] == "direction"){
              commit('set_direction')
            }
        }
      }
    }*/
  },
  modules: {}
});
