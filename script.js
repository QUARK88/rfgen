const ideologies = ["Accelerationism", "Anarchism", "Vanguard Socialism", "Popular Socialism", "Revisionist Socialism", "Progressivism", "Liberalism", "Conservatism", "Polyarchy", "Despotism", "Reactionism"]
const accelerationism = ["Fiumanism", "Futurism", "National Rejuvenatism", "Neo-Folkism", "Surrealism", "Technocracy", "Vperedism"]
const anarchism = ["Individualist Anarchism", "Mystical Anarchism", "National Anarchism", "Naturist Anarchism", "Social Anarchism", "Statelessness", "Stratocratic Anarchism"]
const vanguardSocialism = ["Leninism", "National Vanguardism", "Social Republicanism", "State Socialism", "Stratocratic Socialism"]
const popularSocialism = ["Folk Socialism", "National Syndicalism", "Spartakism", "Revolutionary Syndicalism"]
const revisionistSocialism = ["Agrarian Socialism", "Democratic Socialism", "Esoteric Socialism", "Nationalist Socialism", "Religious Socialism", "Utopian Socialism"]
const progressivism = ["Left Wing Populism", "Liberal Socialism", "Progressive Corporatism", "Progressive Democracy", "Social Nationalism"]
const liberalism = ["Classical Liberalism", "Libertarian Capitalism", "National Liberalism", "Social Liberalism"]
const conservatism = ["Liberal Conservatism", "National Conservatism", "Right Wing Populism", "Social Conservatism"]
const polyarchy = ["Anocracy", "Colonial Government", "National Democracy", "Oligarchy", "Plutocracy", "Praetorian Oligarchy", "Provisional Government"]
const despotism = ["Absolute Monarchy", "Constitutional Dictatorship", "Constitutional Monarchy", "Military Dictatorship", "Personalist Dictatorship", "Revolutionary Nationalism", "Theocracy"]
const reactionism = ["Aristocratic Reaction", "Reactionary Esotericism", "Reactionary Populism", "Religious Fundamentalism"]
const subideologyGroups = [accelerationism, anarchism, vanguardSocialism, popularSocialism, revisionistSocialism, progressivism, liberalism, conservatism, polyarchy, despotism, reactionism]
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
let selectedIdeology = -1
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
let descriptions = {}
function toggleIdeology(ideologyButton) {
    selectedIdeology = parseInt(ideologyButton.dataset.index)
    selectedSubideology = -1
    subideologyDescription.innerHTML = "Description of the selected subideology"
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
    const ideologyName = ideologies[selectedIdeology]
    document.getElementById("icon").style.backgroundImage = `url("./icon/${ideologyName}.png")`
    document.getElementById("portraitBackground").style.backgroundImage = `url("./portraitBackground/${ideologyName}.png")`
    document.getElementById("ideology").innerText = ideologyName
    document.getElementById("subideology").innerText = ideologyName
    document.getElementById("ideologyDescription").innerHTML = descriptions[ideologyName] || ""
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
    const subideologyName = subideologyGroups[selectedIdeology][selectedSubideology]
    document.getElementById("icon").style.backgroundImage = `url("./icon/${ideologies[selectedIdeology]}/${subideologyName}.png")`
    document.getElementById("subideology").innerText = subideologyName
    document.getElementById("subideologyDescription").innerHTML = descriptions[subideologyName] || ""
    const portrait = document.getElementById("portrait")
    const currentPortrait = getComputedStyle(portrait).backgroundImage
    const isSpecialSubideology = subideologyName === "Spartakism" || subideologyName === "Leninism"
    if (currentPortrait.includes("Schleicher.png") && isSpecialSubideology) { portrait.style.backgroundImage = "url(./Polzl.png)" }
    else if (currentPortrait.includes("Polzl.png") && !isSpecialSubideology) { portrait.style.backgroundImage = "url(./Schleicher.png)" }
}
fetch('./descriptions.json')
    .then(response => response.json())
    .then(data => descriptions = data)
    .catch(err => console.error('Error loading descriptions:', err))
let percentages = [5, 5, 0, 0, 0, 0, 10, 10, 15, 40, 15]
let lockedPercentages = new Array(colors.length).fill(false)
function createInputs() {
    const toolsDiv = document.getElementById("popularityTools")
    toolsDiv.innerHTML = ""
    const inputsDiv = document.getElementById("popularityInputs")
    inputsDiv.innerHTML = ""
    const equalizeBtn = document.createElement("button")
    equalizeBtn.id = "equalizationButton"
    equalizeBtn.textContent = "Equalize"
    equalizeBtn.addEventListener("click", equalizePercentages)
    toolsDiv.appendChild(equalizeBtn)
    const randomBtn = document.createElement("button")
    randomBtn.id = "randomizationButton"
    randomBtn.textContent = "Randomize"
    randomBtn.addEventListener("click", randomizePercentages)
    toolsDiv.appendChild(randomBtn)
    const ideologizeBtn = document.createElement("button")
    ideologizeBtn.id = "ideologizationButton"
    ideologizeBtn.textContent = "Ideologize"
    ideologizeBtn.addEventListener("click", ideologizePercentages)
    toolsDiv.appendChild(ideologizeBtn)
    const updateControlStates = () => {
        const unlockedCount = lockedPercentages.filter(locked => !locked).length
        for (let i = 0; i < colors.length; i++) {
            const input = document.querySelector(`input[data-index="${i}"]`)
            const lockBtn = document.querySelector(`div[data-index="${i}"]:nth-child(2)`)
            const clearBtn = document.querySelector(`div[data-index="${i}"]:last-child`)
            input.disabled = lockedPercentages[i]
            input.readOnly = !lockedPercentages[i] && unlockedCount <= 1
            const bgColor = lockedPercentages[i] ? "#404040" : "#f0f0f0"
            lockBtn.style.background = `${bgColor} url(./lock.svg) no-repeat center`
            lockBtn.style.backgroundSize = "60%"
            clearBtn.style.background = `${bgColor} url(./clear.svg) no-repeat center`
            clearBtn.style.backgroundSize = "60%"
        }
    }
    const canDistribute = (excludeIndex) => {
        return lockedPercentages.some((locked, i) => !locked && i !== excludeIndex)
    }
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
        input.addEventListener("input", function () {
            if (this.readOnly || lockedPercentages[i]) {
                this.value = percentages[i]
                return
            }
            handlePercentageChange(this)
        })
        const lockBox = document.createElement("div")
        lockBox.style.outline = `3px solid ${colors[i]}`
        lockBox.dataset.index = i
        lockBox.addEventListener("click", function () {
            const idx = parseInt(this.dataset.index)
            lockedPercentages[idx] = !lockedPercentages[idx]
            updateControlStates()
        })
        const clearBox = document.createElement("div")
        clearBox.style.outline = `3px solid ${colors[i]}`
        clearBox.dataset.index = i
        clearBox.addEventListener("click", function () {
            const idx = parseInt(this.dataset.index)
            if (!canDistribute(idx)) return
            const oldValue = percentages[idx]
            percentages[idx] = 0
            let remaining = oldValue
            const unlockedIndices = percentages.map((_, i) => i).filter(i => !lockedPercentages[i] && i !== idx)
            while (remaining > 0 && unlockedIndices.length > 0) {
                const minValue = Math.min(...unlockedIndices.map(i => percentages[i]))
                const minIndices = unlockedIndices.filter(i => percentages[i] === minValue)
                minIndices.forEach(i => {
                    if (remaining > 0) {
                        percentages[i]++
                        remaining--
                    }
                })
            }
            updateInputs()
            updateChart()
            updateControlStates()
        })
        wrapper.appendChild(input)
        wrapper.appendChild(lockBox)
        wrapper.appendChild(clearBox)
        inputsDiv.appendChild(wrapper)
    }
    updateControlStates()
}
function ideologizePercentages() {
    if (selectedIdeology < 0 || lockedPercentages.some(locked => locked)) return
    const pattern = [2, 3, 5, 10, 15, 30, 15, 10, 5, 3, 2]
    let remaining = 100
    for (let i = 0; i < ideologies.length; i++) {
        if (lockedPercentages[i]) remaining -= percentages[i]
        else percentages[i] = 0
    }
    const priorityList = []
    for (let distance = 0; distance < ideologies.length; distance++) {
        if (selectedIdeology - distance >= 0 && !lockedPercentages[selectedIdeology - distance]) {
            priorityList.push(selectedIdeology - distance)
        }
        if (distance > 0 && selectedIdeology + distance < ideologies.length && !lockedPercentages[selectedIdeology + distance]) {
            priorityList.push(selectedIdeology + distance)
        }
    }
    const sortedPattern = [...pattern].sort((a, b) => b - a)
    for (let i = 0; i < Math.min(sortedPattern.length, priorityList.length); i++) percentages[priorityList[i]] = sortedPattern[i]
    const currentTotal = percentages.reduce((a, b) => a + b, 0)
    const scaleFactor = remaining / currentTotal
    for (let i = 0; i < ideologies.length; i++) {
        if (!lockedPercentages[i]) percentages[i] = Math.round(percentages[i] * scaleFactor)
    }
    const total = percentages.reduce((a, b) => a + b, 0)
    if (total !== 100) percentages[selectedIdeology] += 100 - total
    updateInputs()
    updateChart()
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
    if (lockedPercentages[index]) {
        input.value = percentages[index]
        return
    }
    const oldValue = percentages[index]
    let newValue = parseInt(input.value) || 0
    newValue = Math.max(0, Math.min(100, newValue))
    const lockedTotal = percentages.reduce((sum, val, i) => sum + (lockedPercentages[i] ? val : 0), 0)
    const maxAllowed = 100 - lockedTotal
    if (newValue > maxAllowed) {
        newValue = maxAllowed
        input.value = newValue
    }
    percentages[index] = newValue
    const difference = newValue - oldValue
    if (difference !== 0) {
        let unlockedIndices = percentages.map((_, i) => i)
            .filter(i => !lockedPercentages[i] && i !== index)
            .sort((a, b) => percentages[a] - percentages[b])
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
                percentages[idx] = Math.max(0, Math.min(100, percentages[idx] + addition))
                remaining -= addition
            })
        }
    }
    const currentTotal = percentages.reduce((a, b) => a + b, 0)
    if (currentTotal !== 100) {
        const adjustment = 100 - currentTotal
        const targetIdx = percentages.findIndex((val, i) => !lockedPercentages[i] && i !== index)
        if (targetIdx !== -1) {
            percentages[targetIdx] = Math.max(0, Math.min(100, percentages[targetIdx] + adjustment))
        }
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
document.getElementById('randomizeIdeology').addEventListener('click', randomizeSubideology)
document.getElementById('randomizeStability').addEventListener('click', () => {
    document.getElementById('stability').innerText = `${Math.floor(Math.random() * 101)}%`
})
document.getElementById('randomizeWarSupport').addEventListener('click', () => {
    document.getElementById('warSupport').innerText = `${Math.floor(Math.random() * 101)}%`
})
function randomizeSubideology() {
    const allSubideologies = []
    subideologyGroups.forEach((group, ideologyIndex) => {
        group.forEach((subideology, subideologyIndex) => {
            allSubideologies.push({ ideologyIndex, subideologyIndex })
        })
    })
    if (allSubideologies.length > 0) {
        const randomPick = allSubideologies[Math.floor(Math.random() * allSubideologies.length)]
        const ideologyButton = ideologyButtons[randomPick.ideologyIndex]
        toggleIdeology(ideologyButton)
        setTimeout(() => {
            const subideologyButton = document.querySelector(`#subideologyPicker ideology[data-index="${randomPick.subideologyIndex}"]`)
            if (subideologyButton) toggleSubideology(subideologyButton)
        }, 0)
    }
}
createInputs()
updateChart()