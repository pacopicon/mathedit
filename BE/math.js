const { tex2html } = require('mathquill-markup-generator');
 
exports.convert = async (req, res) => {
  try {
    const latexStr = req.body.latexStr
    let invalid = false
    if (!req.body || !latexStr) {
      invalid = true
    }
    console.log(req.body)

    if (invalid) {
      return res.send(`invalid input: req.body shows as ${typeof req.body} and latexStr shows as ${typeof latexStr}`)
    }
    const html = await tex2html(latexStr);

    return res.status(200).json( { success: true, html });
  }
  catch (err) {
    return res.send(err)
  }


}