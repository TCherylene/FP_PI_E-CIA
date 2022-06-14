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

// Ambil Data Token
var dataToken = JSON.parse(JSON.parse(parseJwt(ecia))).rows[0]

// Untuk Fetch
var myHeaders = new Headers();

// Ini cocokin dari HTML
const pembayaran = document.querySelector("#pembayaran")
const email = document.querySelector("#email")
const nominal = document.querySelector("#nominal");
const buttonSubmit = document.querySelector("#submit");

// Ini kalo mencet submit
buttonSubmit.addEventListener("click", (e) => {
    e.preventDefault(); // mencegah refresh

    var value = pembayaran.options[pembayaran.selectedIndex].value;

    // ini URL
    var url = "https://api-ecia.herokuapp.com/api/transfer/" 

    if (value == "ecia"){
      // Buat variabel token
      var token = ("Bearer " + ecia).replace(/\"/g, "");
      var url = "https://api-ecia.herokuapp.com/api/transfer"
      var halamanbaru = "ecia.html"
      var method = 'POST'
    }

    if(value == "Moneygo"){
      var token = ("Bearer " + sarah).replace(/\"/g, "");
      console.log(token);
      var url = "https://moneygo-api.herokuapp.com/api/transfer"
      var halamanbaru = "moneygo.html"
      var method = 'PUT'
    }

    // Ini dari postman
    myHeaders.append("Authorization", token);
    myHeaders.append("Content-Type", "application/json");

    // Ini data yang mau dikirimin ke url
    var raw = JSON.stringify({
      email: email.value,
      balance: nominal.value,
      jumlah: nominal.value
    });

    // Ini dari postman
    requestOptions = {
      method: method,
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    console.log(requestOptions)

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
      console.log(data)
      var dataJSON = JSON.parse(data);

      // Ini kalau status nya 200 (berhasil Top Up)
      if(dataJSON.status == 200){
          alert(dataJSON.message)
          location.href=halamanbaru
      }
      
      // Ini kalau status nya 400 (ga berhasil)
      if(dataJSON.status == 400){
          // ini buat ambil data "message" dari hasil fetch
          alert(dataJSON.message)
      }
    };

    // ini buat jalanin getData (Jangan diilangin 3.0)
    getData();
})