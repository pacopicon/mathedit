const latexToPDF      = require('node-latex');
const streamifyString = require('string-to-stream');
const fs              = require('fs')
const repo            = './texFile/';

exports.exportToPDF = (linesToSave, fileName, callback) => {

  const initFp = `${repo}${fileName}.tex`;
  const endFp  = `${repo}${fileName}.pdf`;

  fs.writeFile(initFp, linesToSave, (err) => {
    if (err) {
      callback(err, null);
    } else {

      const inputStream  = fs.createReadStream(initFp);
      const output       = fs.createWriteStream(endFp);
      const pdf          = latexToPDF(inputStream);
      console.log(' typeof pdf = ', typeof pdf)
      console.log('pdf  = ', pdf)
      

      pdf.pipe(output);
      pdf.on('error', err => console.log('Error::', err));
      pdf.on('finish', async () => {

        fs.unlink(initFp, async () => {
          fs.readFile(endFp, (err, buf) => {
            if (err) {
              callback(err)
              return;
            } else {
              // const outputStream  = await fs.createReadStream(endFp);
              fs.unlink(endFp, async () => {
                
      // console.log('blob = ', blob)
                // const buffer = Buffer.from(buf)
                const str = buf.toString('base64')
                callback(null, str)
                // callback(null, outputStream)
              })
            }
          });
        })
      })
    }
  })

  

  

  

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