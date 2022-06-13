var urlEcia = "https://api-ecia.herokuapp.com/api/profile";
// var url = "http://localhost:8000/api/login";
var urlSarah = "https://moneygo-api.herokuapp.com/api/register"
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
        password: pass.value,
        pass: pass.value,
        balance: 1
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
        
        if(dataJSONEcia.status == 200 && dataJSONAbad.status == 200 && dataJSONSarah.status == 200){
            alert("Pendaftaran berhasil. Silahkan login.")
            window.location.href = "login.html";
        }

        if(dataJSONEcia.status == 400 && dataJSONAbad.status == 400 && dataJSONSarah.status == 400){
            if (dataJSONEcia.status == 400){
                alert(dataJSONEcia.message)
            }
            
            if (dataJSONAbad.status == 400){
                alert(dataJSONAbad.message)
            }

            if (dataJSONSarah.status == 400){
                alert(dataJSONSarah.message)
            }
        }
    };

    getData();
})