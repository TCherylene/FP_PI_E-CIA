// ambil cookie
const logout = document.querySelector("#logout")

logout.addEventListener("click", (e) => {
    window.localStorage.clear()
    window.location.href = "awal.html"
})