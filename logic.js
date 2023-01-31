// var fs = require('node:fs')

const fileInput = document.getElementById("documentInput")
const parseBtn = document.getElementById("parseFileButton")
const preview = document.getElementById('preview')


parseBtn.addEventListener('click', console.log('hey'))


// function handleParseClick() {
//     files = fileInput.files
    

//     Object.keys(files).forEach(function (file) {
//         console.log(files[file])
      
//         const previewHead = document.createElement('p')
//         previewHead.innerHTML = 'file loaded'
//         const previewBody = document.createElement('preview')
//         previewBody.src = file

//         preview.appendChild(previewHead)

//         // const reader = new FileReader()
//         // reader.onload = (e) => {file.src = e.target.result}
//         // reader.readAsDataURL(file)  

//         const displayLogFile = () => {
//             fs.readFile("./log.log", "utf8", (err, file) => {
//               console.log(file);
//             });
//         };
//         displayLogFile()

//     })
    

//     // const reader = new FileReader()
//     // reader.onload = (e) => {
        
//     // }

    
    
// }




