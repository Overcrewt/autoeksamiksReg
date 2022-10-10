const cheerio = require("cheerio")
const axios = require("axios")
const newurl =
    "https://www.eesti.ee/et/asutuste-kontaktid/haridusasutused/koolid/harjumaa"
const fs = require("fs")

axios.get(newurl).then((urlResponse) => {
    const $ = cheerio.load(urlResponse.data)
    //console.log($)

    $(".mb-2 a").each(function getList(i, element) {
        var link = newurl + $(element).attr("href")

        fs.writeFile("./link.txt", link, (err) => {
            if (err) {
                console.error(err)
                return
            }
        })
        var links = link.split(",")
        console.log(links)

        // axios.get(link).then((response) => {
        //     const $ = cheerio.load(response.data)
        //     // $(".col-xl-10 col-lg-10 col-md-9 col-sm-6 col-10 a").each(
        //     //     (i, element) => {
        //     //         const schools =
        //     //             response.request.res.responseUrl + $(element).text()
        //     //         console.log(schools)
        //     //     }
        //     // )
        //     const email = $(
        //         ".col-xl-10 col-lg-10 col-md-9 col-sm-6 col-10 a"
        //     ).text()
        //     console.log(email)
        // })

        // const target = "https"
        // let counter = 0
        // for (item of links.flat()) {
        //     if (item == target) {
        //         counter = counter + 1
        //     }
        // }
        // console.log(counter)
    })

    // for (let index = 0; index < counter; index++) {}
})
