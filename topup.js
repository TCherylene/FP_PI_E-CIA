const ecia = JSON.stringify(localStorage.getItem('ecia'));
window.localStorage.setItem('ecia', ecia.token);

var myHeaders = new Headers();
myHeaders.append("Authorization", "BEARER " + ecia);
myHeaders.append("Content-Type", "application/json");
console.log(myHeaders);

var raw = JSON.stringify({
  "jumlah": 80000
});

var requestOptions = {
  method: 'PUT',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api-ecia.herokuapp.com/api/profile/17", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

