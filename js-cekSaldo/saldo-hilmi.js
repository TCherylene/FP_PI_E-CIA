function parseJwt (token) {
  var base64 = token.split('.')[1];
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.stringify(jsonPayload);
};

// Ambil data cookie
const hilmi = JSON.stringify(localStorage.getItem('hilmi'));

// Ambil Data Token
var dataToken = JSON.parse(JSON.parse(parseJwt(hilmi)))

// Untuk Fetch
var myHeaders = new Headers();

// Buat variabel token
var token = ("Bearer " + hilmi).replace(/\"/g, "");

// Ini dari postman
myHeaders.append("Authorization", token);
myHeaders.append("Content-Type", "application/json");

// Ini cocokin dari HTML  
const saldo = document.querySelector("#saldoku")
const wallet = document.querySelector("#walletku")

// ini URL
var url = "https://egilwallet.herokuapp.com/api/profile" 
// var url = "http://localhost:8000/api/profile/" 

// Ini data yang mau dikirimin ke url
var raw = "";


// Ini dari postman
var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  // body: raw,
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
  var dataJSON =JSON.parse(data);

  var saldokita = dataJSON.balance
  saldo.innerText = saldokita

  // Ini kalau status nya 400 (ga berhasil)
  if(dataJSON.status == 400){
      // ini buat ambil data "message" dari hasil fetch
      alert(dataJSON.message);
  }
};

// ini buat jalanin getData (Jangan diilangin 3.0)
getData();