import fs from 'fs'
import path from 'path'


export const saveLocalResource = async (buff: Buffer, folderpath: string, medianame: string) => {
    if(!fs.existsSync(folderpath)){
        fs.mkdirSync(folderpath)
    }
    const list = medianame.split('.')
    const justName = list[0]
    const files = fs.readdirSync(folderpath).filter(name => name.includes(justName) )
    files.map((file) => {
        fs.rmSync(path.join(folderpath, file))
    })
    await fs.writeFileSync(path.join(folderpath, medianame), buff)
    console.log('uploaded')
    return
}
