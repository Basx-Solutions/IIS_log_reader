//state
let reqData = [];
let csvLogs = [];
let multiFileContent = [];
let mergedCSVLog = "";

//cache
const parseBtn = document.getElementById("parseFileButton");
const preview = document.getElementById("preview");
const fileInput = document.getElementById("documentInput");
const txtInput = document.getElementById("txtInput");
const renderBtn = document.getElementById("renderBtn");
const downloadBtn = document.getElementById("downloadBtn");
const testButton = document.getElementById("testButton");

//listeners
parseBtn.addEventListener("click", handleParseClick);
renderBtn.addEventListener("click", handleRenderClick);
testButton.addEventListener("click", runTest);

//handlers
function handleRenderClick(evt) {
  Object.keys(fileInput.files).forEach(function (file, i) {
    extractTextContent(fileInput.files[i]);
  });
}
function handleParseClick(evt) {
  var string = parseString(txtInput.value);
  var csv = convertToCSV(string);

  const file = new Blob([csv], { type: "csv" });
  downloadBtn.href = URL.createObjectURL(file);
  downloadBtn.download = "logs.txt";
}
function runTest(evt) {
  console.log(multiFileContent);
  console.log(mergedCSVLog);
  mergeMultipleCSV(multiFileContent);

  const file = new Blob([mergedCSVLog], { type: "csv" });
  downloadBtn.href = URL.createObjectURL(file);
  downloadBtn.download = "logs.txt";
}

//helpers
async function extractTextContent(file) {
  //extract file string and push to state
  // push here because of async await issuee with file reader
  var reader = new FileReader();
  let string = "";
  reader.readAsText(file, "UTF-8");

  reader.onload = (readerEvent) => {
    string = readerEvent.target.result;
    const parsed = parseString(string);
    const csv = convertToCSV(parsed);
    multiFileContent.push(csv);
  };
}

function parseString(string) {
  var chunks = string.split("#Software");
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
  return reqData;
}

function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join("\n");
}

function mergeMultipleCSV() {
  //remove keys, save on first
  multiFileContent.forEach(function (csvLog, i) {
    if (i > 0) {
      console.log(csvLog.split("referer,status"));
      multiFileContent.splice(i, 1, csvLog.split("referer,status")[1]);
    }
  });

  //stitch together & set as new state
  multiFileContent.forEach(function (csvLog) {
    mergedCSVLog += csvLog;
  });
}
