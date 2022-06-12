var urlEcia = "https://api-ecia.herokuapp.com/api/login";
// var url = "http://localhost:8000/api/login";
var urlSarah = "https://https://moneygo-api.herokuapp.com/api/login"
var urlAbad = "https://met4kantin.herokuapp.com/api/login"

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const email = document.querySelector("#email");
const password = document.querySelector("#password");
const buttonSubmit = document.querySelector("#submit");

// email.innerText = (nilai yang mau ditampilkan disini) harus dideklrasi terlebih dahulu 

buttonSubmit.addEventListener("click", (e) => {
    e.preventDefault(); // mencegah refresh

    var raw = JSON.stringify({
        email: email.value,
        pass: password.value
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    async function getResponse(url){
        try {
            let res = await fetch(url, requestOptions)
            console.log("Fetch berhasil");
            return await (res.text());
        } catch(error) {
            console.log('error', error)
        };
    }

    async function getData(){
        let dataEcia = await getResponse(urlEcia);
        let dataSarah = await getResponse(urlSarah);
        let dataAbad = await getResponse(urlAbad);

        var dataJSONEcia = JSON.parse(dataEcia);
        var dataJSONSarah = JSON.parse(dataSarah);
        var dataJSONAbad = JSON.parse(dataAbad);
        
        if(dataJSONEcia.status == 200 && dataJSONSarah.status == 200 && dataAbad){
            window.localStorage.setItem('ecia', dataJSONEcia.token);
            window.localStorage.setItem('sarah', dataJSONSarah.token);
            window.localStorage.setItem('abad', dataJSONAbad.token);
            window.location.href = "home.html";
        }

        if(dataJSONEcia.status == 400 || dataJSONSarah.status == 400 || dataJSONAbad.status == 400){
            alert("Terdapat kesalahan silahkan coba lagi");
        }
    };

    getData();
})