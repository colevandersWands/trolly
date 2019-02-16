// client-side js
// run by the browser each time your view template referencing it is loaded

let datapoints = [];

// define variables that reference elements on our page
const datapointsList = document.getElementById('datapoints');
const datapointsForm = document.forms[0];
const datapointInput = datapointsForm.elements['datapoint'];

// a helper function to call when our request for datapoints is done
const getDatapointsListener = function() {
  // parse our response to convert to JSON
  datapoints = JSON.parse(this.responseText);

  // iterate through every datapoint and add it to our page
  datapoints.forEach( function(row) {
    appendNewDatapoint(row.datapoint);
  });
}

const addDatapointListener = function() {
  // parse our response to convert to JSON
  console.log(this.responseText);
}

// request the datapoints from our app's sqlite database
const datapointRequest = new XMLHttpRequest();
datapointRequest.onload = getDatapointsListener;
datapointRequest.open('get', '/getDatapoints');
datapointRequest.send();
  
const datapointAddRequest = new XMLHttpRequest();
datapointAddRequest.onload = addDatapointListener;
// assumed it went through...

// a helper function that creates a list item for a given datapoint
const appendNewDatapoint = function(datapoint) {
  const newListItem = document.createElement('li');
  newListItem.innerHTML = datapoint;
  datapointsList.appendChild(newListItem);
}

// listen for the form to be submitted and add a new datapoint when it is
datapointsForm.onsubmit = function(event) {
  // stop our form submission from refreshing the page
  event.preventDefault();

  // get datapoint value and add it to the list
  datapoints.push(datapointInput.value);
  appendNewDatapoint(datapointInput.value);
  //datapointAddRequest.open('get', '/addDatapoint', {datapoint: datapointInput.value} );
  datapointAddRequest.open('get', '/addDatapoint' + "?datapoint=" + encodeURIComponent(datapointInput.value), true );
  datapointAddRequest.send();

  // reset form 
  datapointInput.value = '';
  datapointInput.focus();
};
