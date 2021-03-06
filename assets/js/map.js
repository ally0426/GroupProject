'use strict';

let map;
let infoWindow;
let request;
let service;
let markers = [];
let marker;
let pos;
let newRequest;

function initialize() {

    // definitions
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 44.986656, lng: -93.258133},
        zoom: 13,
    });
    infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);

    // init nearbySearch
    function callback(results, status) {
        if(status == google.maps.places.PlacesServiceStatus.OK){
            for (var i = 0; i < results.length; i++){
                markers.push(createMarker(results[i]));
            }
        }
    }
    //finds the type of place once the user location is determined
    request = {
        location: map.getCenter(),
        radius: 10000,
        types: ['bar'],
        types: ['restaurant']
    };
    // service.nearbySearch(request, callback);

    // recenter map around user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            infoWindow.setPosition(pos);
            map.setCenter(pos);

            newRequest = {
                location: pos,
                radius: 10000,
                types: ['bar'],
                types: ['restaurant']
            };
            service.nearbySearch(newRequest, callback);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
        }

    // recenter the map and reload the places after the map has been dragged and released
    map.addListener('dragend', function() {
        // google.maps.event.addListener(map, 'dragend', function(event) {

        console.log(event);
        map.getCenter()
        console.log(map.getCenter());
        clearResults(markers)
        let request = {
            location: map.getCenter(),
            radius: 5000,
            types: ['restaurant']
        };
        service.nearbySearch(request, callback);
    })
}
// function callback(results, status) {
//     if(status == google.maps.places.PlacesServiceStatus.OK){
//         for (var i = 0; i < results.length; i++){
//             markers.push(createMarker(results[i]));
//         }
//     }
// }



//creates a marker for the places
function createMarker(place) {
    //customization of the icon happens at this line
    let iconImage    = new google.maps.MarkerImage(place.icon, null, null, null, new google.maps.Size(32, 32));
    const placeLoc = place.geometry.location;
    marker = new google.maps.Marker({
        map: map,
        icon: iconImage,
        position: place.geometry.location
    });
    //opens the infoWindow to show name and other information
    google.maps.event.addDomListener(marker, 'click', function() {
        infoWindow.setContent(place.name + '<br>Are they open now ' + place.opening_hours.open_now + '<br>Price Level ' + place.price_level + '<br>' + place.place_id + '<br>Rating Level ' + place.rating + '<br>Photos ' + place.photos[0].html_attributions[0]);
        infoWindow.open(map, this);
        console.log(place);

    });
    return marker;
}
//clears the markers when the map is moved so we don't keep leaving more and more markers
function clearResults(markers) {
    for (let m in markers) {
        markers[m].setMap(null)
    }
    markers = []
}
google.maps.event.addDomListener(window, 'load', initialize);