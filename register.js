var url = "http://localhost:8000/api/profile";

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const nama =  document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const buttonSubmit = document.querySelector("#submit");


// email.innerText = (nilai yang mau ditampilkan disini) harus dideklrasi terlebih dahulu 

buttonSubmit.addEventListener("click", (e) => {
    e.preventDefault(); // mencegah refresh

    var raw = JSON.stringify({
        name: nama.value,
        email: email.value,
        pass: password.value
    });

    var requestOptions = {
        method: 'POST',
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
            window.location.href = "login.html";
        }

        if(dataJSON.status == 400){
            alert(dataJSON.message);
        }
    };

    getData();
})