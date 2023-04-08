const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const puppeteer = require('puppeteer')
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

const apiGoogleTranslate = async function(detect_linguage, translate_to, text){
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  console.log("Dados recebidos: detect_linguage: "+detect_linguage+", translate_to: "+translate_to+", text: "+text)

  var url = `https://translate.google.com.br/?sl=${detect_linguage}&tl=${translate_to}&text=${encodeURIComponent(text)}&op=translate`;

  console.log("URL Gerada: "+url)

  await page.goto(url)
  await page.waitForTimeout(5000);
  
  const result = await page.evaluate(() => {
    //  MANTER ATENTO NO GOOGLE POIS ELES MUDAM A CLASSE DE TEMPOS EM TEMPOS
    console.log(document.getElementsByClassName('HwtZe')[0].innerText)
    return document.getElementsByClassName('HwtZe')[0].innerText;
  })

  browser.close()
  return result
}

app.get('/', async (req, res) => {
  const params = req.query
  var initialDate = new Date();
  const result = await apiGoogleTranslate(params.detect_linguage, params.translate_to, params.text);
  var finalDate = new Date();

  res.send(
    { response: result, delay: (finalDate - initialDate)/1000 }
  );
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});