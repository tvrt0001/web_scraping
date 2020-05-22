const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");


const dir = './output';

if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}

const writestream = fs.createWriteStream(`${dir}/post.csv`);
const MAIN_URL = "https://dev.to";

// write headers

writestream.write(`Title,Link,Date \n`);

request(MAIN_URL, (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);

    $(".crayons-story__body").each((i, el) => {
      const title = $(el)
        .find(".crayons-story__title a")
        .text()
        .replace(/\s\s+/g, "")
        .replace(/,/, "");
      const link = $(el).find(".crayons-story__title a").attr("href");

      const date = $(el).find("time").text();
      // write row
      writestream.write(`${title},${link},${date} \n`);
    });
  }
});
