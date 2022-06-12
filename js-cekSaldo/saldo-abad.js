function parseJwt (token) {
  var base64 = token.split('.')[1];
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.stringify(jsonPayload);
};

// Ambil data cookie
const ecia = JSON.stringify(localStorage.getItem('ecia'));
const abad = JSON.stringify(localStorage.getItem('abad'));
const sarah = JSON.stringify(localStorage.getItem('sarah'));

// Ambil Data Token
var dataToken = JSON.parse(JSON.parse(parseJwt(abad)))

// Untuk Fetch
var myHeaders = new Headers();

// Buat variabel token
var token = ("Bearer " + abad).replace(/\"/g, "");

// Ini dari postman
myHeaders.append("Authorization", token);
myHeaders.append("Content-Type", "application/json");

// Ini cocokin dari HTML
const idku = document.querySelector("#Idku")
const saldo = document.querySelector("#saldoku")
const wallet = document.querySelector("#walletku")

// ini URL
var url = "https://met4kantin.herokuapp.com/api/profile/" 
// var url = "http://localhost:8000/api/profile/" 

// Ini data yang mau dikirimin ke url
var raw = "";

// Ini dari postman
var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

// Ini buat nge fetch (JANGAN Diilangin)
async function getResponse(){
  try {
      let res = await fetch(url, requestOptions)
      console.log("Fetch berhasil");
      return await (res.text());
  } catch(error) {
      console.log('error', error)
  };
}

// Ini buat setelah nge fetch (JANGAN diilangin 2.0)
async function getData(){
  let data = await getResponse();
  var dataJSON =JSON.parse(data).data;

  var idkita = dataToken.id
  idku.innerText = idkita

  var saldokita = dataJSON.cash
  saldo.innerText = saldokita

  var walletkita = dataJSON.uid
  wallet.innerText = walletkita
  
  // Ini kalau status nya 400 (ga berhasil)
  if(dataJSON.status == 400){
      // ini buat ambil data "message" dari hasil fetch
      alert(dataJSON.message);
  }
};

// ini buat jalanin getData (Jangan diilangin 3.0)
getData();