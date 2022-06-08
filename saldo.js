
const ecia = JSON.stringify(localStorage.getItem('ecia'));
window.localStorage.setItem('ecia', ecia.token);

var myHeaders = new Headers();
myHeaders.append("Authorization", "BEARER " + ecia);
myHeaders.append("Content-Type", "application/json");
window.localStorage.setItem('ecia', dataJSON.token);

var raw = "";

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
  
};

fetch("https://api-ecia.herokuapp.com/api/profile/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));