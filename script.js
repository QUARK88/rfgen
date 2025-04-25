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
                    target.style.backgroundPosition = "center"
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
function setupImageReset(buttonId, targetId) {
    document.getElementById(buttonId).addEventListener("click", () => {
        document.getElementById(targetId).style.backgroundImage = "none"
    })
}
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
    div.addEventListener("blur", function () {
        this.removeAttribute("contenteditable")
    })
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
    if (currentPortrait.includes("Polzl.png")) {
        portrait.style.backgroundImage = "url(./Schleicher.png)"
    }
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
    if (currentPortrait.includes("Schleicher.png") && isSpecialSubideology) {
        portrait.style.backgroundImage = "url(./Polzl.png)"
    }
    else if (currentPortrait.includes("Polzl.png") && !isSpecialSubideology) {
        portrait.style.backgroundImage = "url(./Schleicher.png)"
    }
}
let percentages = [5, 5, 0, 0, 0, 0, 10, 10, 15, 40, 15]
let compensate = true
function createInputs() {
    const container = document.getElementById("popularityAdjuster")
    container.innerHTML = ""
    const btnContainer = document.createElement("div")
    btnContainer.style.display = "flex"
    btnContainer.style.gap = "10px"
    btnContainer.style.marginBottom = "10px"
    const toggleBtn = document.createElement("button")
    toggleBtn.id = "compensationButton"
    toggleBtn.textContent = compensate ? "Disable Compensation" : "Enable Compensation"
    toggleBtn.addEventListener("click", function () {
        compensate = !compensate
        this.textContent = compensate ? "Disable Compensation" : "Enable Compensation"
    })
    const randomBtn = document.createElement("button")
    randomBtn.id = "randomizationButton"
    randomBtn.textContent = "Randomize"
    randomBtn.addEventListener("click", randomizePercentages)
    btnContainer.appendChild(toggleBtn)
    btnContainer.appendChild(randomBtn)
    container.appendChild(btnContainer)
    for (let i = 0; i < colors.length; i++) {
        const wrapper = document.createElement("div")
        wrapper.className = "percentage-control"
        const input = document.createElement("input")
        input.type = "number"
        input.min = "0"
        input.max = "100"
        input.value = percentages[i]
        input.dataset.index = i
        input.style.outline = `3px solid ${colors[i]}`
        input.addEventListener("input", function () { handlePercentageChange(this) })
        wrapper.appendChild(input)
        container.appendChild(wrapper)
    }
}
function randomizePercentages() {
    let nums = []
    let total = 0
    for (let i = 0; i < colors.length; i++) {
        const num = Math.floor(Math.random() * 100)
        nums.push(num)
        total += num
    }
    for (let i = 0; i < nums.length; i++) {
        percentages[i] = Math.round((nums[i] / total) * 100)
    }
    const sum = percentages.reduce((a, b) => a + b, 0)
    if (sum !== 100) { percentages[0] += 100 - sum }
    updateInputs()
    updateChart()
}
function handlePercentageChange(input) {
    const index = parseInt(input.dataset.index)
    let newValue = parseInt(input.value) || 0
    newValue = Math.max(0, Math.min(100, newValue))
    const difference = newValue - percentages[index]
    if (difference === 0) return
    percentages[index] = newValue
    if (compensate) {
        let remainingDifference = difference
        let currentIndex = difference > 0 ? (index + 1) % colors.length : (index - 1 + colors.length) % colors.length
        while (remainingDifference !== 0) {
            if (currentIndex === index) break
            if (difference > 0) {
                const available = percentages[currentIndex]
                const adjustment = Math.min(available, remainingDifference)
                percentages[currentIndex] -= adjustment
                remainingDifference -= adjustment
            }
            else {
                const available = 100 - percentages.reduce((a, b) => a + b, 0)
                const adjustment = Math.min(available, -remainingDifference)
                percentages[currentIndex] += adjustment
                remainingDifference += adjustment
            }
            currentIndex = difference > 0 ? (currentIndex + 1) % colors.length : (currentIndex - 1 + colors.length) % colors.length
        }
    }
    updateInputs()
    updateChart()
}
function updateInputs() {
    const inputs = document.querySelectorAll("#popularityAdjuster input")
    inputs.forEach((input, i) => {
        if (input !== document.activeElement) {
            input.value = percentages[i]
        }
    })
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