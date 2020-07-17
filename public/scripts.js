// Run function checkItem on click of 'submit' button
document.getElementById('submit').addEventListener('click', checkItem);

// RegExp for userInput Variable
function stringCheck(str){
  var remove = /[\W_]/g;
  var lowerStr = str.toLowerCase().replace(remove, '');
  return lowerStr;
}

// Function to create HTML element
const createNode = (element) => {
  return document.createElement(element);
};

// Function to insert HTML elements appropriately
const append = (parent, child) => {
  return parent.appendChild(child);
};

/* Function that converts user input, uses that input to fetch the appropriate
API, and assign the returned objects data to the correct HTML elements */
function checkItem(event){
  reset();
  const userInput = document.getElementById('searchbar').value;
  let endPoint = stringCheck(userInput);
  event.preventDefault();
  fetch(`http://localhost:5000/api/items/${endPoint}`)
  .then((res) => res.json())
  .then((data) => {
    const array = [data];
    return array.map((item) =>{
      let itemBox = createNode('div');
      let name = createNode('h3');
      let description = createNode('p');
  
      name.innerText = `${item.name}`;
      description.innerText = `${item.description}`;
  
      append(resultBox, itemBox);
      append(itemBox, name);
      append(itemBox, description);
    
    });
         
  })
  .catch((err) => {
    alert('No matching results! Please try again.');
    console.log(err);
  });
}

// Function to reset the innerHTML set up by the previous function
function reset(){
  document.getElementById('resultBox').innerHTML = '';
}

/*********** GOOGLE MAP AND PLACES API CODE ****************/
var map, infoWindow;

// Initialize map values
function createMap () {
  var options = {
    center: { lat: 43.654, lng: -79.383 },
    zoom: 10
  };

  /* Create a new map and set the 'options' properties based on the geolocation api 
  from google */
  map = new google.maps.Map(document.getElementById('map'), options);
  infoWindow = new google.maps.InfoWindow;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (p) {
      var position = {
        lat: p.coords.latitude,
        lng: p.coords.longitude
      };

      infoWindow.setPosition(position);
      infoWindow.setContent('Your location!');
      infoWindow.open(map);
      map.setCenter(position);
    }, function () {
      handleLocationError('Geolocation service failed', map.getCenter());
    });
  } else {
    handleLocationError('No geolocation available.', map.getCenter());
  }

  // Takes in User input and sets the search value on the Places API
  var input = document.getElementById('search');
  var searchBox = new google.maps.places.SearchBox(input);

  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  // Empty array of map markers is initialized
  var markers = [];
  
  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();

    if (places.length == 0)
      return;

    markers.forEach(function (m) { m.setMap(null); });
    markers = [];

    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(p) {
      if (!p.geometry)
        return;

      // Placing new map markers into the Markers Array
      markers.push(new google.maps.Marker({
        map: map,
        title: p.name,
        position: p.geometry.location
      }));

      // Expand and contract the zoom level of map depending on marker placement
      if (p.geometry.viewport)
        bounds.union(p.geometry.viewport);
      else
        bounds.extend(p.geometry.location);
    });
    
    map.fitBounds(bounds);
  });
  
}

function handleLocationError (content, position) {
  infoWindow.setPosition(position);
  infoWindow.setContent(content);
  infoWindow.open(map);
}






  