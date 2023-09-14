/*
- itsfoss API
- News Scraper
- web scraper tool : 
  - yml: css-selector
- news
- a : href
- 
- listen server
- route response to path /
- fetch new.com and res as html


*/
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import {
    parse as yamlParse,
    parseAll as yamlParseAll,
    stringify as yamlStringify,
  } from 'https://deno.land/std@0.82.0/encoding/yaml.ts';
const router = new Router();


const data = yamlParse(await Deno.readTextFile('data.yaml'));

router.get("/", (ctx) => {
    ctx.response.body = "Welcome To pscraper";
});

data.map((e)=>{
  router.get(e.route, async(ctx) => {
    let res = await fetch(e.link);
    let html = await res.text()
    const $ = cheerio.load(html);
    let cls = e.parent
    let api = []
    let o = $(cls).html()
      // console.log('req : ' + o )
      // console.log('req : ' + $(cls).html() )
    let dom = $(cls).children().each(function (index) {
      //-----  console.log(index)
        // let title = $(itm).find('.c-card__headline').text()
        // let img = $(itm).find('img').attr("data-src")
        // if(e.value == 'a'){

        // }
        let url = $(this).find('a').attr('href')
        // console.log(url)
        if(e.path == 'absolute'){
          api.push({ site: e.link , url: `https://news.itsfoss.com${url}` })
        }else{
          api.push({ site:e.link , url: url })
        }
    })
      // console.log(api)
    // ctx.response.body = api;
    ctx.response.body = api;
  });
})

    // .text() : content
    // .html : inner html
    // .children() : iterate through its childrens
    // let link = []
    // let dom = $(cls).children().map((index, itm) => {
    //     let title = $(itm).find('.c-card__headline').text()
    //     let img = $(itm).find('img').attr("data-src")
    //     let url = $(itm).find('a').attr('href')
    //     link.push({ title: title, img: `https://news.itsfoss.com${img}`, url: `https://news.itsfoss.com${url}` })
    // })
    // let dom = $('a').each(function() {
    //     let a = $(this).attr('href')
    //     console.log(a)
    // })
    // console.log(link)


const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', () => {
    // console.log(server)
    console.log("--------------- Listening on http://localhost:8080")
})

await app.listen({ port: 8080 });