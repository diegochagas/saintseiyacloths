const csv = require("csvtojson");
const FileSystem = require("fs");

const files = [
  "artists",
  "characters",
  "classes",
  "cloths",
  "groups",
  "history",
  "midias",
  "ranks",
  "saints",
];

function writeFileOnDataRepository(file, jsonObj) {
  let directoryPath = `./json`;
  let filePath = `${directoryPath}/${file}.json`;

  // If target is a directory, a new file with the same name will be created
  if (FileSystem.existsSync(directoryPath)) {
    FileSystem.writeFileSync(filePath, JSON.stringify(jsonObj));
  } else {
    FileSystem.mkdirSync(directoryPath);

    FileSystem.writeFileSync(filePath, JSON.stringify(jsonObj));
  }
}

function writeFileOnFrontEndSide(file, jsonObj) {
  FileSystem.writeFileSync(
    `../src/pages/api/data/${file}.json`,
    JSON.stringify(jsonObj)
  );
}

files.forEach((file) => {
  csv()
    .fromFile(`./data/${file}.csv`)
    .then((jsonObj) => {
      // writeFileOnDataRepository(file, jsonObj);

      writeFileOnFrontEndSide(file, jsonObj);
    });
});
