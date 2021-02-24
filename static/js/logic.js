// Store our API endpoint 
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


// Perform a GET request 
d3.json(url, function(data) {
  draw(data);

});

function size(magnitude) {
    return magnitude * 4;
  }
  
    function color(mag) {
        if (mag > 5) {
            return "Crimson";
        }
        if (mag >  4) {
            return "Red";
        }
        if (mag > 3) {
            return "Orange"
        }
        if (mag > 2) {
            return "Pink";
        }
        if (mag > 1) {
            return "Yellow";
        }
        return "LimeGreen";
    }

function draw(earthquakeData) {

    // Define function to determine style of marker.
    function style(feature) {
        return {
            opacity: .65,
            fillOpacity: .55,
            fillColor: color(feature.properties.mag),
            color: "white",
            radius: size(feature.properties.mag),
            stroke: true,
            weight: 0.6
        };
    }

    // Define a function we want to run once for each feature
    // Give each feature a popup
    function onFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + Date(feature.properties.time) + "</p>");
    }

    // Create a GeoJSON layer 

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onFeature,
        pointToLayer: function(feature, latlong) {
            return L.circleMarker(latlong);
        },
        style:style
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend');
        var magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML = "<div style='background-color:white; padding: .5em;'><h4 style='background-color:white; padding:.5em'>Magnitude</h4><ul>";

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML += 
            '<li style=\"list-style:none; padding:.5em; background-color:' + color(magnitude[i] + 1) + ';\"> '+ 
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+')
                "</li>";
        }
    div.innerHTML += "</ul></div>"; 

        return div;
    };

    legend.addTo(myMap);
}