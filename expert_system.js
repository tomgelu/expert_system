const fs = require("fs")
const util = require("util")
const parser = require("./parser.js")
const ruleListManager = require("./rule_event_list.js")
const factsManager = require("./facts.js")

const fileLines = parser.read(process.argv[2])
const { rules, facts, queries } = parser.parse(fileLines)
//console.log("Queries to find: " + queries)
let { eventList, rulesDependencies } = ruleListManager.createEventList(rules)
//console.log("All events in rules :")
//console.log(eventList)
const factsList = factsManager.createFactsList(facts, eventList)
//console.log(factsList)
ruleListManager.lettersToFact(rulesDependencies, factsList)
//console.log("Rule dependencies :")
//console.log(rulesDependencies)
//console.log("-------------------------------------------------------------------------------")

isTrue = fact => {
    let res = undefined
    let elem = factsList.find(curr => {
        if (fact.name == curr.name)
            return true
    })
    return elem ? elem : undefined
}

setConsequences = (dependenciesResults, factsList, rule) => {
    let op_index = 0
    let res = dependenciesResults.reduce((prev, curr) => {
        if (curr.name[0] == '!') {
            curr.fact.state = !curr.fact.state
        }
        if (prev == 0) {
            return curr.fact.state
        } else {
            let op = rule.dependencies_op[op_index]
            if (op == '+') {
                return prev && curr.fact.state
            } else if (op == '|') {
                return prev || curr.fact.state
            } else if (op == '^') {
                return prev != curr.fact.state
            }
            op++
        }
    }, 0)
    rule.consequences.forEach(el => {
        factsList.forEach((fact, index, tab) => {
            if (tab[index].name == el.fact.name) {
                tab[index].state = res
            }
        })
    })
}

checkCompatibility = (query, dependencies, path, depth) => {
    //console.log(' '.repeat(depth * 4) + query + " is related to these rules :")
    dependencies.forEach(rule => {
        rule.consequences.forEach(consequence => {
            // CONSEQUENCE LIEE A LA REGLE EN COURS
            if ((consequence.name == query || consequence.name == '!' + query) && path.includes(rule) == false) {
                //console.log(' '.repeat(depth * 4) + '- ' + rule.rule)
                let dependenciesRes = []
                rule.dependencies.forEach(dependency => {
                    dependenciesRes.push(dependency)
                    path.push(rule)
                    checkCompatibility(dependency.name, dependencies, path, depth + 1)
                })
                setConsequences(dependenciesRes, factsList, rule)
            }
        })
    })
    return false
}

queries.forEach(query => {
    checkCompatibility(query, rulesDependencies, [], 0)
})

console.log("End results :")
queries.forEach(query => {
    let ret = factsList.find(fact => {
        return query == fact.name
    })
    console.log("Query " + query + " is " + ret.state)
})