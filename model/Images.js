const PATH = 'data/images';
const fs = require('fs');

module.exports = class Images{
    constructor(filePath){ 
        this.path = filePath;        
        fs.access(PATH, fs.constants.F_OK, (err) => {
            if(err){
                fs.writeFile(PATH,"", (err) => {
                    if(!err) null;
                });
            }
        })
    }

    addNewEntry(){
        return fs.appendFile(PATH, this.path+'\n', (err) =>{
           if(err){
               console.error(err);
               return false;
           }
        });
    }

    readAllEntry(){        
        return fs.readFile(PATH, (err, data)=>{                       
            // console.log(data.toString());
           return data.toString();            
        });          
    }
}