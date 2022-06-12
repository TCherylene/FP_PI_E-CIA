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
var token = ("Bearer " + abad).replace(/\"/g, "");

// Ini dari postman
myHeaders.append("Authorization", token);
myHeaders.append("Content-Type", "application/json");

// Ini cocokin dari HTML
const id_user = document.querySelector("#id_user")
const nominal = document.querySelector("#nominal");
const buttonSubmit = document.querySelector("#submit");

// Ini kalo mencet submit
buttonSubmit.addEventListener("click", (e) => {
    e.preventDefault(); // mencegah refresh

    // ini URL
    var url  = "https://met4kantin.herokuapp.com/api/profile/:user" 

    // Ini data yang mau dikirimin ke url
    var raw = JSON.stringify({
      jumlah: nominal.value
    });
    
    // Ini dari postman
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
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

      var dataJSON = JSON.parse(data);

      // Ini kalau status nya 200 (berhasil Top Up)
      if(dataJSON.status == 200){
          alert("Top Up berhasil")
          location.href="saldo2.html"
      }
      
      // Ini kalau status nya 400 (ga berhasil)
      if(dataJSON.status == 400){
          // ini buat ambil data "message" dari hasil fetch
          alert(dataJSON.message);
          location.href="topup.html"
      }
    };

    // ini buat jalanin getData (Jangan diilangin 3.0)
    getData();
})