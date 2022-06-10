
const ecia = JSON.stringify(localStorage.getItem('ecia'));
window.localStorage.setItem('ecia', ecia.token);

var myHeaders = new Headers();
myHeaders.append("Authorization", "BEARER " + ecia);

var raw = "";

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

// fetch("https://api-ecia.herokuapp.com/api/riwayat", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   result.data.forEach((history) => {
//     // console.log(history);

//     // creating element
//     const trEl = document.createElement("tr");

//     const noTd = document.createElement("td");
//     const namaTd = document.createElement("td");
//     const jenisTransaksiTd = document.createElement("td");
//     const nominalPengeluaranTd = document.createElement("td");
//     const jumlahTopupTd = document.createElement("td");

//     noTd.innerText = index;
//     namaTd.innerText = history.userNama;
//     jenisTransaksiTd.innerText = history.jenisTransaksi;
//     nominalPengeluaranTd.innerText = history.nominalPengeluaran;
//     jumlahTopupTd.innerText = history.jumlahTopup;

//     index++;

//     trEl.append(noTd, namaTd, jenisTransaksiTd, nominalPengeluaranTd, jumlahTopupTd);
//     bodyTableHistory.append(trEl);
//   });
//   .catch(error => console.log('error', error));

fetch("https://api-ecia.herokuapp.com/api/riwayat", requestOptions)
  .then((response) => response.json())
  .then((result) => {
    result.data.forEach((riwayat) => {
      // console.log(history);

      // creating element
      const trEl = document.createElement("tr");

      const jenisTransaksi = document.createElement("td");
      const metodepembayaran = document.createElement("td");
      const waktu = document.createElement("td");
      const total = document.createElement("td");
      // const jumlahTopupTd = document.createElement("td");

      jenisTransaksi.innerText = index;
      metodepembayaran.innerText = riwayat.metodepembayaran;
      waktu.innerText = riwayat.waktu;
      total.innerText = riwayat.total;
      // jumlahTopupTd.innerText = history.jumlahTopup;

      index++;

      trEl.append(jenisTransaksi, metodepembayaran, waktu, total);
      bodyTableriwayat.append(trEl);
    });
  })
  .catch((error) => console.log("error", error));

  