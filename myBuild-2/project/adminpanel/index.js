/*
 # cd "d:\Web-host\GitHub\buildGulps\myBuild-2\app\adminpanel"
 # node index
*/

// const formInput = document.forms.atricles;
// actionForm(formInput);

// function actionForm(formInput)
// {
//     let formTitle = formInput.elements.title;
//     let formText = formInput.elements.text;
//     let formTags = formInput.elements.tags;
//     let formButton = formInput.elements.button;

//     formButton.addEventListener("click", readForm);

//     function readForm()
//     {
//         formTitle = formTitle.value;
//         formText = formText.value;
//         formTags = formTags.value;
//         console.log(formTitle, formText, formTags);
//     }
// }

const jsonfile = require('jsonfile')
const file = 'temp.json'
jsonfile.readFile(file, function (err, obj) {
  if (err) console.error(err)
  console.dir(obj['key'])
})