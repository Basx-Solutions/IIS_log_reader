let reqData = [];
let csvLogs = [];

const fileInput = document.getElementById("documentInput");
const parseBtn = document.getElementById("parseFileButton");
const preview = document.getElementById("preview");
const txtInput = document.getElementById("txtInput");
const renderBtn = document.getElementById("renderBtn");
const downloadBtn = document.getElementById("downloadBtn");

parseBtn.addEventListener("click", handleParseString);
renderBtn.addEventListener("click", handleRenderButtonClick);
downloadBtn.addEventListener("click", handleDownload);

function handleParseClick() {
  files = fileInput.files;

  Object.keys(files).forEach(function (file) {
    const previewHead = document.createElement("p");
    previewHead.innerHTML = "file loaded";
    const previewBody = document.createElement("preview");
    previewBody.src = file;

    preview.appendChild(previewHead);
  });
}

function handleDownload(evt) {}

function handleParseString(evt) {
  const txt = txtInput.value;
  var chunks = txt.split("#Software");
  chunks.shift();
  var fields = chunks.map((chunk) =>
    chunk.split("#Date:")[1].split("#Fields:")
  );

  //build obj for each req
  const finalList = fields.map((item) => ({ date: item[0].trim() }));
  const keys = [];
  //separate each req into it's own object
  fields.forEach(function (chunk, i) {
    const dateY = finalList[i].date.split("-")[0];
    const reqs = chunk[1].split(dateY);
    if (!keys.length) {
      keys.push(reqs[0].split(" "));
    }

    reqs.shift();

    finalList[i].reqs = reqs;
  });
  //break each req into properties
  finalList.forEach(function (chunk, i) {
    const reqObjList = [];
    chunk.reqs.forEach(function (req) {
      reqObj = {};
      //date
      const paramKeys = [
        "date",
        "time",
        "sIP",
        "method",
        "uriStem",
        "uriQuery",
        "sPort",
        "csUsername",
        "cIP",
        "userAgent",
        "referer",
        "status",
      ];
      extractReqParams(paramKeys, req);
      function extractReqParams(keys, reqString) {
        if (keys.length > 0) {
          if (keys[0] === "date") {
            const reqSplit = reqString.split(/(?<=^\S+)\s/);
            reqObj[keys[0]] = chunk.date.split("-")[0] + reqSplit[0];
            paramKeys.shift();
            extractReqParams(paramKeys, reqSplit[1]);
          } else {
            const reqSplit = reqString.split(/(?<=^\S+)\s/);
            reqObj[keys[0]] = reqSplit[0];
            paramKeys.shift();
            extractReqParams(paramKeys, reqSplit[1]);
          }
        } else {
          return;
        }
      }

      reqObjList.push(reqObj);
    });
    finalList[i].reqProps = reqObjList;
  });

  const reqMaster = [];
  finalList.forEach(function (chunk) {
    chunk.reqProps.forEach(function (req) {
      reqMaster.push(req);
    });
  });

  reqData = reqMaster;
  csvLogs = convertToCSV(reqMaster);

  console.log(csvLogs);
  const file = new Blob([csvLogs], { type: "csv" });
  downloadBtn.href = URL.createObjectURL(file);
  downloadBtn.download = "logs.txt";

  downloadBtn.click();
}

function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join("\n");
}
