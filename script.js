const ideologies = ["Accelerationism", "Anarchism", "Vanguard Socialism", "Popular Socialism", "Revisionist Socialism", "Progressivism", "Liberalism", "Conservatism", "Polyarchy", "Despotism", "Reactionaryism"]
const accelerationism = ["Fiumanism", "Futurism", "National Rejuvenatism", "Neo-Folkism", "Surrealism", "Technocracy", "Vperedism"]
const anarchism = ["Individualist Anarchism", "Mystical Anarchism", "National Anarchism", "Social Anarchism", "Statelessness", "Stratocratic Anarchism"]
const vanguardSocialism = ["Leninism", "National Vanguardism", "Social Republicanism", "State Socialism", "Stratocratic Socialism"]
const popularSocialism = ["Folk Socialism", "National Syndicalism", "Spartakism", "Syndicalism"]
const revisionistSocialism = ["Agrarian Socialism", "Democratic Socialism", "Esoteric Socialism", "Nationalist Socialism", "Religious Socialism", "Utopian Socialism"]
const progressivism = ["Left-Populism", "Liberal Socialism", "Progressive Corporatism", "Progressive Democracy", "Social Nationalism"]
const liberalism = ["Classical Liberalism", "Libertarian Capitalism", "National Liberalism", "Social Liberalism"]
const conservatism = ["Liberal Conservatism", "National Conservatism", "Right-Populism", "Social Conservatism"]
const polyarchy = ["Anocracy", "Colonial Government", "National Democracy", "Oligarchy", "Plutocracy", "Praetorian Oligarchy", "Provisional Government"]
const despotism = ["Absolute Monarchy", "Constitutional Dictatorship", "Constitutional Monarchy", "Military Dictatorship", "Personalist Dictatorship", "Revolutionary Nationalism", "Theocracy"]
const reactionaryism = ["Aristocratic Reaction", "Esoteric Reactionism", "Reactionary Populism", "Religious Fundamentalism"]
const subideologyGroups = [accelerationism, anarchism, vanguardSocialism, popularSocialism, revisionistSocialism, progressivism, liberalism, conservatism, polyarchy, despotism, reactionaryism]
const colors = ["#f8f8f8", "#a4946e", "#c3350a", "#ec494c", "#ffae43", "#f87f9d", "#f6e86f", "#7197ff", "#6e6e6e", "#292929", "#8046a4"]
function setupImageUpload(buttonId, targetId) {
    document.getElementById(buttonId).addEventListener("click", () => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*"
        input.onchange = e => {
            if (e.target.files[0]) {
                const reader = new FileReader()
                reader.onload = event => {
                    const target = document.getElementById(targetId)
                    target.style.backgroundImage = `url(${event.target.result})`
                    target.style.backgroundSize = "cover"
                }
                reader.readAsDataURL(e.target.files[0])
            }
        }
        input.click()
    })
}
setupImageUpload("flagUpload", "flag")
setupImageUpload("portraitUpload", "portrait")
setupImageUpload("focusUpload", "focusIcon")
function setupImageEdit(buttonId, targetId) {
    document.getElementById(buttonId).addEventListener("click", () => {
        const target = document.getElementById(targetId)
        target.style.backgroundSize = getComputedStyle(target).backgroundSize.includes("cover") ? "contain" : "cover"
    })
}
setupImageEdit("flagEdit", "flag")
setupImageEdit("portraitEdit", "portrait")
setupImageEdit("focusEdit", "focusIcon")
function setupImageReset(buttonId, targetId) { document.getElementById(buttonId).addEventListener("click", () => { document.getElementById(targetId).style.backgroundImage = "none" }) }
setupImageReset("flagReset", "flag")
setupImageReset("portraitReset", "portrait")
setupImageReset("focusReset", "focusIcon")
const editableDivs = ["country", "faction", "leader", "stability", "warSupport", "party", "election", "focus"]
editableDivs.forEach(divId => {
    const div = document.getElementById(divId)
    div.addEventListener("click", function () {
        this.setAttribute("contenteditable", "plaintext-only")
        this.focus()
        const range = document.createRange()
        range.selectNodeContents(this)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
    })
    div.addEventListener("blur", function () { this.removeAttribute("contenteditable") })
})
let selectedIdeology = 0
let selectedSubideology = -1
let ideologyButtons = []
let subideologyButtons = []
for (let i = 0; i < ideologies.length; i++) {
    const ideologyElement = document.createElement("ideology")
    ideologyElement.innerHTML = `<img src="./icon/${ideologies[i]}.png"><div>${ideologies[i]}</div>`
    ideologyElement.dataset.index = i
    ideologyElement.addEventListener("click", function () { toggleIdeology(this) })
    document.getElementById("ideologyPicker").appendChild(ideologyElement)
    ideologyButtons.push(ideologyElement)
}
function toggleIdeology(ideologyButton) {
    selectedIdeology = parseInt(ideologyButton.dataset.index)
    selectedSubideology = -1
    for (let i = 0; i < ideologyButtons.length; i++) {
        const button = ideologyButtons[i]
        if (i === selectedIdeology) {
            button.style.border = "3px solid #505050"
            button.style.outline = `3px solid ${colors[i]}`
        }
        else {
            button.style.border = "3px solid #303030"
            button.style.outline = "3px solid #404040"
        }
    }
    document.getElementById("icon").style.backgroundImage = `url("./icon/${ideologies[selectedIdeology]}.png")`
    document.getElementById("portraitBackground").style.backgroundImage = `url("./portraitBackground/${ideologies[selectedIdeology]}.png")`
    document.getElementById("ideology").innerText = ideologies[selectedIdeology]
    document.getElementById("subideology").innerText = ideologies[selectedIdeology]
    const portrait = document.getElementById("portrait")
    const currentPortrait = getComputedStyle(portrait).backgroundImage
    if (currentPortrait.includes("Polzl.png")) { portrait.style.backgroundImage = "url(./Schleicher.png)" }
    updateSubideologies()
}
function updateSubideologies() {
    const container = document.getElementById("subideologyPicker")
    const title = container.querySelector(".title")
    container.innerHTML = ""
    container.appendChild(title)
    subideologyButtons = []
    for (let j = 0; j < subideologyGroups[selectedIdeology].length; j++) {
        const subideologyElement = document.createElement("ideology")
        subideologyElement.innerHTML = `<img src="./icon/${ideologies[selectedIdeology]}/${subideologyGroups[selectedIdeology][j]}.png"><div>${subideologyGroups[selectedIdeology][j]}</div>`
        subideologyElement.dataset.index = j
        subideologyElement.addEventListener("click", function () { toggleSubideology(this) })
        container.appendChild(subideologyElement)
        subideologyButtons.push(subideologyElement)
    }
}
function toggleSubideology(subideologyButton) {
    selectedSubideology = parseInt(subideologyButton.dataset.index)
    for (let i = 0; i < subideologyButtons.length; i++) {
        const button = subideologyButtons[i]
        if (i === selectedSubideology) {
            button.style.border = "3px solid #505050"
            button.style.outline = `3px solid ${colors[selectedIdeology]}`
        }
        else {
            button.style.border = "3px solid #303030"
            button.style.outline = "3px solid #404040"
        }
    }
    document.getElementById("icon").style.backgroundImage = `url("./icon/${ideologies[selectedIdeology]}/${subideologyGroups[selectedIdeology][selectedSubideology]}.png")`
    document.getElementById("subideology").innerText = subideologyGroups[selectedIdeology][selectedSubideology]
    const portrait = document.getElementById("portrait")
    const currentPortrait = getComputedStyle(portrait).backgroundImage
    const currentSubideology = subideologyGroups[selectedIdeology][selectedSubideology]
    const isSpecialSubideology = currentSubideology === "Spartakism" || currentSubideology === "Leninism"
    if (currentPortrait.includes("Schleicher.png") && isSpecialSubideology) { portrait.style.backgroundImage = "url(./Polzl.png)" }
    else if (currentPortrait.includes("Polzl.png") && !isSpecialSubideology) { portrait.style.backgroundImage = "url(./Schleicher.png)" }
}
let percentages = [5, 5, 0, 0, 0, 0, 10, 10, 15, 40, 15]
let lockedPercentages = new Array(colors.length).fill(false)
function createInputs() {
    const container = document.getElementById("popularityAdjuster")
    container.innerHTML = ""
    const equalizeBtn = document.createElement("button")
    equalizeBtn.id = "equalizationButton"
    equalizeBtn.textContent = "Equalize"
    equalizeBtn.addEventListener("click", equalizePercentages)
    container.appendChild(equalizeBtn)
    const randomBtn = document.createElement("button")
    randomBtn.id = "randomizationButton"
    randomBtn.textContent = "Randomize"
    randomBtn.addEventListener("click", randomizePercentages)
    container.appendChild(randomBtn)
    for (let i = 0; i < colors.length; i++) {
        const wrapper = document.createElement("div")
        wrapper.className = "percentageControl"
        const input = document.createElement("input")
        input.type = "number"
        input.min = "0"
        input.max = "100"
        input.value = percentages[i]
        input.dataset.index = i
        input.style.outline = `3px solid ${colors[i]}`
        input.addEventListener("input", function () { handlePercentageChange(this) })
        if (lockedPercentages[i]) input.disabled = true
        const lockBox = document.createElement("div")
        lockBox.style.border = `3px solid ${colors[i]}`
        lockBox.style.backgroundColor = lockedPercentages[i] ? "#404040" : "#f0f0f0"
        lockBox.dataset.index = i
        lockBox.addEventListener("click", function () {
            const idx = parseInt(this.dataset.index)
            lockedPercentages[idx] = !lockedPercentages[idx]
            this.style.backgroundColor = lockedPercentages[idx] ? "#404040" : "#f0f0f0"
            const input = document.querySelector(`#popularityAdjuster input[data-index="${idx}"]`)
            input.disabled = lockedPercentages[idx]
        })
        wrapper.appendChild(input)
        wrapper.appendChild(lockBox)
        container.appendChild(wrapper)
    }
}
function equalizePercentages() {
    const lockedTotal = percentages.reduce((sum, val, idx) => sum + (lockedPercentages[idx] ? val : 0), 0)
    const availableTotal = 100 - lockedTotal
    const unlockedIndices = percentages.map((_, i) => i).filter(i => !lockedPercentages[i])
    if (unlockedIndices.length === 0) return
    const baseShare = Math.floor(availableTotal / unlockedIndices.length)
    const remainder = availableTotal % unlockedIndices.length
    unlockedIndices.forEach((idx, i) => {
        percentages[idx] = baseShare + (i < remainder ? 1 : 0)
    })
    updateInputs()
    updateChart()
}
function handlePercentageChange(input) {
    const index = parseInt(input.dataset.index)
    if (lockedPercentages[index]) return
    const oldValue = percentages[index]
    let newValue = parseInt(input.value) || 0
    newValue = Math.max(0, Math.min(100, newValue))
    const lockedTotal = percentages.reduce((sum, val, i) => sum + (lockedPercentages[i] ? val : 0), 0)
    const maxAllowed = 100 - lockedTotal
    if (newValue > maxAllowed) newValue = maxAllowed
    percentages[index] = newValue
    const difference = newValue - oldValue
    if (difference !== 0) {
        let unlockedIndices = percentages.map((_, i) => i).filter(i => !lockedPercentages[i] && i !== index).sort((a, b) => percentages[a] - percentages[b])
        if (difference > 0) {
            let remaining = difference
            unlockedIndices.reverse().forEach(idx => {
                if (remaining <= 0) return
                const deduction = Math.min(percentages[idx], remaining)
                percentages[idx] = Math.max(0, percentages[idx] - deduction)
                remaining -= deduction
            })
            if (remaining > 0) percentages[index] = Math.max(0, newValue - remaining)
        } else {
            let remaining = -difference
            unlockedIndices.forEach(idx => {
                if (remaining <= 0) return
                const addition = Math.min(100 - percentages[idx], remaining)
                percentages[idx] += addition
                remaining -= addition
            })
        }
    }
    const currentTotal = percentages.reduce((a, b) => a + b, 0)
    if (currentTotal !== 100) {
        const adjustment = 100 - currentTotal
        const targetIdx = percentages.findIndex((val, i) => !lockedPercentages[i] && i !== index)
        if (targetIdx !== -1) percentages[targetIdx] += adjustment
    }
    updateInputs()
    updateChart()
}
function randomizePercentages() {
    const lockedTotal = percentages.reduce((sum, val, idx) => sum + (lockedPercentages[idx] ? val : 0), 0)
    const availableTotal = 100 - lockedTotal
    const unlockedIndices = percentages.map((_, i) => i).filter(i => !lockedPercentages[i])
    if (unlockedIndices.length === 0) return
    const weights = unlockedIndices.map(() => Math.random() + 0.1)
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    let remaining = availableTotal
    unlockedIndices.forEach((idx, i) => {
        const basePct = Math.floor((weights[i] / totalWeight) * availableTotal)
        percentages[idx] = Math.max(1, basePct)
        remaining -= percentages[idx]
    })
    while (remaining > 0) {
        unlockedIndices.forEach(idx => {
            if (remaining <= 0) return
            percentages[idx]++
            remaining--
        })
    }
    updateInputs()
    updateChart()
}
function updateInputs() {
    const inputs = document.querySelectorAll("#popularityAdjuster input")
    inputs.forEach((input, i) => { if (input !== document.activeElement) { input.value = percentages[i] } })
}
function updateChart() {
    let cumulative = 0
    let gradientStops = []
    for (let i = 0; i < colors.length; i++) {
        if (percentages[i] > 0) {
            const start = cumulative
            cumulative += percentages[i]
            const end = cumulative
            gradientStops.push(`${colors[i]} ${start}% ${end}%`)
        }
    }
    document.getElementById("pieChart").style.background = `conic-gradient(${gradientStops.join(", ")})`
    setTimeout(updateInputs, 0)
}
createInputs()
updateChart()