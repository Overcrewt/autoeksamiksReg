const cheerio = require("cheerio")
const axios = require("axios")
const newurl =
    "https://www.eesti.ee/et/asutuste-kontaktid/haridusasutused/koolid/"
const koolurl = "https://www.eesti.ee"
const fs = require("fs")
const { readFileSync, promises: fsPromises } = require("fs")

function cfDecodeEmail(encodedString) {
    var email = "",
        r = parseInt(encodedString.substr(0, 2), 16),
        n,
        i
    for (n = 2; encodedString.length - n; n += 2) {
        i = parseInt(encodedString.substr(n, 2), 16) ^ r
        email += String.fromCharCode(i)
    }
    return email
}

function removeItemAll(arr, value) {
    var i = 0
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1)
        } else {
            ++i
        }
    }
    return arr
}

function checkIfContainsSync(filename, str) {
    const contents = readFileSync(filename, "utf-8")

    const result = contents.includes(str)

    return result
}

axios.get(newurl).then((uriResponse) => {
    const $ = cheerio.load(uriResponse.data)
    $(".card-block-text").each(function getListOfRegions(i, elem) {
        var linkRegion = koolurl + $(elem).attr("href")
        const linksRegion = linkRegion.split()
        var linksRegionFin = removeItemAll(
            linksRegion,
            "https://www.eesti.eeundefined"
        )
        const toRemove = []
        linksRegionFin = linksRegionFin.filter((el) => !toRemove.includes(el))
        console.log(linksRegionFin)

        linksRegionFin.forEach(function (elemen) {
            axios.get(elemen).then((urlResponse) => {
                const $ = cheerio.load(urlResponse.data)

                $(".mb-2 a").each(function getList(i, e) {
                    var link = koolurl + $(e).attr("href")

                    const links = link.split()

                    links.forEach(function (element) {
                        axios.get(element).then((response) => {
                            const $ = cheerio.load(response.data)

                            const email = $(
                                "body > stateportal-root > div > main > div > stateportal-language-wrapper > ng-component > div > stateportal-contact-view-component > div > div:nth-child(2) > div > stateportal-contact-card > dl:nth-child(2) > dd:nth-child(4) > a"
                            ).toString()

                            // console.log(email)
                            const esimene = email.search("data-cfemail=") + 14
                            const teine = email.search("email&nbsp") - 3
                            var linkFIn = cfDecodeEmail(
                                email.substring(esimene, teine)
                            )

                            linkFIn += "\n"
                            if (
                                checkIfContainsSync("./links.txt", linkFIn) ==
                                true
                            ) {
                            } else {
                                fs.appendFile("links.txt", linkFIn, (err) => {
                                    return console.log(err)
                                })
                            }
                        })
                    })
                })
            })
        })
    })
})
