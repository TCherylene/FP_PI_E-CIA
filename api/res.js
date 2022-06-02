'use strict';

exports.success = function(message, res){
    var data = {
        "status":200,
        "message":message
    };

    res.json(data);
    res.end();
};

exports.failed = function(message, res){
    var data = {
        "status": 400,
        "message": message
    }

    res.json(data);
    res.end();
}

exports.serverError = function(message, res){
    var data = {
        "status": 500,
        "message": "Server Error"
    }

    res.json(data);
    res.end();
}

//response untuk nested matakuliah
exports.oknested = function(values, res){
    //lakukan akumulasi
    const hasil = values.reduce((akumulasikan, item)=>{
        //tentukan key group
        // kalau ada nama yang sama
        if(akumulasikan[item.nama]){
            //buat variabel group nama mahasiswa
            const group = akumulasikan[item.nama];
            //cek jika isi array adalah matakuliah
            if(Array.isArray(group.matakuliah)){
                //tambahkan value ke dalam group matakuliah
                group.matakuliah.push(item.matakuliah);
            }else {
                group.matakuliah = [group.matakuliah, item.matakuliah];
            }
        }else {
            // kalau gaada yang sama
            akumulasikan[item.nama] = item;
        }
        return akumulasikan;
    }, {});

    var data = {
        'status':200,
        'values':hasil
    };
    
     res.json(data);
     res.end();

}


/* Response yang diinginkan */
/* 
    {
        "transfer":[
            {
                ...
            },
            {
                ...
            }
        ],

        "bayar":[
            {
                ...
            },
            {
                ...
            }
        ],

        "top up":[
            {
                ...
            },
            {
                ...
            }
        ]

    }
*/