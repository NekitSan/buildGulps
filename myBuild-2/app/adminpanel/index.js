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

const file = 'temp.json';
const jsonfile = require('jsonfile');
let tempObj = {
  "key": {
    "articles": [{
      "id": 0,
      "title": 0,
      "text": 0,
      "tags": 0,
      "datatime": ["20.02.2020", "20:20"]
    }]
  }
};

// readJson();

writeJson(tempObj);

function readJson() {
  jsonfile.readFile(file, function (err, tempObj) {
    if (err) console.error(err);
    console.dir(tempObj);
    return tempObj;
  })
}

function writeJson(tempObj) {
  let template = {
    "id": 1,
    "title": 0,
    "text": 0,
    "tags": 0,
    "datatime": ["20.02.2020", "20:20"]
  };
  let obj = tempObj["key"]["articles"] + template;

  console.log(obj);

  // jsonfile.writeFile(file, obj, function (err) {
  //   if (err) console.error(err);
  // });
}