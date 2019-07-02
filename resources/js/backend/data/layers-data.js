export const layersData = [
  {
    action: 'local_activity',
    title: 'Attractions',
    active: true,
    items: [
      
    ]
  },
  {
    action: 'restaurant',
    title: 'Administrative',
    active: true,
    items: [
      {
        id: 1,
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'State Boundary',
        name: 'bis:india_state',
        legend: false,
        completed: false
      },
      {
        id: 1,
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'District Boundary',
        name: 'bis:india_dist',
        legend: false,
        completed: false
      },
      {
        id: 1,
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'Village Census',
        name: 'sdss:ua_vill_census',
        legend: false,
        completed: false
      }
    ]
  },
  {
    action: 'school',
    title: 'Base Layers',
    items: [
      {
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'Major Locations',
        name: 'sdss:ua_locations',
        legend: false,
        completed: false
      },
      {
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'Major Rail Network',
        name: 'bis:main-rail',
        legend: false,
        completed: false
      },
      {
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'Major Rivers',
        name: 'bis:main-river2',
        legend: false,
        completed: false
      },
      {
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'Major Roads- India',
        name: 'bis:main-road',
        legend: false,
        completed: false
      },
      {
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'Uttrakhand Roads',
        name: 'sdss:ua_roads',
        legend: false,
        completed: false
      }
    ]
  },
  {
    action: 'directions_run',
    title: 'Forest Fire',
    items: [
      {
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'MODIS Fire Points- May 7, 2019',
        name: 'bis:MODIS_C6_South_Asia_24h',
        legend: false,
        completed: false
      },
      {
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'Forest Fire Risk Zones',
        name: 'forestfire:ForestFireRiskZones',
        legend: false,
        completed: false
      },
      {
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'Friday 17-May-2019- Forest Fire Vulnerability_Original',
        name: 'forestfire:fire_original',
        legend: false,
        completed: false
      },
      {
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'Friday 17-May-2019-Forest Fire Vulnerability',
        name: 'forestfire:ForestFire',
        legend: false,
        completed: false
      }
    ]
  },
  {
    action: 'healing',
    title: 'Land Use',
    items: [
      {
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'Land use Map',
        name: 'sdss:ua_lulc',
        legend: false,
        completed: false
      },
      {
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'Soil Map',
        name: 'sdss:ua_soil',
        legend: false,
        completed: false
      },
      {
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'Forest type Map',
        name: 'sdss:ua_forest_fromlulc',
        legend: false,
        completed: false
      },
      {
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'Land Digradation Map',
        name: 'sdss:ua_ldd',
        legend: false,
        completed: false
      },
      {
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'Irrigation Map',
        name: 'sdss:ua_irrigation',
        legend: false,
        completed: false
      }
    ]
  },
  {
    action: 'content_cut',
    title: 'CSSTEAP',
    items: [
      {
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'Forest type Map',
        name: 'sdss:ua_forest_fromlulc',
        legend: false,
        completed: false
      }
    ]
  },
  {
    action: 'local_offer',
    title: 'IIRS',
    items: [
      {
        server: 'https://bis.iirs.gov.in:8443/geoserver',
        type: 'Point',
        title: 'Land use Map',
        name: 'sdss:ua_lulc',
        legend: false,
        completed: false
      }
    ]
  }
];

export default layersData;