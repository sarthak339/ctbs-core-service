require('dotenv').config(); 
global.__basedir = __dirname;
 
async function init(){
  try{
    await require('./routes').init();
  }catch(error){
    console.error(`failed to start the server , error: ${error}`);  
  }
}


init(); 
