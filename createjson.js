const http = require('https')
const fs = require('fs')
const path = require('path')
const uuidv1 = require('uuid/v1')
const csvtojsonV2=require("csvtojson/v2");

const downloadPage = (url='https://prod-edxapp.edx-cdn.org/assets/courseware/v1/07d100219da1a726dad5eddb090fa215/asset-v1:Microsoft+DEV283x+2T2018+type@asset+block/customer-data.csv') => {
  console.log('downloading ', url)
  const fetchPage = (urlF, callback) => {
    http.get(urlF, (response) => {
      let buff = ''
      response.on('data', (chunk) => { 
        buff += chunk
      })
      response.on('end', () => {
        callback(null, buff)
      })
    }).on('error', (error) => {
      console.error('Got error: ${error.message}')
      callback(error)
    })
  }
  const folderName = uuidv1()
  
  fs.mkdirSync(folderName)
  fetchPage(url, (error, data)=>{
    if (error) return console.log(error)
    fs.writeFileSync(path.join(__dirname, folderName, 'url.txt'), url)  
    fs.writeFileSync(path.join(__dirname, folderName, 'file.csv'), data)
    console.log('downloading is done in folder ', folderName)
		/** csv file a,b,c 1,2,3 4,5,6 */
		const csvFilePath=folderName
		const csv=require('csvtojson')
		csv()
		.fromFile(csvFilePath+'/file.csv')
		.then((jsonObj)=>{
			console.log(jsonObj);
		 
			/**
			 * [
			 * 	{a:"1", b:"2", c:"3"},
			 * 	{a:"4", b:"5". c:"6"}
			 * ]
			 */ 
			 fs.writeFileSync(path.join(__dirname, folderName, 'file.json'), JSON.stringify(jsonObj,null, 2))
		})
		
  })
  
}

downloadPage(process.argv[2])