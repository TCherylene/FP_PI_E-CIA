require('dotenv').config()

const express = require('express')
var app =  express();
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const jwt = require('jsonwebtoken')

app.use(express.json())

app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id),
)

const users = [
    {id:1, username: "John", password: "John123", saldo:100},
    {id:2, username: "Marie", password: "Marie123", saldo: 200},
    {id:3, username: "Claire", password: "Claire123", saldo: 300}
]

// POST - LOGIN
app.post('/login', async (req, res) => {
    const username = req.body.username

    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const user = {
            username: username,
            password: hashedPassword
        }

        const accessToken = generateAccessToken(user)

        res.json({
            accessToken: accessToken,
        })
        res.redirect('/home')
    } catch{
         res.redirect('/login')
    }
})


// POST REGISTER
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: users.length + 1,
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            noHP: req.body.nomor,
            password: hashedPassword
        })

        res.redirect('/login')
   } catch{
        res.redirect('/register')
   }
})

// GET - CEK SALDO
app.get('/saldo/:id', authenticateToken, (req,res) => {
    const user = users.find(u => u.id == parseInt(req.params.id));
    if(!user){
        res.send('The ID was not found')
    };

    res.send({  username: user.username, 
                saldo: user.saldo
            })
});

// POST - TOP UP - JUMLAH
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

// POST - PEMBAYARAN - LAYANAN, JUMLAH & BERITA ACARA
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

// POST - TRANSFER - JUMLAH & BERITA ACARA
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

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}

// Kalau user udah login tetapi buka page tertentu -> redirect ke /
function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }

    next()
}

// Connect to Port Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.warn(`App listening on ${PORT}`);
})