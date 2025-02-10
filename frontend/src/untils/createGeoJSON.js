export const createGeoJSONCircle  = (center, radiusInKm, points) => {
    if(!points) points = 64;
    var coords = {
        latitude: center[1],
        longitude: center[0]
    };
    var km = radiusInKm;
    var ret = [];
    var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
    var distanceY = km/110.574;

    var theta, x, y;
    for(var i=0; i<points; i++) {
        theta = (i/points)*(2*Math.PI);
        x = distanceX*Math.cos(theta);
        y = distanceY*Math.sin(theta);

        ret.push([coords.longitude+x, coords.latitude+y]);
    }
    ret.push(ret[0]);
    return {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [ret]
        }
    };
}
