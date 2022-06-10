var url = "https://api-ecia.herokuapp.com/api/login";
const ecia = JSON.stringify(localStorage.getItem('ecia'));
window.localStorage.setItem('ecia', ecia.token);


var myHeaders = new Headers();
myHeaders.append("Authorization", "BEARER " + ecia);
myHeaders.append("Content-Type", "application/json");

const email = document.querySelector("#email");
const nominal = document.querySelector("#nominal");
const buttonSubmit = document.querySelector("#submit");

buttonSubmit.addEventListener("click", (e) => {
    e.preventDefault(); // mencegah refresh

var raw = JSON.stringify({
  email: email.value,
  nominal: nominal.value
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