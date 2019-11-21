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
    },
    /* Unsuccessful attempt
    Set up:
    In map.vue, below is called when user clicks on the "Get Direction" button
    mapComponent.$store.commit("set_directionInformation",{
      directions // route info
    })

    In index.js > mutations
    set_directionInformation just takes directions and pushes data to the directionData array.
    Note that the directionData array will only hold one route info. If there is existing route info
    and user clicks "Get Direction", we splice the old data and replace it with new data.

    In list.vue:
    <direction-list-item :direction="getDirectionDetails"></direction-list-item>
    This looks much cleaner than current solution since we shouldn't need v-for loops.
    getDirectionDetails getter is made available in computed

    In index.js > getter
    getDirectionDetails : state => {
      console.log(state.directionData[0])
      return state.directionData[0] 
    }
    
    Result:
    This approach worked fine when searching directions for the first time. 
    However, when searching again, it does not update the HTML with the updated directionData. 
    This was true even though console.log(state.directionData[0]) showed the updated directionData.
    */
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
      let directionDetails = {
        arrival: directionInfo.directions.arrival_time,
        departure: directionInfo.directions.departure_time,
        duration: directionInfo.directions.duration,
        steps: directionInfo.directions.steps
      }
      state.directionData.length > 0 ?
        state.directionData.splice(0, 1, directionDetails) :
        state.directionData.push(directionDetails)
    }
  },
  actions: {},
  modules: {}
});
