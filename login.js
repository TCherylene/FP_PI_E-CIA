var urlEcia = "https://api-ecia.herokuapp.com/api/login";
// var url = "http://localhost:8000/api/login";
var urlSarah = "https://moneygo-api.herokuapp.com/api/login"
var urlAbad = "https://met4kantin.herokuapp.com/api/login"
var urlHilmi = "https://egilwallet.herokuapp.com/api/login"

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const email = document.querySelector("#email");
const password = document.querySelector("#password");
const buttonSubmit = document.querySelector("#submit");

buttonSubmit.addEventListener("click", (e) => {
    e.preventDefault(); // mencegah refresh

    var raw = JSON.stringify({
        email: email.value,
        password: password.value,
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
        let dataHilmi = await getResponse(urlHilmi);
        
        console.log(dataSarah)

        var dataJSONEcia = JSON.parse(dataEcia);
        var dataJSONSarah = JSON.parse(dataSarah);
        var dataJSONAbad = JSON.parse(dataAbad);
        var dataJSONHilmi = JSON.parse(dataHilmi);
        
        if(dataJSONEcia.status == 200 && dataJSONAbad.status == 200 && dataJSONSarah.success == true && dataJSONHilmi.status == 200){
            window.localStorage.setItem('abad', dataJSONAbad.jwt);
            window.localStorage.setItem('ecia', dataJSONEcia.token);
            window.localStorage.setItem('sarah', dataJSONSarah.token);
            window.localStorage.setItem('hilmi', dataJSONHilmi.accesToken);
                    
            window.location.href = "home.html";
        }

        if(dataJSONEcia.status == 400 || dataJSONSarah.error == true || dataJSONAbad.status == 400 || dataJSONHilmi.status == 400){
            if (dataJSONEcia.status == 400){
                alert(dataJSONEcia.message)
            }
            
            if (dataJSONAbad.status == 400){
                alert(dataJSONAbad.message)
            }

            if (dataJSONSarah.status == 400){
                alert(dataJSONSarah.message)
            }

            if (dataJSONHilmi.status == 400){
                alert(dataJSONHilmi.message)
            }
        }
    };

    getData();
})