function parseJwt (token) {
  var base64 = token.split('.')[1];
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.stringify(jsonPayload);
};

// Ambil data cookie
const ecia = JSON.stringify(localStorage.getItem('ecia'));
if(ecia==null||!ecia){
  window.location.href = "login.html"
 }

// Ambil Data Token
var dataToken = JSON.parse(JSON.parse(parseJwt(ecia))).rows[0]

// Untuk Fetch
var myHeaders = new Headers();

// Buat variabel token
var token = ("Bearer " + ecia).replace(/\"/g, "");

// Ini dari postman
myHeaders.append("Authorization", token);
myHeaders.append("Content-Type", "application/json");

// Ini cocokin dari HTML
const saldoAkhir = document.querySelector("#saldoAkhir")

// ini URL
var url1 = "https://api-ecia.herokuapp.com/api/riwayat"
var url2 = "https://api-ecia.herokuapp.com/api/profile"
// var url1 = "http://localhost:8000/api/riwayat"
// var url2 = "http://localhost:8000/api/profile"

// Ini dari postman
var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

// Ini buat nge fetch (JANGAN Diilangin)
async function getResponse(url){
  try {
      let res = await fetch(url, requestOptions)
      console.log("Fetch berhasil");
      return await (res.text());
  } catch(error) {
      console.log('error', error)
  };
}

// Ini buat setelah nge fetch (JANGAN diilangin 2.0)
async function getData(url){
  let data = await getResponse(url);

  var dataJSON = JSON.parse(data);

  if(dataJSON.status == 200 && dataJSON.message == "User belum pernah melakukan transaksi"){
    saldoAkhir.innerText = 0;
    createTableEcia("-", "-");
  }

  // Ini kalau status nya 200 (berhasil Top Up)
  if(dataJSON.status == 200){
    // Top Up
    if (dataJSON.topup != null){
      dataJSON.topup.forEach(element => {
        createTableEcia("Top Up", element)
      });
    }

    // Pembelian / bayar
    if (dataJSON.bayar != null){
      dataJSON.bayar.forEach(element => {
        createTableEcia("Pembelian", element)
      });
    }

    // Transfer
    if (dataJSON.transfer != null){
      dataJSON.transfer.forEach(element => {
        createTableEcia("Transfer", element)
      });
    }
  }
  
  // Ini kalau status nya 400 (ga berhasil)
  if(dataJSON.status == 400){
      // ini buat ambil data "message" dari hasil fetch
      alert(dataJSON.message)
  }
};

async function getData1(url){
  let data = await getResponse(url);

  var dataJSON = JSON.parse(data);
  
  saldoAkhir.innerHTML = dataJSON.jumlah;
}

// ini buat jalanin getData (Jangan diilangin 3.0)
getData(url1);
getData1(url2);

// Function untuk bikin tabel
function createTableEcia(datacategory, riwayat){
  // creating element
  const trEl = document.createElement("tr");

  const bodyTableriwayat = document.querySelector("#list_status_item_ecia")

  const jenisTransaksi = document.createElement("td");
  const metodepembayaran = document.createElement("td");
  const total = document.createElement("td");

  
  if (riwayat == "-"){
    jenisTransaksi.innerText = "-";
    metodepembayaran.innerText = "-";
    total.innerText = "-";
  } else {
    jenisTransaksi.innerText = datacategory;
    metodepembayaran.innerText = "E-CIA";
    total.innerText = riwayat.nominal;
  }

  trEl.appendChild(jenisTransaksi);
  trEl.appendChild(metodepembayaran);
  trEl.appendChild(total);

  bodyTableriwayat.append(trEl);
}