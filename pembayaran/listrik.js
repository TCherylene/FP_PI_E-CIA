function parseJwt (token) {
  var base64 = token.split('.')[1];
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.stringify(jsonPayload);
};

// Ambil data cookie
const ecia = JSON.stringify(localStorage.getItem('ecia'));
const sarah = JSON.stringify(localStorage.getItem('sarah'));
const abad = JSON.stringify(localStorage.getItem('abad'));

// Untuk Fetch
var myHeaders = new Headers();

// Ini dari postman
myHeaders.append("Authorization", token);
myHeaders.append("Content-Type", "application/json");

// Ini cocokin dari HTML
const pembayaran = document.querySelector("#pembayaran");
const id_user = document.querySelector("#pembayaranku");
const nominal = document.querySelector("#nominalku");
const buttonSubmit = document.querySelector("#bayar");

buttonSubmit.addEventListener("click", (e) => {
    // ini URL
    e.preventDefault();

    var value = pembayaran.options[pembayaran.selectedIndex].value;
    console.log(value)
      
    // ini URL
    if (value == "ecia"){
      // Buat variabel token
      var token = ("Bearer " + ecia).replace(/\"/g, "");
      var url = "https://api-ecia.herokuapp.com/api/profile/" + id_user.value
      var halamanbaru = "../ecia.html"
      var dataToken = JSON.parse(JSON.parse(parseJwt(ecia))).rows[0]

      var raw2 = JSON.stringify({
        jumlah: nominal.value,
        nomor_wallet_client: dataToken.nomor_wallet,
        nomor_wallet_ecommerce: "blablbalbla",
        referensi: dataJSON.id_pemesanan
      });

      var requestOptions2 = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    }

    if(value == "Metakantin"){
      var token = ("Bearer " + abad).replace(/\"/g, "");
      var url = "https://met4kantin.herokuapp.com/api/pay/"
      var halamanbaru = "../metakantin.html"
      var dataToken = JSON.parse(JSON.parse(parseJwt(abad)))
    }

    // if(value == "Moneygo"){
    //   var token = ("Bearer " + sarah).replace(/\"/g, "");
    //   var url = "https://moneygo-api.herokuapp.com/api/topup"
    //   var halamanbaru = "moneygo.html"
    //   var dataToken = JSON.parse(JSON.parse(parseJwt(sarah)))
    // }

    // Ini dari postman
    myHeaders.append("Authorization", token);
    myHeaders.append("Content-Type", "application/json");


    // Ini data yang mau dikirimin ke url
    var raw = JSON.stringify({
      id_user: dataToken.id_user,
      nama_barang : "listrik",
      jumlah: nominal.value, 
      harga: nominal.value ,
      nomor_wallet: dataToken.nomor_wallet
    });
  
    // Ini dari postman
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    // Ini buat nge fetch (JANGAN Diilangin)
    async function getResponse(url, requestOptions){
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
      let data = await getResponse(url, requestOptions);

      var dataJSON = JSON.parse(data);

      // Ini kalau status nya 200 (berhasil bayar)
      if(dataJSON.status == 200){
        if(value == "ecia"){
          let dataTransaksiEcia = await getResponse(url, requestOptions2);

          var dataJSONTransaksiEcia = JSON.parse(dataTransaksiEcia);

          if(dataJSONTransaksiEcia.status == 200){
            window.location.href = halamanbaru
          } else {
            alert("Terjadi kesalahan. Silahkan coba lagi");
            window.location.href = "listrik.html"
          }
        }

        window.location.href = halamanbaru
      }
      
      // Ini kalau status nya 400 (ga berhasil)
      if(dataJSON.status == 400){
          alert(dataJSON.message);
      }
    };

    // ini buat jalanin getData (Jangan diilangin 3.0)
    getData();
  }
)