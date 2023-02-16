import express, { Request, Response } from 'express';
import cors from 'cors';
const app = express();
app.use(cors({
    origin: '*'
}));
import { createServer } from 'http';
import bodyParser from 'body-parser';
import { Server, Socket } from 'socket.io';
import api from './routes/api';
import socketService from './routes/socketService';
import {join} from 'path' 
import { DataBase, initDatabase } from './classes/db';
import { OkPacket } from 'mysql';
const port = 8012;

const jsonParser = bodyParser.json({limit: '50mb'});
app.use(jsonParser);
app.use('/public', express.static(join(__dirname, '..', 'public')))

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

api(app, io);

io.on('connection', (socket: Socket) => {
    console.log('An user has been connected', socket.id)

    socketService(socket)

    socket.on('disconnect', () => {
        console.log('An user has been disconnected', socket.id)
        socket.broadcast.emit('userDisconnected', socket.id)
    })
})

app.get('/ping', (req: Request, res: Response) => {
    console.log('Validating server status');
    res.send('pong');
});

app.post('/contact', async (req: Request, res: Response) => {
    const db: DataBase = await initDatabase(res)
    const query: string = 'INSERT INTO toContact (name, telf) VALUES (?, ?)'
    const values: Array<string> = [req.body.name, req.body.telf]
    const resp: OkPacket = await db.insertQuery(query, values)
    db.closeConnection()
    if(resp.insertId){
        res.json({
            ok: 'ok'
        })
    }else{
        res.status(500)
        res.end()
    }
})

httpServer.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});