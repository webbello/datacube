<template>
  <div class="ol-map" :id="id"></div>
</template>
<script>
  import 'ol/ol.css';
  import Feature from 'ol/Feature.js';
  import {Map, View} from 'ol';
  import {defaults as defaultControls, OverviewMap, FullScreen} from 'ol/control.js';
  import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
  import GeoJSON from 'ol/format/GeoJSON.js';
  import Select from 'ol/interaction/Select.js';
  import Circle from 'ol/geom/Circle.js';
  import Point from 'ol/geom/Point';
  import * as proj from 'ol/proj';
  import {OSM, Vector as VectorSource} from 'ol/source.js';
  import {Circle as CircleStyle, Fill, Stroke, Icon, Style} from 'ol/style.js';
  export default {
    name: 'OlMap',
    props: {
        lat: {
            required: true,
            type: Number
        },

        lon: {
            required: true,
            type: Number
        },

        zoom: {
            required: false,
            type: Number,
            default: 4
        },

        markers: {
            required: false,
            type: Array,
            default () {
                return []
            }
        }
    },

    data() {
        return {
            map: {
                type: Object,
                default: {}
            },
        }
    },

    computed: {
        id() {
            return this.$options.name + "-" + this._uid
        }
    },

    mounted() {
      console.log('OlMap mounted', this.id);
        let mapConfig = {
            target: this.id,

            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],

            view: new View({
                center: proj.fromLonLat([this.lon, this.lat]),
                zoom: this.zoom
            })
        };

        if (this.markers.length > 0) {
            let markerLayer
            let markerSource = new VectorSource()

            this.markers.forEach((marker) => {
                let featureProperties = {
                    geometry: new Point(
                        proj.transform([marker.lon, marker.lat], "EPSG:4326", "EPSG:3857")
                    )
                }

                let feature = new Feature({
                    ...featureProperties,
                    ...marker.properties
                })

                markerSource.addFeature(feature)
            });

            let iconStyle = new Style({
                image: new Icon({
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    opacity: 0.75,
                    src: 'https://openlayers.org/en/v5.3.0/examples/data/icon.png'
                })
            })

            markerLayer = new VectorLayer({
                source: markerSource,
                style: iconStyle
            });

            mapConfig.layers.push(markerLayer)
        }

        this.map = new Map(mapConfig);
    }
  }
</script>
