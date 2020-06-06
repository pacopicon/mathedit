const writeLatex      = require('node-latex');
const streamifyString = require('string-to-stream')
const fs              = require('fs')
const repo            = './texFiles/';

exports.save = (linesToSave, fileName, format, callback) => {

  if (format === 'pdf') {

    // const inputStream = streamifyString(linesToSave);
  
    const inputStream  = fs.createReadStream('test.txt');
    const output = fs.createWriteStream(fileName);
    const pdf    = writeLatex(inputStream);

    console.log('fileName = ', fileName)
    console.log('inputStream = ', inputStream)

    pdf.pipe(output);
    pdf.on('error', err => console.log('Error::', err));
    pdf.on('finish', () => console.log('PDF generated'))

  } else if (format === 'tex') {
    const fp   = `${repo}${fileName}.tex`;
    fs.writeFile(fp, linesToSave, (err) => {
      if (err) {
        callback(err, null);
      } else {

        const msg = 'WRITE tex successful';
        console.log(msg)
        callback(null, msg)

      }
    })

  }

}

exports.loadFileName = async (callback) => {
  await fs.readdir(repo, async (err, files) => {
    if (err) {
      callback(err)
    } else {
      callback(null, files);
    }
  })
}

exports.loadfile = async (fileName, callback) => {
  const fp   = `${repo}${fileName}.tex`;

    await fs.readFile(fp, (err, buf) => {
      if (err) {
        callback(err)
        return;
      } else {
        const text    = buf.toString();
        const textArr = text.split('\n')
        const data = {
          text,
          textArr
        }
        callback(null, data)
      }
    });
}

exports.downloadFile = async (req, callback) => {
  const fp = 'texFiles/' + req.query.file;
  if (req.query.file && fs.existsSync(fp)) {
    callback(null, fp)
  } else {
    callback('File does not exist!')
  }

}