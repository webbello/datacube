<template>
    <div class="forest-fire-container">
        
        <div id="map"></div>
        <div class="ol-custom ol-unselectable ol-control">
          <div class="input-group">
            <select id="fireTable" class="form-control form-control-sm" v-model="table" @change="onChangeTable">
              <option>Choose Table...</option>
              <option>modis_1kms</option>
              <option>viirs_375ms</option>
            </select>
            <div class="input-group-append">
              <a type="button" class="btn btn-outline-info btn-sm  dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span style="color: #303030;"><i class="fas fa-calendar"></i></span>
              </a>
              <div class="dropdown-menu dropdown-menu-right" style="background-color: rgba(48,48,48,0.7);">
                <a class="dropdown-item" name="Today" :class="{ active: rangeName === 'Today' }" @click="onFilterTable(range.today, range.today, $event)">Today</a>
                <a class="dropdown-item" name="Yesterday" :class="{ active: rangeName === 'Yesterday' }" @click="onFilterTable(range.yesterday, range.yesterday, $event)">Yesterday</a>
                <a class="dropdown-item" name="Last 7 Days" :class="{ active: rangeName === 'Last 7 Days' }" @click="onFilterTable(range.last7days, range.today, $event)">Last 7 Days</a>
                <a class="dropdown-item" name="Last 30 Days" :class="{ active: rangeName === 'Last 30 Days' }" @click="onFilterTable(range.last30days, range.today, $event)">Last 30 Days</a>
                <a class="dropdown-item" name="This Month" :class="{ active: rangeName === 'This Month' }" @click="onFilterTable(range.thisMonth, range.today, $event)">This Month</a>
                <a class="dropdown-item" name="Last Month" :class="{ active: rangeName === 'Last Month' }" @click="onFilterTable(range.lastMonthStart, range.lastMonthEnd, $event)">Last Month</a>
                <a class="dropdown-item" name="Custom Range">Custom Range</a>
                <div role="separator" class="dropdown-divider"></div>
                <div style="padding-left:1.6rem;">
                  <div class="btn-group" role="group" aria-label="Basic example">
                    <a type="button" :class="{ active: this.range.dayNight === 'D' }" class="btn btn-info btn-sm" name="D"  @click="onFilterTable(range.from, range.to, $event)">Day</a>
                    <a type="button" :class="{ active: this.range.dayNight === 'N' }" class="btn btn-info btn-sm" name="N"  @click="onFilterTable(range.from, range.to, $event)">Night</a>
                    <!-- <a type="button" class="btn btn-info btn-sm" name="All" :class="{ active: range.dayNight === '' }" @click="onFilterTable(range.from, range.to, $event)">All</a> -->
                  </div>
                </div>
                <!-- <a class="dropdown-item float-right" href="#">Cancel</a>
                <a class="dropdown-item" href="#">Apply</a> -->
              </div>
            </div>
          </div>
        </div>
        <div style="display: none;">
          <!-- Clickable label for Vienna -->
          <span id="status">&nbsp;0 selected features</span>
          <a class="overlay" id="vienna" target="_blank" href="http://en.wikipedia.org/wiki/Vienna">Vienna</a>
          <div id="marker" title="Marker"></div>
          <!-- Popup -->
          <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <div id="popup" title="Active Fire Data"></div>
        </div>
        
    </div>
</template>
<style>
  #map {
    width: 100%;
    height: 700px;
  }
  .card-body {
      padding: 0;
  }
  .forest-fire-container {
    margin-top: -1.5rem !important;
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
  .popover-body {
    max-height: 250px;
    overflow: auto;
    padding: 0.5rem 0.2rem;
  }
  .list-group { 
    padding-bottom: 0.5rem;
  }
  .list-group-item {
    padding: 0.3rem 0.75rem;
    background-color: rgba(48,48,48,0.7);
    border: 1px solid #444;
  }
</style>
<script>
  import 'ol/ol.css';
  import Feature from 'ol/Feature.js';
  import {Map, View} from 'ol';
  import Overlay from 'ol/Overlay.js';
  import {toStringHDMS} from 'ol/coordinate.js';
  import {fromLonLat, toLonLat} from 'ol/proj.js';
  import {easeIn, easeOut} from 'ol/easing.js';
  import {defaults as defaultControls, OverviewMap, FullScreen} from 'ol/control.js';
  import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
  import GeoJSON from 'ol/format/GeoJSON.js';
  import {click, pointerMove, altKeyOnly} from 'ol/events/condition.js';
  import Select from 'ol/interaction/Select.js';
  import Circle from 'ol/geom/Circle.js';
  import Point from 'ol/geom/Point';
  import {OSM, Vector as VectorSource} from 'ol/source.js';
  import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
  import * as moment from 'moment';

  export default {
      data() {
        return {
          southAsia: [76.4563, 25.0376],
          rangeName: 'Last 7 Days',
          range: {
            'from': moment().subtract(7, 'days').format('YYYY-MM-DD'),
            'to': moment().format('YYYY-MM-DD'),
            'dayNight': '',
            'today': moment().format('YYYY-MM-DD'),
            'yesterday': moment().subtract(1, 'days').format('YYYY-MM-DD'),
            'last7days': moment().subtract(7, 'days').format('YYYY-MM-DD'),
            'last30days': moment().subtract(30, 'days').format('YYYY-MM-DD'),
            'thisMonth': moment().startOf('month').format('YYYY-MM-DD'),
            'lastMonthStart': moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'),
            'lastMonthEnd': moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'),
          },
          map: {
            type: Object,
            default: {}
          },
          view: {
            type: Object,
            default: {}
          },
          vectorSource: {
            type: Object,
            default: {}
          },
          firms: [],
          columns: [],
          table: 'viirs_375ms',
          features: [],
          geojsonObject: {
              "type": "FeatureCollection",
              "crs":
              {
                  "type": "name",
                  "properties":
                  {
                      "name": "EPSG:4326"
                  }
              },
              "features": [
              {
                  "type": "Feature",
                  "geometry":
                  {
                      "type": "Point",
                      "coordinates": [78, 28]
                  },
                  "properties": {
                      "name": "Hoyle's Marina-Linwood: 98-08-0324-P",
                      "description": "135 S Linwood Beach, Linwood",
                      "data": {
                          "id": 511,
                          "latitude": "16.126",
                          "longitude": "95.576",
                          "brightness": "334.3",
                          "scan": "1.7",
                          "track": "1.3",
                          "acq_date": "2019-04-25",
                          "acq_time": 720,
                          "satellite": "A",
                          "confidence": 79,
                          "version": "6.0NRT",
                          "bright_t31": "312",
                          "frp": "30.4",
                          "daynight": "D",
                          "created_at": "2019-04-26 10:15:45",
                          "updated_at": "2019-04-26 10:15:45",
                          "geom": "0101000020E6100000BE9F1A2FDDE45740C74B378941203040",
                          "geomjson": "{'type':'Point','coordinates':[95.576,16.126]}"
                      }
                  }
              }]
          },
        }
      },
      created() {
        this.fetchActiveFireData();
        let now = moment().format('LLLL');
        let last7days = moment().subtract(7, 'days');
        //console.log('Momemnt', last7days)
        //console.log('Created JsonObj',this.firms);
      },
      methods: {
          moment: function (date) {
            return moment(date);
          },
          date: function (date) {
            return moment(date).format('MMMM Do YYYY, h:mm:ss a');
          },
          fetchActiveFireData() {
            axios.get('/api/firms/'+this.table).then((res) => {
              //console.log('FirmComponent', res.data);
              //this.firms = res.data;
              res.data.forEach((item, index) => {
                  this.geojsonObject.features.push({
                    'type': 'Feature',
                    'geometry': JSON.parse(item.geomjson)
                  })
              });
            })
          },
          onFilterTable(from, to, event) {
            console.log('ariapressed',event.target)
            this.rangeName = event.target.name
            this.range.from = from
            this.range.to = to
            if ( (event.target.name == 'D' && this.range.dayNight !== 'D') || (event.target.name == 'N' && this.range.dayNight !== 'N') ) {
              this.range.dayNight = event.target.name
            } else {
              this.range.dayNight = '';
            }
            console.log(this.table);
            console.log('from date', this.range.from)
            console.log('to date', this.range.to)
            console.log('dayNight', this.range.dayNight)
            axios.get('/api/firms/'+this.table+'/'+this.range.from+'/'+this.range.to+'/'+this.range.dayNight).then((res) => {
              //console.log('FirmComponent', res.data);
              //this.firms = res.data;
              this.vectorSource.clear()
              res.data.forEach((item, index) => {
                let geomJsonObj = JSON.parse(item.geomjson);
                //this.vectorSource.addFeature(new Feature(new Point(geomJsonObj.coordinates)));
                this.features.push(new Feature({
                  data:item,
                  geometry: new Point(geomJsonObj.coordinates)
                }));
              });
              this.vectorSource.addFeatures(this.features);
              // Fly to South Asia Animation
              this.flyTo(this.southAsia, function() {});
            });
          },
          onChangeTable() {
            console.log(this.table);
            console.log('from date', this.range.from)
            console.log('to date', this.range.to)
            console.log('dayNight', this.range.dayNight)
            axios.get('/api/firms/'+this.table+'/'+this.range.from+'/'+this.range.to+'/'+this.range.dayNight).then((res) => {
              //console.log('FirmComponent', res.data);
              //this.firms = res.data;
              this.vectorSource.clear()
              res.data.forEach((item, index) => {
                //console.log('FirmComponent', item);
                let geomJsonObj = JSON.parse(item.geomjson);
                //this.vectorSource.addFeature(new Feature(new Point(geomJsonObj.coordinates)));
                this.features.push(new Feature({
                  data:item,
                  geometry: new Point(geomJsonObj.coordinates)
                }));
              });
              this.vectorSource.addFeatures(this.features);
              console.log('vectorSource.getFeatures',this.vectorSource.getFeatures())
              // Fly to South Asia Animation
              this.flyTo(this.southAsia, function() {});
            });
          },
          renderMap() {
            this.view = new View({
              projection: 'EPSG:4326',
              center: this.southAsia,
              zoom: 4
            });

            let mapConfig = {
              target: 'map',
              controls: defaultControls().extend([
                new OverviewMap(),
                new FullScreen()
              ]),
              layers: [
                new TileLayer({
                  source: new OSM()
                })
              ],
              loadTilesWhileAnimating: true,
              view: this.view
            };

            var image = new CircleStyle({
              radius: 5,
              fill: new Fill({color: 'red', width: 1}),
              stroke: new Stroke({color: 'red', width: 0.5})
            });

            var styles = {
              'Point': new Style({
                image: image
              }),
              'LineString': new Style({
                stroke: new Stroke({
                  color: 'green',
                  width: 1
                })
              }),
              'MultiLineString': new Style({
                stroke: new Stroke({
                  color: 'green',
                  width: 1
                })
              }),
              'MultiPoint': new Style({
                image: image
              }),
              'MultiPolygon': new Style({
                stroke: new Stroke({
                  color: 'yellow',
                  width: 1
                }),
                fill: new Fill({
                  color: 'rgba(255, 255, 0, 0.1)'
                })
              }),
              'Polygon': new Style({
                stroke: new Stroke({
                  color: 'blue',
                  lineDash: [4],
                  width: 3
                }),
                fill: new Fill({
                  color: 'rgba(0, 0, 255, 0.1)'
                })
              }),
              'GeometryCollection': new Style({
                stroke: new Stroke({
                  color: 'magenta',
                  width: 2
                }),
                fill: new Fill({
                  color: 'magenta'
                }),
                image: new CircleStyle({
                  radius: 10,
                  fill: null,
                  stroke: new Stroke({
                    color: 'magenta'
                  })
                })
              })
            };

            var styleFunction = function(feature) {
              return styles[feature.getGeometry().getType()];
            };

            this.vectorSource = new VectorSource({
              features: (new GeoJSON()).readFeatures(this.geojsonObject)
            });

            //this.vectorSource.addFeatures(this.storeState.features);

            var vectorLayer = new VectorLayer({
              source: this.vectorSource,
              style: styleFunction
            });

            mapConfig.layers.push(vectorLayer);

            this.map = new Map(mapConfig);

            var select = null; // ref to currently selected interaction

            // select interaction working on "singleclick"
            var selectSingleClick = new Select();

            // select interaction working on "click"
            var selectClick = new Select({
              condition: click
            });

            // Popup showing the position the user clicked
            var popup = new Overlay({
              element: document.getElementById('popup'),
              autoPan: true,
              autoPanAnimation: {
                duration: 250
              }
            });
            this.map.addOverlay(popup);
            this.map.addInteraction(selectClick);
            selectClick.on('select', function(evt) {
              console.log('On Select', selectClick.getFeatures())
              var feature = evt.selected[0];
              if (feature) {
                var geometry = feature.getGeometry();
                var coord = geometry.getCoordinates();
                console.info('coord', feature.get('data'));
                var tableData = feature.get('data');
                // var content = '<h4>' + feature.get('name') + '</h4>';
                var content = '<ul class="list-group">';
                for (var key in tableData) {  
                  if (key !== 'geom' && key !== 'geomjson') {
                  content += '<li class="list-group-item d-flex justify-content-between align-items-center">'
                   + key + ':' +
                   '<span class="badge badge-primary badge-pill">' +tableData[key]+ '</span>' +
                   '</li>';
                 }
                }
                content += '</ul>';
                
                console.info('feature.getProperties', feature.getProperties());
                var element = popup.getElement();
                //var coordinate = evt.mapBrowserEvent.coordinate;
                var hdms = toStringHDMS(toLonLat(coord));
                
                $(element).popover('dispose');
                popup.setPosition(coord);
                $(element).popover({
                  placement: 'top',
                  animation: true,
                  html: true,
                  trigger: 'focus',
                  content: content
                });
                $(element).popover('show');
                $('.popover-header').click(function() {
                    if(!$(event.target).is('#popup')) {
                        $('[data-original-title]').popover('hide');
                        selectClick.getFeatures().clear();
                    }
                });
              }
            });

          },
          flyTo(location, done) {
            var duration = 2000;
            var zoom = this.view.getZoom();
            var parts = 2;
            var called = false;
            function callback(complete) {
              --parts;
              if (called) {
                return;
              }
              if (parts === 0 || !complete) {
                called = true;
                done(complete);
              }
            }
            this.view.animate({
              center: location,
              duration: duration
            }, callback);
            this.view.animate({
              zoom: zoom - 1,
              duration: duration / 2
            }, {
              zoom: zoom,
              duration: duration / 2
            }, callback);
          }
      },
      filters: {
        moment: function (date) {
          return moment(date).format('MMMM Do YYYY, h:mm:ss a');
        }
      },
      mounted() {
        //console.log('Component mounted.', this.geojsonObject)
        this.renderMap();
      }
  }
</script>
