import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    map: null,
    lat: '',
    long: '',
    directionData: []
  },
  getters:{
    getDirectionsData : state => {
      return state.directionData
    }
  },
  mutations: {
    set_coordinates : (state, currentCoordinates) => {
      state.lat = currentCoordinates.lat; 
      state.long = currentCoordinates.long;
    },
    set_map : (state, map) => {
      state.map = map
    },
    set_directionInformation : (state, directionInfo) => {
      // Remove item from directionData arr if there is one
      state.directionData.length > 0 ? state.directionData.length = 0 : ''
      let directionDetails = {
        arrival: directionInfo.directions.arrival_time,
        departure: directionInfo.directions.departure_time,
        duration: directionInfo.directions.duration,
        steps: directionInfo.directions.steps
      }
      state.directionData.push(directionDetails)
      console.log(state.directionData)
    }
  },
  actions: {},
  modules: {}
});
