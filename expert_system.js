const fs = require("fs")
const util = require("util")
const parser = require("./parser.js")
const ruleListManager = require("./rule_event_list.js")
const factsManager = require("./facts.js")

const fileLines = parser.read(process.argv[2])
const { rules, facts, queries } = parser.parse(fileLines)
console.log(facts)
console.log(queries)
const { eventList, rulesDependencies } = ruleListManager.createEventList(rules)
console.log("All events in rules :")
console.log(eventList)
console.log("Rule dependencies :")
console.log(rulesDependencies)
const factsList = factsManager.createFactsList(facts, eventList)

checkCompatibility = (query, dependencies, path) => {
    dependencies.forEach(rule => {
        rule.consequences.forEach(consequence => {
            if (consequence == query && path.includes(rule) == false) {
                console.log(rule)
                rule.dependencies.forEach(dependency => {
                    path.push(rule)
                    checkCompatibility(dependency, dependencies, path)
                })
            }
        })
    })
}


queries.forEach(query => {
    console.log("Query " + query + " is related to these rules :")
    checkCompatibility(query, rulesDependencies, [])
})