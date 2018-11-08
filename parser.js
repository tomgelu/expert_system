
read = filename => {
    const fs = require("fs")
    fs.readFileAsync = filename => {
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(filename, (err, buffer) => {
                    if (err) reject(err); else resolve(buffer);
                });
            } catch (err) {
                reject(err);
            }
        })
    }
    let lines

    if (!fs.existsSync(filename)) {
        console.log("File doesn't exists.")
        process.exit()
    }

    lines = fs.readFileSync(filename).toString().split("\n")
    return lines
}

parse = lines => {
    let step = 1
    let rules = {}
    rules.bidirectionnal = []
    rules.directionnal = []
    let facts = []
    let queries = []
    lines.forEach((elem, index, tab) => {
        tab[index] = elem.trim()
    })
    // Keep only interesting lines
    lines = lines.filter((elem, index, tab) => {
        return (elem[0] != '#')
    })
    lines.forEach((elem, index, tab) => {
        // Remove comments and trim
        if (elem.search('#') != -1) {
            tab[index] = elem.substring(0, elem.search('#')).trim()
        }
        if (tab[index].search('<=>') != -1) {
            rules.bidirectionnal.push(tab[index])
        } else if (tab[index].search('=>') != -1) {
            rules.directionnal.push(tab[index])
        } else if (tab[index].search('=') != -1) {
            tab[index].substring(1).split('').forEach(letter => {
                facts.push(letter)
            })    
        } else if (tab[index].search(/\?/) != -1) {
            tab[index].substring(1).split('').forEach(letter => {
                queries.push(letter)
            })
        }
    })
    return { rules, facts, queries }
}


module.exports = { read, parse }