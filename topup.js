// function parseJwt(token) {
//     var base64Payload = token.split('.')[1];
//     var payload = from(base64Payload, 'base64');
//     return JSON.parse(payload.toString()).rows[0];
// }

// const parseJwt = require("./parsejwt");

// const jwt_decode = require('jwt-decode')
require([
  "./parsejwt"
])
const ecia = JSON.stringify(localStorage.getItem('ecia'));
console.log(ecia)
// window.localStorage.setItem('ecia', ecia.token);
var dataToken = parsejwt(ecia)
console.log(dataToken)
var url = "http://localhost:8000/api/profile/";

var myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${ecia}`);

var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer " + ecia);
myHeaders.append("Content-Type", "application/json");

const id_user = document.querySelector("#id_user");
const nominal = document.querySelector("#nominal");
const buttonSubmit = document.querySelector("#submit");


buttonSubmit.addEventListener("click", (e) => {
    e.preventDefault(); // mencegah refresh

    var raw = JSON.stringify({
      jumlah: nominal.value
    });
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch(url, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    async function getData(){
        let data = await getResponse();

        var dataJSON = JSON.parse(data);
        
        if(dataJSON.status == 200){
            window.localStorage.setItem('ecia', dataJSON.token);
            window.location.href = "home.html";
        }

        if(dataJSON.status == 400){
            alert("Terdapat kesalahan silahkan coba lagi");
        }
    };

    getData();
})
