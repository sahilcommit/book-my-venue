mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // ID of the div
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: listing.geometry.coordinates, // [longitude, latitude]
    zoom: 9 // starting zoom
});

// Create a marker and add it to the map
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.title}</h4><p>Exact location provided after booking</p>`))
    .addTo(map);