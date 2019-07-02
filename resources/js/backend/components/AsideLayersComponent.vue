<template>
<div class="list-group list-group-accent" id="allLayers">
    <div class="list-group-item list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">Overlays</div>
    <div class="list-group-item list-group-item-accent-warning list-group-item-divider">
      <slot name="Administrative"></slot>
        <select id="fireTableAside" class="form-control form-control-sm" ref='ForestFireComponent' v-model="table" @change="onChangeTable">
          <option>Choose Table...</option>
          <option>modis_1kms</option>
          <option>viirs_375ms</option>
        </select>
        <header class="header">
          <h1>layers</h1>
          <input class="new-layer form-control form-control-sm"
            autofocus autocomplete="off"
            placeholder="What needs to be done?"
            v-model="newLayer"
            @keyup.enter="addLayer">
        </header>
    </div>
    <div class="accordion" id="accordionAsideLayer">
      <div class="card" v-for="(item, index) in layersData" :key="item.title">
        <div class="card-header" id="headingZero">
          <h2 class="mb-0">
            <button class="btn btn-link" type="button" data-toggle="collapse" :data-target="'#accordion-'+index" aria-expanded="true" aria-controls="'accordion-'+index">
              {{ item.title }}
            </button>
          </h2>
        </div>
        <div :id="'accordion-'+index" class="collapse" aria-labelledby="headingZero" :class="{ show: item.active }">
          <div class="card-body">
            <div v-for="subItem in item.items" :key="subItem.title"  class="layer list-group-item list-group-item-accent-info list-group-item-divider"
                    :class="{ completed: subItem.completed, editing: subItem == editedLayer }">
                <div class="form-check">
                  <input class="form-check-input toggle" type="checkbox" name="Administrative" :value="subItem.name" v-model="subItem.completed" @click="addLegend($event)">
                  <label class="form-check-label" for="stateBoundary" @dblclick="editLayer(subItem)" >
                    {{ subItem.title }}
                  </label>
                  <span class="badge badge-danger badge-pill float-right" @click="removeLayer(index, subItem)">X</span>
                  <div v-if="layer == subItem.name"><img :src="url" /></div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
  
</template>
<style>
.accordion > .card {
    margin-bottom: 0;
    border-radius: 0;
}
.accordion > .card .card-header {
    padding: 0;
    background-color: #2F353A;
    border-left: 4px solid #c8ced3;
}
.accordion > .card .card-header:first-child {
    border-radius: 0;
}
[v-cloak] { display: none; }
</style>
<script>
    //import { store } from "../store.js";
    // localStorage persistence
    import layersData from '../data/layers-data.js';
    var STORAGE_KEY = 'layers-vuejs-2.0'
    var layerStorage = {
      fetch: function () {
        var layers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        layers.forEach(function (layer, index) {
          layer.id = index
        })
        layerStorage.uid = layers.length
        return layers
      },
      save: function (layers) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(layers))
      }
    }
    // visibility filters
    var filters = {
      all: function (layers) {
        return layers
      },
      active: function (layers) {
        return layers.filter(function (layer) {
          return !layer.completed
        })
      },
      completed: function (layers) {
        return layers.filter(function (layer) {
          return layer.completed
        })
      }
    }
    export default {
        data() {
          return {
            layers: layerStorage.fetch(),
            newLayer: '',
            editedLayer: null,
            visibility: 'all',
            url: '',
            legend: false,
            layer: '',
            table: 'modis_1kms',
            layersData: layersData
          }
        },
        // watch layers change for localStorage persistence
        watch: {
          layers: {
            handler: function (layers) {
              layerStorage.save(layers)
            },
            deep: true
          }
        },

        // computed properties
        // http://vuejs.org/guide/computed.html
        computed: {
          filteredLayers: function () {
            return filters[this.visibility](this.layers)
          },
          remaining: function () {
            return filters.active(this.layers).length
          },
          allDone: {
            get: function () {
              return this.remaining === 0
            },
            set: function (value) {
              this.layers.forEach(function (layer) {
                layer.completed = value
              })
            }
          }
        },

        filters: {
          pluralize: function (n) {
            return n === 1 ? 'item' : 'items'
          }
        },
        methods: {
          onChangeTable() {
            //store.getFeatures(this.table);
          },
          addLegend(event) {
            console.log('AsideLayerComponentEvent', event);
            if (event.target.checked) {
            this.layer = event.target.value;
            } else {
              this.layer = ''
            }
            console.log('eventLayer', event.target.value);
            this.url = 'https://bis.iirs.gov.in:8443/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER='+this.layer+'&legend_options=layout:horizontal;fontName:Times%20New%20Roman';
            this.legend = true;
          },
          addLayer: function () {
            var value = this.newLayer && this.newLayer.trim()
            if (!value) {
              return
            }
            this.layersData[0].items.push({
              server: 'http://localhost:8080/geoserver',
              type: 'Point',
              title: value,
              name: 'topp:states',
              legend: false,
              completed: false
            })
            this.newLayer = ''
          },
          addLayerInStorage: function () {
            var value = this.newLayer && this.newLayer.trim()
              if (!value) {
                return
              }
              console.log(333,this.layers[0].items);
              this.layersData[0].items.push({
                id: layerStorage.uid++,
                server: 'http://localhost:8080/geoserver',
                type: 'Point',
                title: value,
                name: 'topp:states',
                legend: false,
                completed: false
              })
              this.newLayer = ''
          },
          removeLayer: function (i, layer) {
            this.layersData[i].items.splice(this.items.indexOf(layer), 1)
          },
          removeLayerFromStorage: function (layer) {
            this.layersData[0].items.splice(this.layers.indexOf(layer), 1)
          },
          removeLayer: function (layer) {
            this.layers.splice(this.layers.indexOf(layer), 1)
          },
          editLayer: function (layer) {
            this.beforeEditCache = layer.title
            this.editedLayer = layer
          },

          doneEdit: function (layer) {
            if (!this.editedLayer) {
              return
            }
            this.editedLayer = null
            layer.title = layer.title.trim()
            if (!layer.title) {
              this.removeLayer(layer)
            }
          },

          cancelEdit: function (layer) {
            this.editedLayer = null
            layer.title = this.beforeEditCache
          },

          removeCompleted: function () {
            this.layers = filters.active(this.layers)
          }
        },
        // a custom directive to wait for the DOM to be updated
        // before focusing on the input field.
        // http://vuejs.org/guide/custom-directive.html
        directives: {
          'layer-focus': function (el, binding) {
            if (binding.value) {
              el.focus()
            }
          }
        },
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
