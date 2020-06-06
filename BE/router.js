const express     = require('express');
const router      = express.Router();
const {
  save,
  loadFileName,
  loadfile,
  downloadFile
} = require('./io')

router.post('/save', (req, res) => {
  const {
    linesToSave,
    fileName,
    format
  } = req.body;

  save(linesToSave, fileName, format, (err, msg) => {
    const response = {
      success: !err ? true : false,
      msg: !err ? msg : err
    }
    if (err) {
      console.error(err)
      res.status(500).send(err)
    } else {
      res.send(response)
    }    
  });
})

router.get('/fileNames', (req, res) => {

  loadFileName( (err, dir) => {
      if (err) {
        console.error(err)
        res.send(err)
      } else {
        // console.log('dir = ', dir)
        res.send(dir)
      }
    })

});

router.get('/texFiles', (req, res) => {

  downloadFile(req, (error, fp) => {
    if (error) {
      res.status(400).send({ error })
    } else {
      res.download(fp)
    }
  })
});

router.post('/file', (req, res) => {
  const { fileName } = req.body;

  loadfile( fileName, (err, data) => {
    if (err) {
      console.error(err)
      res.send(err)
    } else {
      // console.log('data = ', data)
      res.send(data)
    }
  })
})

module.exports = router;