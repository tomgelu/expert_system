const Rule = class Rule {
    constructor(rule, dependencies, consequences, d_op, c_op) {
        this.rule = rule
        this.dependencies = dependencies
        this.dependencies_op = d_op
        this.consequences = consequences
        this.consequences_op = c_op
    }
}

createEventList = rules => {
    let eventList = []
    let rulesDependencies = []
    rules.directionnal.forEach(element => {
        let dependencies = [[],[]]
        let op = [[],[]]
        let parts = []
        let leftRight = element.split('=>')
        let neg = false
        // LEFT PART
        parts[0] = leftRight[0].split('').filter(letter =>{
            if (letter >= 'A' && letter <= 'Z') {
                if (neg) {
                    dependencies[0].push('!' + letter)
                    neg = false
                } else {
                    dependencies[0].push(letter)
                }
                return true
            } else if (letter == '!') {
                neg = true
            } else if (letter != ' ') {
                op[0].push(letter)
            }
            return false
        })
        // RIGHT PART
        parts[1] = leftRight[1].split('').filter(letter =>{
            if (letter >= 'A' && letter <= 'Z') {
                if (neg) {
                    dependencies[1].push('!' + letter)
                    neg = false
                } else {
                    dependencies[1].push(letter)
                }
                return true
            } else if (letter == '!') {
                neg = true
            } else if (letter != ' ') {
                op[1].push(letter)
            }
            return false
        })
        // CONCAT TO CREATE EVENTS LIST
        parts = parts[0].concat(parts[1])
        parts.forEach(el => {
            if (!eventList.includes(el) && el != '!') {
                eventList.push(el)
            }
        })
        // CREATE RULE ENTRY WITH HIS DEPENDENCIES
        rulesDependencies.push(new Rule(element, dependencies[0], dependencies[1], op[0], op[1]))
    })
    rules.bidirectionnal.forEach(element => {
        let parts = []
        let dependencies = [[],[]]
        let op = [[],[]]
        let leftRight = element.split('<=>')
        let neg = false
        parts[0] = leftRight[0].split('').filter(letter =>{
            if (letter >= 'A' && letter <= 'Z') {
                if (neg) {
                    dependencies[0].push('!' + letter)
                    neg = false
                } else {
                    dependencies[0].push(letter)
                }
                return true
            } else if (letter == '!') {
                neg = true
            } else if (letter != ' ') {
                op[0].push(letter)
            }
            return false
        })
        parts[1] = leftRight[1].split('').filter(letter =>{
            if (letter >= 'A' && letter <= 'Z') {
                if (neg) {
                    dependencies[1].push('!' + letter)
                    neg = false
                } else {
                    dependencies[1].push(letter)
                }
                return true
            } else if (letter == '!') {
                neg = true
            } else if (letter != ' ') {
                op[1].push(letter)
            }
            return false
        })
        // CONCAT TO CREATE EVENTS LIST
        parts = parts[0].concat(parts[1])
        parts.forEach(el => {
            if (!eventList.includes(el) && el != '!') {
                eventList.push(el)
            }
        })
        rulesDependencies.push(new Rule(element, dependencies[0], dependencies[1], op[0], op[1]))
        rulesDependencies.push(new Rule(element, dependencies[1], dependencies[0], op[1], op[0]))
    })
    return { eventList, rulesDependencies }
}

lettersToFact = (rulesDependencies, factsList) => {
    rulesDependencies.forEach((elem, index, tab) => {
        tab[index].dependencies.forEach((dependency, dep_index, dep_tab) => {
            dep_tab[dep_index] = { "fact":factsList.find(el => {
                return (el.name == (dependency[0] == '!' ? dependency.substring(1) : dependency))
            }), "name": dependency }
        })
        tab[index].consequences.forEach((dependency, dep_index, dep_tab) => {
            dep_tab[dep_index] = { "fact":factsList.find(el => {
                return (el.name == (dependency[0] == '!' ? dependency.substring(1) : dependency))
            }), "name": dependency }
        })
    })
}


module.exports = { Rule, createEventList, lettersToFact }