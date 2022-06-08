
const ecia = JSON.stringify(localStorage.getItem('ecia'));
window.localStorage.setItem('ecia', ecia.token);

var myHeaders = new Headers();
myHeaders.append("Authorization", "BEARER " + ecia);

var raw = "";

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api-ecia.herokuapp.com/api/riwayat", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));