// Подключение всех модулей к программе
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
let nickName
const urlEncodedParser = express.urlencoded({extended: false})

// Отслеживание порта
server.listen(3000);

// Отслеживание url адреса и отображение нужной HTML страницы

app.post('/',urlEncodedParser, function(request, respons) {
    nickName = request.body.nickName
    respons.redirect(301, '/chat')
});

app.get('/', function(request, respons) {
	respons.sendFile(__dirname + '/regist.html');
});

app.get('/chat', function(request, respons) {
	respons.sendFile(__dirname + '/index.html');
});


// Массив со всеми подключениями
users = [];
connections = [];

// Функция, которая сработает при подключении к странице
// Считается как новый пользователь
io.sockets.on('connection', function(socket) {
    socket.name = nickName
    socket.emit(`add mess`, {mess: 'Вошёл в чат', name: socket.name, status:'in'})
	// Добавление нового соединения в массив
	connections.push(socket);

	// Функция, которая срабатывает при отключении от сервера
	socket.on('disconnect', function(data) {
        setTimeout(()=>{
            socket.emit(`add mess`, {mess: 'Покинул чат', name: socket.name, status:'out'})
        }, 60000)
	});

	// Функция получающая сообщение от какого-либо пользователя
	socket.on('send mess', function(data) {
		// Внутри функции мы передаем событие 'add mess',
		// которое будет вызвано у всех пользователей и у них добавиться новое сообщение 
		io.sockets.emit('add mess', {mess: data.mess, name: socket.name, className: data.className, status: 'mess'});
	});

});