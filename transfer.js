var url = "https://api-ecia.herokuapp.com/api/login";

var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dzIjpbeyJpZF9jbGllbnQiOjIsIm5hbWFfY2xpZW50IjoiQWxkYSIsImVtYWlsIjoiYWxkYUBhbGRhLmNvbSIsInBhc3N3b3JkIjoiMTIzNCIsIm5vbW9yX3dhbGxldCI6IjIwYzdkZDYzN2JjZGVlZjQzMzU4OWQxMzIxZjUyMzYzIiwicm9sZSI6MX1dLCJpYXQiOjE2NTQ0MjA0MzR9.5wW95Jwhpp6cf2SU1CBNfokjIoM-UiL8N3KYcZz_ixk");
myHeaders.append("Content-Type", "application/json");

const email = document.querySelector("#email");
const password = document.querySelector("#password");
const buttonSubmit = document.querySelector("#submit");

buttonSubmit.addEventListener("click", (e) => {
    e.preventDefault(); // mencegah refresh

var raw = JSON.stringify({
  email: email.value,
  jumlah: jumlah.value
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