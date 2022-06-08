//pembayaran
const ecia = JSON.stringify(localStorage.getItem('ecia'));
window.localStorage.setItem('ecia', ecia.token);

var myHeaders = new Headers();
myHeaders.append("Authorization", "BEARER " + ecia);
myHeaders.append("Content-Type", "application/json");

const jumlah = document.querySelector("#jumlah");
// const nomor_wallet_client = document.querySelector("#no_wallet_client");
// const nomor_wallet_ecommerce = document.querySelector("#no_wallet_ecomerc");
const buttonSubmit = document.querySelector("#submit");

buttonSubmit.addEventListener("click", (e) => {
  e.preventDefault(); // mencegah refresh

var raw = "";

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api-ecia.herokuapp.com/api/pembelian/6", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

//Transaksi

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  jumlah: jumlah.value,
  nomor_wallet_client: walletClient.value,
  nomor_wallet_ecommerce: wallet.value,
  referensi: referensi.value
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api-ecia.herokuapp.com/api/transaksi", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

})