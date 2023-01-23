import { Response } from "express";
import { OkPacket } from "mysql";
import { Socket } from "socket.io";
import { DataBase, initDatabase } from "../classes/db";
import { userSocketConnected } from "@/shared";

export default (socket: Socket): void => {
    /**
     * Se guarda en base de datos el id que tiene el usuario en 
     * el socket
     */
    socket.on('joinEnterprise', async (data: userSocketConnected) => {
        let res: Response = null;
        const db: DataBase = await initDatabase(res);
        const query: string = `UPDATE users SET socketId = ? WHERE id = ?`
        if(!data.id) return
        const values: Array<string> = [socket.id, data.id.toString()]
        const response: OkPacket = await db.updateQuery(query, values)
        db.closeConnection()
        socket.join('e' + data.enterprise_id)
        if(response.changedRows > 0){
            socket.to('e' + data.enterprise_id).emit('userConnected', {
                id: data.id,
                socketId: socket.id
            })
        }else{
            socket.to(socket.id).emit('errorLogging')
        }
    })

}