<template>
    <div class="card">
        <div class="card-header">
            <i class="fas fa-code"></i> Example Vue Active Fire Data
            <div class="col-md-2 float-right">
              <!-- <label for="inputState">{{table}}</label> -->
              <select id="inputState" class="form-control" v-model="table" @change="onChangeTable">
                <option>Choose Table...</option>
                <option>modis_1kms</option>
                <option>viirs_375ms</option>
              </select>
            </div>
        </div>
        <div class="card-body">
            <div id="map"></div>
            I'm an example Vue component!
        </div>
    </div>
</template>
<style>
  #map {
    width: 100%;
    height: 350px;
  }
</style>
<script>
    import 'ol/ol.css';
    import {Map, View} from 'ol';
    import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
    import GeoJSON from 'ol/format/GeoJSON.js';
    import {OSM, Vector as VectorSource} from 'ol/source.js';

    export default {
        data() {
          return {
            firms: [],
            columns: [],
            table: 'modis_1kms',
          }
        },
        created() {
          this.fetchActiveFireData();
        },
        methods: {
            fetchActiveFireData() {
              axios.get('/api/firms/'+this.table).then((res) => {
                console.log('FirmComponent', res.data);
                this.firms = res.data;
              })
            },
            onChangeTable() {
                console.log(this.table);
                this.fetchActiveFireData();
            }
        },
        mounted() {
            console.log('Component mounted.')
            const map = new Map({
              target: 'map',
              layers: [
                new TileLayer({
                  source: new OSM()
                })
              ],

              view: new View({
                center: [0, 0],
                zoom: 1
              })
            });
        }
    }
</script>
