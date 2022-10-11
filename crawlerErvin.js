const cheerio = require("cheerio")
const axios = require("axios")
const newurl =
    "https://www.eesti.ee/et/asutuste-kontaktid/haridusasutused/koolid/harjumaa"
const koolurl = "https://www.eesti.ee"
const fs = require("fs")

axios.get(newurl).then((urlResponse) => {
    const $ = cheerio.load(urlResponse.data)
    //console.log($)

    $(".mb-2 a").each(function getList(i, e) {
        var link = koolurl + $(e).attr("href")

        const links = link.split()
        // console.log(links)
        links.forEach(function (element) {
            axios.get(element).then((response) => {
                const $ = cheerio.load(response.data)
                const email = $(
                    ".col-xl-10 col-lg-10 col-md-9 col-sm-6 col-10 a"
                )
                    .find("email")
                    .text()

                console.log(email)
            })
        })

        // const target = "https"
        // let counter = 0
        // for (item of links) {
        //     if (item == target) {
        //         counter = counter + 1
        //     }
        // }
        // console.log(counter)
        // console.log(counts)
    })

    // for (let index = 0; index < counter; index++) {}
})
