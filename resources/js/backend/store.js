import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point';
export const store = {
  state: {
    features: [],
    numbers: [1, 2, 3]
  },
  getFeatures(table) {
  	this.state.numbers.push(6);
    console.log('store', table);
    axios.get('/api/firms/'+table).then((res) => {
      res.data.forEach((item, index) => {
        let geomJsonObj = JSON.parse(item.geomjson);
        //this.vectorSource.addFeature(new Feature(new Point(geomJsonObj.coordinates)));
        this.state.features.push(new Feature({
          data:item,
          geometry: new Point(geomJsonObj.coordinates)
        }));
      });
    });
    // console.log('store.feature', this.state.features)
  }
};