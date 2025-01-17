const regions = document.querySelectorAll("[data-region]")
const targetRegion = document.querySelector("[data-target]")
const timer = document.querySelector("[data-timer]")
const regionNames = []
const game = {
    score: {
        player1: 0,
        player2: 0
    },
    turn: "player2",
    timerDuration: 60,
    runningTimer: null
}

function updateTimer() {
    minutes = Math.floor(game.timerDuration / 60);
    seconds = game.timerDuration % 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timer.textContent = minutes + ":" + seconds;
    if (--game.timerDuration < 0) {
        resetTimer()
        game.turn = setTurn(game.turn)
        game.runningTimer = setInterval(updateTimer, 1000)
    }
}

function resetTimer() {
    clearInterval(game.runningTimer)
    game.timerDuration = 60
}

function setTargetRegion(lastRegion = "") {
    if (regionNames.length != 0) {
        const randomRegion = regionNames[Math.floor(Math.random() * regionNames.length)];
        targetRegion.textContent = randomRegion
    }
    else {
        targetRegion.textContent = lastRegion
        declareWinner()
    }
}

function removeFromPool(region) {
    region.removeEventListener("click", checkAnswer)
    const regionIndex = regionNames.indexOf(region.attributes.title.textContent)
    if (regionIndex > -1) {
        regionNames.splice(regionIndex, 1);
    }
}

function awardPoints() {
    const priviousScore = game.score[game.turn]
    const newScore = priviousScore + 10
    game.score[game.turn] += 10
    const score = document.querySelector(`[data-score="${game.turn}"]`)
    score.textContent = newScore
}

function setTurn(currentTurn) {
    let nextTurn
    if (currentTurn == "player1") nextTurn = "player2"
    if (currentTurn == "player2") nextTurn = "player1"
    const currentPlayer = document.querySelector(`[data-score="${currentTurn}"]`).parentElement
    currentPlayer.classList.remove("turn")
    const nextPlayer = document.querySelector(`[data-score="${nextTurn}"]`).parentElement
    nextPlayer.classList.add("turn")
    return nextTurn
}

function checkAnswer(e) {
    if (e.target.attributes.title.textContent === targetRegion.textContent) {
        resetTimer()
        e.target.classList.add("correct")
        awardPoints()
        removeFromPool(e.target)
        setTargetRegion(e.target.attributes.title.textContent)
        setTurn(game.turn)
        game.runningTimer = setInterval(updateTimer, 1000)
    }
    else {
        resetTimer()
        e.target.classList.add("wrong")
        setTimeout(() => e.target.classList.remove("wrong"), 500)
        setTurn(game.turn)
        game.runningTimer = setInterval(updateTimer, 1000)
    }
}

regions.forEach(region => {
    regionNames.push(region.attributes.title.textContent)
    region.addEventListener("click", checkAnswer)
})

setTargetRegion()
game.turn = setTurn(game.turn)
game.runningTimer = setInterval(updateTimer, 1000)

