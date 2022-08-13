const string = require('./common/string');
const nodemailer = require('./node_modules/nodemailer');
const randomstring = require('./node_modules/randomstring');
var db = require('./db/database');
const express = require('express');
const apps = express();
const {Resolver} = require('dns');
const resolver = new Resolver();

var body = [];

apps.get("/",(req,res)=>{
    res.write('abc');
    return res.json({
        code:0,
        message:null,
        payload:null
    });
});

apps.post("/login", (req, res) => {
    req.on('data', (chunk) => {
        body.push(chunk);
    });
    return req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        const { email, pass } = JSON.parse(parsedBody);
        db.execute('SELECT * FROM user WHERE email = ? AND pass = ?',[email,pass]).then(data => {
                if (data[0].length != 0) {
                    res.statusCode = 200;
                    return res.json({
                        code: 0,
                        message: "đăng nhập thành công!",
                        payload: null
                    });
                }else {
                    return res.json({
                        code: 400,
                        message: "tài khoản email hoặc mật khẩu sai.",
                        payload: null
                    });
                }
        }).catch(err => {
            console.log(err);
            return res.json(string.jsonErr202);
        });
        body = [];
    });
});

apps.post('/register', (req, res) => {
    req.on('data', (chunk) => {
        body.push(chunk);
    });
    return req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        const { id, email, nameGame, deviceMobi } = JSON.parse(parsedBody);
        const randomPass = randomstring.generate(7);

        db.execute(`INSERT INTO user VALUES (?,?,?,?,?)`, [id, email, randomPass, nameGame, deviceMobi]).then(() => {
            res.statusCode = 200;
            return res.json({
                code: 0,
                message: "tạo tài khoản thành công!",
                payload: null
            });
        }).catch(err => {
            console.log(err);
            return res.json(string.jsonErr202);
        });
        myEmail.sendMail(emailOption(`${email}`, `${nameGame}`, `${randomPass}`), (err, info) => {
            if (err) {
                console.log(err);
                return res.json({
                    code: 501,
                    message: "có một lỗi xảy ra trong quá trình gửi mail.",
                    payload: null
                });
            }
        });
        body = [];
    });
});

apps.get('/check-device', (req, res) => {
    var user = {};
    const { device_mobi } = req.query;
    db.execute(`SELECT * FROM user`).then(data => {
        for (let arr of data[0]) {
            if (arr['deviceMobi'] === device_mobi) {
                user = {
                    id: arr['id'],
                    email: arr['email'],
                    nameGame: arr['nameGame'],
                    deviceMobi: arr['deviceMobi']
                };
            }
            break;
        }
        res.statusCode = 200;
        return res.json({
            code: 0,
            message: "kiểm tra device thành công!",
            payload: user
        });
    }).catch(err => {
        console.log(err);
        return res.json(string.jsonErr202);
    });
    body = [];
});

apps.get('/list-account',(req,res)=>{
    db.execute('SELECT * FROM user').then(data=>{
        res.statusCode = 200;
        return res.json({
            code: 0,
            message: "lấy danh sách tài khoản thành công!",
            payload: data[0]
        });
    }).catch(err=>{
        console.log(err);
        return res.json(string.jsonErr202);
    });
});

const myEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: string.email,
        pass: string.password
    }
});

const emailOption = (toMail, name, random) => {
    return {
        from: string.email,
        to: toMail,
        subject: string.subject,
        text: string.contentEmail(name, random)
    };
};

apps.listen(process.env.PORT || 5000);