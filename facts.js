let Fact = class Fact {
    constructor(name, state) {
        this.name = name
        this.state = state
    }

    get getState() {
        return this.state
    }

    set setState(state) {
        this.state = state
    }
}

createFactsList = (facts, eventList) => {
    let factsList = []
    eventList.forEach(event => {
        factsList.push(new Fact(event, false))
    })
    facts.forEach(fact => {
        factsList.find((current, index, tab) => {
            if (current.name == fact) {
                tab[index].setState = true
            }
        })
    })
    return factsList
}

module.exports = { Fact, createFactsList }