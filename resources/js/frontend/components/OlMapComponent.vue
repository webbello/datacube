<template>
    <div class="wrapper">
       <div>
          <ol-map :lat="map.lat" :lon="map.lon" :markers="markers"></ol-map>
          <div class="ol-custom ol-unselectable ol-control">
             <!-- <button class="ol-zoom-in" type="button" title="Show Me">O</button> -->
             <select id="inputState" class="form-control form-control-sm ol-zoom-in" v-model="table" @change="onChangeTable">
                <option>Choose Table...</option>
                <option>modis_1kms</option>
                <option>viirs_375ms</option>
              </select>
          </div>
       </div>
    </div>
</template>
<style>
  .wrapper {
     width: 100%;
     margin: -1.5rem auto 0 auto;
  }
  .map:-moz-full-screen {
        height: 100%;
  }
  .map:-webkit-full-screen {
    height: 100%;
  }
  .map:-ms-fullscreen {
    height: 100%;
  }
  .map:fullscreen {
    height: 100%;
  }
  .ol-rotate {
    top: 3em;
  }
  .ol-custom{
    z-index: 1000;
    top: 4em;
    right: 2.5em;
  }
</style>
<script>
  import OlMap from './OlMap.vue';
  export default {
    components: {
      OlMap
    },
    data() 
      { 
        return {
          map: {
              lat: 51.22,
              lon: 7.6
          },
          table: 'viirs_375ms',

          // This could be coming from an external API
          markers: [{
              lat: 50.086508,
              lon: 14.411441,
              properties: {
                  name: "Charles Bridge"
              }
          }, {
              lat: 41.902959,
              lon: 12.454449,
              properties: {
                  name: "Sistine Chapel"
              }
          }, {
              lat: 37.971529,
              lon: 23.725743,
              properties: {
                  name: "Acropolis"
              }
          }, {
              lat: 45.976566,
              lon: 7.658452,
              properties: {
                  name: "Matterhorn"
              }
          }, {
              lat: 55.753912,
              lon: 37.620799,
              properties: {
                  name: "Red Square"
              }
          }]
      } 
    },
    created() {
      this.onChangeTable();
    },
    methods: {
      onChangeTable() {
        console.log(this.table);
        axios.get('/api/firms/'+this.table).then((res) => {
          console.log('FirmComponent', res.data);
          res.data.forEach((item, index) => {
            var geomJsonObj = JSON.parse(item.geomjson);
            
            this.markers.push({
                lat: geomJsonObj.coordinates[0],
                lon: geomJsonObj.coordinates[1],
                properties: {
                    name: "Irfan_" + index
                }
            })
          });
        });
        //this->map->render();
        console.log(this.markers);
      },
    },
    mounted() {
      console.log('OlMapComponent Mounted', this.markers);
        
    }
  }
</script>
