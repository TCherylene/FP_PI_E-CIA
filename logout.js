// ambil cookie
const ecia = JSON.stringify(localStorage.getItem('ecia'));
if(ecia == null|| !ecia || ecia == undefined){
  window.location.href = "awal.html"
}

const logout = document.querySelector("#logout")

logout.addEventListener("click", (e) => {
    window.localStorage.clear()
    window.location.href = "awal.html"
})