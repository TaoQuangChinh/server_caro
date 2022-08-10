const fs = require('fs');
const string = require('./config/string');
const nodemailer = require('./node_modules/nodemailer');
const randomstring = require('./node_modules/randomstring');
var db = require('./db/database');
var body = [];

//res: server phản hồi tới đối tượng(data server trả về cho đối tượng)
//req: đối tượng phản hồi tới server(data đối tượng gửi lên server)
const handleRequestListener = (req, res) => {
    var url = req.url;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title><head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }

    // req.on('data', (chunk) => {
    //     body.push(chunk);
    // });
    // return req.on('end', () => {
    //     const parsedBody = Buffer.concat(body).toString();
    //     const { id, email, pass, name_game } = JSON.parse(parsedBody);

    //     if (url === '/login') {
    //         const result =  dataRegister("",email,pass,"");
    //         handleWriteFile('data_login.txt', JSON.stringify(result));
    //     } else if (url === '/register') {
    //         const randomPass = randomstring.generate(7);
    //         db.execute(`INSERT INTO user VALUES (?,?,?,?)`,[id,email,randomPass,name_game]);
    //         myEmail.sendMail(emailOption(`${email}`,`${name_game}`,`${randomPass}`),(err,info)=>{
    //             if(err){
    //                 res.statusCode = 404;
    //                 res.write("404 Not Found");
    //                 return res.end();
    //             }
    //         });
    //     }
    //     body = [];
    // });
};

    const dataRegister = (id,email,pass,nameGame) =>{
        return {
            id: id,
            mailUser: email,
            passWord: pass,
            name_game: nameGame
        };
    };

    const handleWriteFile = (nameFile, dataFile) => fs.writeFile(nameFile, dataFile,
    (err) => {
        if (err) {
            res.statusCode = 404;
            res.write("404 Not Found");
            return res.end();
        }
    });

    const myEmail = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: string.email,
            pass: string.password
        }
    });
    
    const emailOption = (toMail,name,random) =>{
        return {
            from: string.email,
            to: toMail,
            subject:string.subject,
            text: string.contentEmail(name,random)
        };
    };    

//Method 1
// exports.handle = handleRequestListener;
// exports.log = logText;

//Method 2
module.exports = {
    handle: handleRequestListener
};