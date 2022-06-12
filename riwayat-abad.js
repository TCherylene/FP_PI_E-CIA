function parseJwt (token) {
  var base64 = token.split('.')[1];
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.stringify(jsonPayload);
};

// Ambil data cookie
const abad = JSON.stringify(localStorage.getItem('abad'));

// Ambil Data Token
var dataToken = JSON.parse(JSON.parse(parseJwt(ecia)))

// Untuk Fetch
var myHeaders = new Headers();

// Buat variabel token
var token = ("Bearer " + abad).replace(/\"/g, "");

// Ini dari postman
myHeaders.append("Authorization", token);
myHeaders.append("Content-Type", "application/json");

// ini URL
var url1 = "https://met4kantin.herokuapp.com/api/history/topup"
var url2 = "https://met4kantin.herokuapp.com/api/profile"

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

  console.log(dataJSON);

  if(dataJSON.status == 400 && dataJSON.message == "User ini belum pernah melakukan topup"){
    saldoAkhir.innerText = 0;
    createTableAbad("-", "-");
  }

  // Ini kalau status nya 200 (berhasil Top Up)
  if(dataJSON.status == 200){
      // Topup
      dataJSON.data.forEach(element => {
        createTableAbad("Top Up", element)
      });
  }
};

// async function getData1(url){
//   let data = await getResponse(url);

//   var dataJSON = JSON.parse(data);
  
//   saldoAkhir.innerHTML = dataJSON.jumlah;
// }

// ini buat jalanin getData (Jangan diilangin 3.0)
getData(url1);
//  getData1(url2);

// Function untuk bikin tabel
function createTableAbad(datacategory, riwayat){
  // creating element
  const trEl = document.createElement("tr");

  const bodyTableriwayat = document.querySelector("#list_status_item_abad")

  const jenisTransaksi = document.createElement("td");
  const metodepembayaran = document.createElement("td");
  const total = document.createElement("td");

  
  if (riwayat == "-"){
    jenisTransaksi.innerText = "-";
    metodepembayaran.innerText = "-";
    total.innerText = "-";
  } else {
    jenisTransaksi.innerText = datacategory;
    metodepembayaran.innerText = "Metakantin";
    total.innerText = riwayat.jumlah.replace('.00', '');
  }

  trEl.appendChild(jenisTransaksi);
  trEl.appendChild(metodepembayaran);
  trEl.appendChild(total);

  bodyTableriwayat.append(trEl);
}