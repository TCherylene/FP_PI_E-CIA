function parseJwt (token) {
  var base64 = token.split('.')[1];
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.stringify(jsonPayload);
};

const ecia = JSON.stringify(localStorage.getItem('ecia'));

// Ambil Data Token
var dataToken = JSON.parse(JSON.parse(parseJwt(ecia))).rows[0]

// Untuk Fetch
var myHeaders = new Headers();

var token = ("Bearer " + ecia).replace(/\"/g, "");

myHeaders.append("Authorization", token);
myHeaders.append("Content-Type", "application/json");

const id_user = document.querySelector("#id_user")
const nominal = document.querySelector("#nominal");
const buttonSubmit = document.querySelector("#submit");

buttonSubmit.addEventListener("click", (e) => {
    e.preventDefault(); // mencegah refresh

    var url = "http://localhost:8000/api/profile/" + id_user.value
    console.log(url)

    var raw = JSON.stringify({
      jumlah: nominal.value
    });
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    async function getResponse(){
      try {
          let res = await fetch(url, requestOptions)
          console.log("Fetch berhasil");
          return await (res.text());
      } catch(error) {
          console.log('error', error)
      };
    }

    async function getData(){
      let data = await getResponse();

      var dataJSON = JSON.parse(data);

      if(dataJSON.status == 200){
          alert("Transfer berhasil")
      }

      if(dataJSON.status == 400){
          alert(dataJSON.message);
      }
    };

    getData();
})
