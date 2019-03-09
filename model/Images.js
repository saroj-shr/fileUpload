const PATH = 'data/images.json';
const fs = require('fs');

module.exports = class Images{
    constructor(fileName, filePath, fileType){
        this.fileName = fileName;
        this.fileType = fileType;
        this.path = filePath;
        this.time = Date.now();
        fs.access(PATH, fs.constants.F_OK, (err) => {
            if(err){
                fs.writeFile(PATH,"", (err) => {
                    if(!err) null;
                });
            }
        })
    }

    addNewEntry(){
        return fs.appendFile(PATH, JSON.stringify(this), (err) =>{
           if(err){
               console.error(err);
               return false;
           }
        });
    }

    readAllEntry(){
        return fs.readFile(PATH, (err, data)=>{
            if(!err) return JSON.stringify(data);
        });               
    }
}