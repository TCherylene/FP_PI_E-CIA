var urlEcia = "https://api-ecia.herokuapp.com/api/profile";
// var url = "http://localhost:8000/api/login";
var urlSarah = "https://https://moneygo-api.herokuapp.com/api/register"
var urlAbad = "https://met4kantin.herokuapp.com/api/profile"

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const buttonSubmit = document.querySelector("#submit");

buttonSubmit.addEventListener("click", (e) => {
    e.preventDefault(); // mencegah refresh
    
    const nama =  document.querySelector("#name");
    const email = document.querySelector("#email");
    const pass = document.querySelector("#pass");

    var raw = JSON.stringify({
        name: nama.value,
        email: email.value,
        pass: pass.value
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    var raw2 = JSON.stringify({
        name: nama.value,
        email: email.value,
        password: pass.value,
        balance: 10000
    });

    var requestOptions2 = {
        method: 'POST',
        headers: myHeaders,
        body: raw2,
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

    async function getResponse2(url){
        try {
            let res = await fetch(url, requestOptions2)
            console.log("Fetch berhasil");
            return await (res.text());
        } catch(error) {
            console.log('error', error)
        };
    }

    async function getData(){
        let dataEcia = await getResponse(urlEcia);
        let dataSarah = await getResponse2(urlSarah);
        let dataAbad = await getResponse(urlAbad);

        var dataJSONEcia = JSON.parse(dataEcia);
        var dataJSONSarah = JSON.parse(dataSarah);
        var dataJSONAbad = JSON.parse(dataAbad);
        
        if(dataJSONEcia.status == 200 && dataJSONAbad.status == 200 && dataJSONSarah.status == 200){
            window.location.href = "login.html";
        }

        if(dataJSON.status == 400 && dataJSONAbad.status == 400 && dataJSONSarah.status == 400){
            alert(dataJSON.message);
        }
    };

    getData();
})