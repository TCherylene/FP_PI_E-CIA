var url = "https://api-ecia.herokuapp.com/api/login";

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

    async function getResponse(){
        try {
            let res = await fetch(url, requestOptions)
            return await (res.text());
        } catch(error) {
            console.log('error', error)
        };
    }

    async function getData(){
        let data = await getResponse();
        var dataJSON = JSON.parse(data);

        window.localStorage.setItem('ecia', dataJSON.token);
    };

    getData()

})