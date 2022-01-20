mapboxgl.accessToken = mapToken;//ojo: solo podemos accedes a variables de entorno en EJS: no en nuestros js
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center:campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
            .setHTML(`<h3>${campground.title}</h3>`)
    )
    .addTo(map)

