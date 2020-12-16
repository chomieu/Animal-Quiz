// Runs the function when the entire page has loaded
window.onload = function () {

    var audio = document.createElement("audio")
    audio.setAttribute("src", "sounds/CircleOfLife.wav")
    audio.loop = true
    document.querySelector("main").appendChild(audio)

    function playSound(source) {
        const sX = new Audio(source);
        sX.play();
    }

    // Object containing quiz questions and answers
    var quiz_qa = {
        qa1: [
            "What does a llama do when it's angry?",
            "Spits",
            "Stamps its hooves",
            "Goes off in a strop",
            "Writes a strongly-worded letter",
            "1"],
        qa2: [
            "What's the first thing a caterpillar usually eats after it's born?",
            "Other bugs",
            "Grass",
            "Its own eggshell",
            "Cheerios",
            "3"],
        qa3: [
            "How many hearts does an octopus have?",
            "One",
            "Two",
            "Three",
            "Eight",
            "3"],
        qa4: [
            "What is a baby rabbit called?",
            "Doe",
            "Hare",
            "Buck",
            "Kit",
            "4"],
        qa5: [
            "What do sea otters do while they sleep so they don't drift away?",
            "Lie on a rock",
            "Hold hands",
            "Grab onto something",
            "They don't sleep",
            "2"],
    }


    // The quiz and countdown timer begin when user clicks the start button 
    var startEl = document.getElementById("start")
    var timerEl = document.getElementById("timer")
    var timer
    var time = 100
    var score = null

    startEl.addEventListener("click", function (e) {
        e.preventDefault()
        audio.play()
        addQuiz()
        timer = setInterval(function () {
            if (time >= 0 && !score) {
                time--;
                timerEl.textContent = time;
            } else {
                result()
            }
        }, 1000)
    })


    // Clears the contents inside of the form
    var formEl = document.querySelector("form")

    function clearForm() {
        formEl.innerHTML = ""
    }


    // Adds quiz picture, question, and choices to the form
    var qNum = 0
    var aNum = Object.keys(quiz_qa).length
    var h2Cr = document.createElement("h2")
    var imgCr = document.createElement("img")

    function addQuiz() {
        clearForm()
        qNum++
        imgCr.setAttribute("src", "imgs/qa" + qNum + ".png")
        imgCr.setAttribute("class", "images")
        formEl.appendChild(imgCr)
        h2Cr.textContent = quiz_qa["qa" + qNum][0]
        formEl.appendChild(h2Cr)
        for (i = 1; i < aNum; i++) {
            var choice = document.createElement("button")
            choice.textContent = quiz_qa["qa" + qNum][i]
            choice.setAttribute("class", "btn btn-warning m-1 choices")
            choice.setAttribute("id", i)
            formEl.appendChild(choice)
        }
    }


    // Checks which button is pressed via ID
    // backBtn reloads the Start Quiz page
    // clearBtn clears the local storage
    // 1-4 answer choice buttons allow user to move on if the answer is correct 
    // and subtract 10 from the timer if the answer is incorrect
    formEl.addEventListener("click", function (e) {
        e.preventDefault()
        var et = e.target
        if (et.id === "backBtn") {
            location.reload()
        } else if (et.id === "clearBtn") {
            window.localStorage.clear()
            document.querySelector("ol").innerHTML = ""
        } else if (et.id === quiz_qa["qa" + qNum][aNum]) {
            et.setAttribute("style", "background-color: lawngreen")
            playSound("sounds/correct.wav")
            if (qNum !== 5) {
                setTimeout(function () {
                    addQuiz()
                }, 500)
            } else {
                setTimeout(function () {
                    result()
                }, 500)
            }
        } else if (parseInt(et.id) < aNum) {
            time = time - 10
            et.setAttribute("style", "background-color: red; color: white")
            playSound("sounds/wrong.wav")
        }
    })


    // Displays the result and asks for user's name input
    function result() {
        if (time < 0) {
            score = 0
            timerEl.textContent = 0
        } else {
            score = time
        }
        clearInterval(timer)
        clearForm()
        h2Cr.textContent = "Your Final Score: " + score
        formEl.appendChild(h2Cr)
        var inputCr = document.createElement("input")
        inputCr.setAttribute("placeholder", "Enter Your Name")
        inputCr.setAttribute("class", "text-center align-self-center choices")
        inputCr.setAttribute("id", "nameInput")
        formEl.appendChild(inputCr)
        var submitCr = document.createElement("button")
        submitCr.textContent = "Submit"
        submitCr.setAttribute("class", "btn btn-warning m-3")
        formEl.appendChild(submitCr)
        submitCr.addEventListener("click", storeUser)
    }


    // Saves user's score and name to local storage
    function storeUser(e) {
        e.preventDefault()
        var username = document.getElementById("nameInput").value.trim()
        localStorage.setItem(username, JSON.stringify(score))
        clearForm()
        viewHighScore()
    }


    // Shows highscores with an option to restart the quiz or clear highscores
    function viewHighScore() {
        h2Cr.textContent = "Highscores"
        formEl.appendChild(h2Cr)
        var names = Object.keys(localStorage)
        var scores = Object.values(localStorage)
        formEl.appendChild(document.createElement("ol"))
        for (i = 0; i < names.length; i++) {
            var item = document.createElement("li")
            item.textContent = names[i] + " - " + scores[i]
            document.querySelector("ol").appendChild(item)
        }
        var backCr = document.createElement("button")
        backCr.textContent = "Go Back"
        backCr.setAttribute("class", "btn btn-warning")
        backCr.setAttribute("id", "backBtn")
        formEl.appendChild(backCr)
        var clearCr = document.createElement("button")
        clearCr.textContent = "Clear Highscores"
        clearCr.setAttribute("class", "btn btn-warning m-3")
        clearCr.setAttribute("id", "clearBtn")
        formEl.appendChild(clearCr)
    }


    // Shows highscores when the View Highscores button is clicked
    hsBtn = document.getElementById("view-hs")
    hsBtn.addEventListener("click", function (e) {
        e.preventDefault()
        clearForm()
        viewHighScore()
    })
}