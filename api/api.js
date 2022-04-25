var express = require('express')
var bodyParser = require('body-parser')
var app =  express();
var jsonParser = bodyParser.json()
const jwt = require('jsonwebtoken');

const users = [
    {id:1, username: "John", password: "John123", saldo:100},
    {id:2, username: "Marie", password: "Marie123", saldo: 200},
    {id:3, username: "Claire", password: "Claire123", saldo: 300}
]

// Verify Token
function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1]
        req.token = bearerToken
        next()
    }else{
        res.status(403).send("Forbidden")
    }
}

//GET Method
app.get ('/', (req,res) => {
    res.send('hello world');
});

// POST - REGISTER - USERusername & PASS
app.post('/api/register', jsonParser, function (req,res) {
    //to add a new users, input a username
    if(!req.body.username || req.body.username.length < 3){
        //400 bad request
        res.status(400).send('username is too short');
    };

    //no password
    if(!req.body.password){
        //400 bad request
        res.status(400).send("Please input password");
    }

    //id will be automatically added
    new_id = users.length + 1

    //response format from server (in json)
    const user = {
        id: new_id,
        username: req.body.username,
        password: req.body.password,
        saldo: 0
    };

    const message = "Username atas nama " + users.user + " berhasil didaftarkan";

    //adding the new users
    users.push(user);
    res.send({message: message});
});

// POST - LOGIN - USERNAME & PASS
app.post('/api/login', jsonParser, function(req, res){
    if(!req.body.username || !req.body.password){
       return res.send({message: "Please enter both username and password"});
    } 

    const user = {
        username: req.body.username,
        password: req.body.password
    };

    const checkUser = users.find(u => user.username === u.username)
    if(!checkUser){
        res.send({message:"User not found"})
    }
 });

// POST Login
// app.post('/login', jsonParser, function(req, res){
//     console.log(users);
//     if(!req.body.id || !req.body.password){
//         res.render('login', {message: "Please enter both id and password"});
//     } else {
//         users.filter(function(user){
//             if(user.id === req.body.id && user.password === req.body.password){
//                 req.session.user = user;
//             }
//         });
//         res.render('login', {message: "Invalid credentials!"});
//     }
// });

// GET - CEK SALDO
// app.get('/api/saldo', verifyToken, (req, res) =>{
//     jwt.verify(req.token, 'secret', (err, authData) =>{
//         if(err){
//             res.status(403).send("Forbidden")
//         }else{
//             //tulis di sini
//         }
//     })
// });

// GET - CEK SALDO - Without Authentication
app.get('/api/saldo/:id', (req,res) => {
    const user = users.find(u => u.id == parseInt(req.params.id));
    if(!user){
        res.send('The ID was not found')
    };

    res.send({  username: user.username, 
                saldo: user.saldo
            })
});

// // POST - TOP UP - JUMLAH
// app.post('/api/topup', verifyToken, (req, res) =>{
//     jwt.verify(req.token, 'secret', (err, authData) =>{
//         if(err){
//             res.status(403).send("Forbidden")
//         }else{
//             //tulis di sini      
//         }
//     })
// });

// POST - TOP UP - JUMLAH - Without Authentication
app.post('/api/topup/:id', jsonParser, (req,res) => {
    const user = users.find(u => u.id == parseInt(req.params.id));
    if(!user){
        res.send('The ID was not found')
    }

    const newSaldo = user.saldo + parseInt(req.body.saldo)

    const userTopUp = {
        id: user.id,
        username: user.username,
        saldo: newSaldo
    }

    users.push(userTopUp);
    res.send({  username: user.username, 
                saldoTotal: userTopUp.saldo, 
                message: "Saldo telah berhasil ditambahkan"
            })
})

// // POST - PEMBAYARAN - PAYMENT, JUMLAH & BERITA ACARA
// app.post('/api/pembayaran', verifyToken, (req, res) =>{
//     jwt.verify(req.token, 'secret', (err, authData) =>{
//         if(err){
//             res.status(403).send("Forbidden")
//         }else{
//             //tulis di sini
//         }
//     })
// });

// POST - PEMBAYARAN - LAYANAN, JUMLAH & BERITA ACARA - Without Authentication
app.post('/api/pembayaran/:id/:layanan', jsonParser, (req, res) =>{
    const user = users.find(u => u.id == parseInt(req.params.id));

    const jumlah = req.body.jumlah;
    
    const layanan = {
        nama: req.params.layanan,
        idpel: req.body.nomorPelanggan
    }

    if(!layanan.idpel){
        res.status(400).send("Masukkan nomor pelanggan")
    }

    // Kalau Uangnya tidak cukup
    if(jumlah > user.saldo){
        res.status(400).send("Mohon maaf, saldo anda tidak cukup.")
    }
    
    // Kalau uangnya cukup
    else{
        // SENDER - Pengurangan jumlah uang
        const saldo = user.saldo - jumlah;

        // Hasil Data JSON
        const userNewSaldo = {
            id: user.id,
            saldo: saldo
        }

        users.push(userNewSaldo);
        res.send({  message: "Pembayaran Berhasil", 
                    layanan: layanan.nama,
                    nomorpelanggan: layanan.idpel,
                    username: user.username, 
                    saldoAkhir: userNewSaldo.saldo,
                    beritaAcara: req.body.beritaAcara
                })
    }
});


// POST - TRANSFER - JUMLAH & BERITA ACARA - Without Authentication
app.post('/api/transfer/:sender/:receiver', jsonParser, (req,res) => {
    const sender = users.find(u => u.id == parseInt(req.params.sender));
    const receiver = users.find(u => u.id == parseInt(req.params.receiver));

    if(!sender){
        res.send('The sender ID was not found')
    }

    if(!receiver){
        res.send('The receiver ID was not found')
    }
    
    const jumlah = parseInt(req.body.jumlah);

    // Kalau Uangnya tidak cukup
    if(jumlah > sender.saldo){
        res.status(400).send("Mohon maaf, saldo anda tidak cukup.")
    }
    
    // Kalau uangnya cukup
    else{
        // SENDER - Pengurangan jumlah uang
        hasilSaldoSender = sender.saldo - jumlah;

        // RECEIVER - Penambahan jumlah uang
        hasilSaldoReceiver = receiver.saldo + jumlah;

        // Hasil Data JSON
        const senderNewSaldo = {
            id: sender.id,
            saldo: hasilSaldoSender
        }

        const receiverNewSaldo = {
            id: receiver.id,
            saldo: hasilSaldoReceiver
        }

        users.push(senderNewSaldo);
        users.push(receiverNewSaldo);
        res.send({  message: "Transfer berhasil", 
                    username: sender.username, 
                    saldoAkhir: senderNewSaldo.saldo,
                    beritaAcara: req.body.beritaAcara,
                    penerima: receiver.username,
                    saldoPenerima: receiverNewSaldo.saldo})
    }
})

// Connect to Port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.warn(`App listening on ${PORT}`);
})