require('dotenv').config()

const express = require('express')
var app =  express();

const jwt = require('jsonwebtoken')

app.use(express.json())

const users = [
    {id:1, username: "John", password: "John123", saldo:100},
    {id:2, username: "Marie", password: "Marie123", saldo: 200},
    {id:3, username: "Claire", password: "Claire123", saldo: 300}
]

// GET - CEK SALDO - Without Authentication
app.get('/saldo/:id', authenticateToken, (req,res) => {
    const user = users.find(u => u.id == parseInt(req.params.id));
    if(!user){
        res.send('The ID was not found')
    };

    res.send({  username: user.username, 
                saldo: user.saldo
            })
});

// POST - TOP UP - JUMLAH - Without Authentication
app.post('/topup/:id', authenticateToken, (req,res) => {
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

// POST - PEMBAYARAN - LAYANAN, JUMLAH & BERITA ACARA - Without Authentication
app.post('/pembayaran/:id/:layanan', authenticateToken, (req, res) =>{
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
app.post('/transfer/:sender/:receiver', authenticateToken, (req,res) => {
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

// Authenticate Token
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401).send({
        message: "Please Input Token"
    })

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403).send({
            message: "Token Invalid"
        })

        req.user = user

        next()
    })
}

// Connect to Port Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.warn(`App listening on ${PORT}`);
})