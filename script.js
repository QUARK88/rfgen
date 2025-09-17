// You may notice that all of the code in this project is quite abysmal. Indeed it is. For a change, i decided to make a very low-effort botched site because i thought it was funny (It is in fact a lot of fun messing around with this casually). Rest assured that it works perfectly fine, it's just quite goofy and suboptimal.
import * as htmlToImage from "https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/+esm"
const page1 = document.getElementById("page1")
const page2 = document.getElementById("page2")
const page3 = document.getElementById("page3")
const page4 = document.getElementById("page4")
const pages = [page1, page2, page3, page4]
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
function show(page) {
    pages.forEach(element => {
        element.style.display = "none"
    })
    page.style.display = "block"
}
show(page1)
document.getElementById("page1Button").addEventListener("click", () => { show(page1) })
document.getElementById("page2Button").addEventListener("click", () => { show(page2) })
document.getElementById("page3Button").addEventListener("click", () => { show(page3) })
document.getElementById("page4Button").addEventListener("click", () => { show(page4) })
const dropZones = {
    "flagTooltip": "flag",
    "portraitTooltip": "portrait",
    "focusIcon": "focusIcon",
    "eventImageTooltip": "eventImage",
    "newsImageTooltip": "newsImage",
    "portraitScreenshot": "portraitScreenshot"
}
Object.keys(dropZones).forEach(dropZoneId => {
    const dropZone = document.getElementById(dropZoneId)
    const targetId = dropZones[dropZoneId]
    document.addEventListener("dragover", (e) => {
        e.preventDefault()
        dropZone.classList.add("highlight")
    })
    document.addEventListener("dragleave", () => {
        dropZone.classList.remove("highlight")
    })
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault()
        dropZone.classList.add("highlight2")
    })
    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("highlight2")
    })
    dropZone.addEventListener("drop", (e) => {
        e.preventDefault()
        Object.keys(dropZones).forEach(id => {
            const zone = document.getElementById(id)
            if (zone) {
                zone.classList.remove("highlight")
                zone.classList.remove("highlight2")
            }
        })
        const file = e.dataTransfer.files[0]
        if (file && file.type.match("image.*")) {
            const reader = new FileReader()
            reader.onload = (event) => {
                const target = document.getElementById(targetId)
                if (dropZoneId === "portraitScreenshot") {
                    state.uploadedImage = event.target.result
                    state.hasUploadedImage = true
                    elements.portraitScreenshot.innerHTML = ""
                    elements.portraitScreenshot.style.background = state.backgroundWhite ? "#fff" : "#000"
                    const img = new Image()
                    img.onload = async () => {
                        const sortedBackgrounds = await sortBackgroundsByRemoval(img)
                        if (sortedBackgrounds.length > 0) {
                            state.selectedBackground = sortedBackgrounds[0]
                            rebuildBackgroundSelector(sortedBackgrounds)
                            state.isSortingBackgrounds = false
                            await processImage()
                        }
                    }
                    img.src = state.uploadedImage
                } else {
                    target.style.backgroundImage = `url(${event.target.result})`
                }
            }
            reader.readAsDataURL(file)
        }
    })
})
document.getElementById("diploDownload").addEventListener("click", async () => {
    try {
        const element = document.getElementById("diploScreenshot")
        if (!element) throw new Error("Element not found")
        const clone = element.cloneNode(true)
        clone.style.position = "fixed"
        clone.style.top = "0"
        clone.style.left = "0"
        clone.style.zIndex = "999999"
        clone.style.visibility = "hidden"
        clone.style.background = "transparent"
        document.body.appendChild(clone)
        const clonedFlag = clone.querySelector("#flagOverlay")
        if (clonedFlag) {
            clonedFlag.style.animation = "none"
            clonedFlag.style.backgroundImage = 'url("./flagAnimation/23.png")'
        }
        await new Promise(resolve => setTimeout(resolve, 50))
        clone.style.visibility = "visible"
        const options = {
            backgroundColor: null,
            width: element.offsetWidth,
            height: element.offsetHeight,
            cacheBust: true
        }
        const dataURL = await htmlToImage.toPng(clone, options)
        const link = document.createElement("a")
        link.href = dataURL
        const hasLeader = leader && leader !== "Click to edit leader name"
        const hasCountry = country && country !== "Click to edit country name"
        if (hasLeader && hasCountry) {
            link.download = `Red Flood Diplo ${leader} ${country}.png`
        } else if (hasLeader) {
            link.download = `Red Flood Diplo ${leader}.png`
        } else if (hasCountry) {
            link.download = `Red Flood Diplo ${country}.png`
        } else {
            link.download = "Red Flood Diplo.png"
        }
        document.body.appendChild(link)
        link.click()
        setTimeout(() => document.body.removeChild(link), 100)

    } catch (error) {
        console.error("Screenshot failed:", error)
        alert("Screenshot downloading is not supported on this browser. Chrome-based browsers seem to work just fine, so you might wanna try there. Not my fault the modules suck, i'm a Firefox user myself and this pisses me off.")
    } finally {
        const clones = document.querySelectorAll('#diploScreenshot[style*="fixed"]')
        clones.forEach(clone => document.body.removeChild(clone))
    }
})
document.getElementById("eventDownload").addEventListener("click", async () => {
    try {
        const element = document.getElementById("eventScreenshot")
        if (!element) throw new Error("Element not found")
        const clone = element.cloneNode(true)
        clone.style.position = "fixed"
        clone.style.top = "0"
        clone.style.left = "0"
        clone.style.zIndex = "999999"
        clone.style.visibility = "hidden"
        clone.style.background = "transparent"
        document.body.appendChild(clone)
        await new Promise(resolve => setTimeout(resolve, 50))
        clone.style.visibility = "visible"
        const options = {
            backgroundColor: null,
            width: element.offsetWidth,
            height: element.offsetHeight,
            cacheBust: true
        }
        const dataURL = await htmlToImage.toPng(clone, options)
        const link = document.createElement("a")
        link.href = dataURL
        if (eventTitle && eventTitle !== "Click to edit event title") {
            link.download = `Red Flood Event ${eventTitle}.png`
        }
        else {
            link.download = `Red Flood Event.png`
        }
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (error) {
        console.error("Screenshot failed:", error)
        alert("Screenshot downloading is not supported on this browser. Chrome-based browsers seem to work just fine, so you might wanna try there. Not my fault the modules suck, i'm a Firefox user myself and this pisses me off.")
    } finally {
        const clones = document.querySelectorAll('#eventScreenshot[style*="fixed"]')
        clones.forEach(clone => document.body.removeChild(clone))
    }
})
document.getElementById("newsDownload").addEventListener("click", async () => {
    try {
        const element = document.getElementById("newsScreenshot")
        if (!element) throw new Error("Element not found")
        const clone = element.cloneNode(true)
        clone.style.position = "fixed"
        clone.style.top = "0"
        clone.style.left = "0"
        clone.style.zIndex = "999999"
        clone.style.visibility = "hidden"
        clone.style.background = "transparent"
        document.body.appendChild(clone)
        await new Promise(resolve => setTimeout(resolve, 50))
        clone.style.visibility = "visible"
        const options = {
            backgroundColor: null,
            width: element.offsetWidth,
            height: element.offsetHeight,
            cacheBust: true
        }
        const dataURL = await htmlToImage.toPng(clone, options)
        const link = document.createElement("a")
        link.href = dataURL
        if (newsTitle && newsTitle !== "Click to edit news title") {
            link.download = `Red Flood News ${newsTitle}.png`
        }
        else {
            link.download = `Red Flood News.png`
        }
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (error) {
        console.error("Screenshot failed:", error)
        alert("Screenshot downloading is not supported on this browser. Chrome-based browsers seem to work just fine, so you might wanna try there. Not my fault the modules suck, i'm a Firefox user myself and this pisses me off.")
    } finally {
        const clones = document.querySelectorAll('#newsScreenshot[style*="fixed"]')
        clones.forEach(clone => document.body.removeChild(clone))
    }
})
document.getElementById("portraitDownload").addEventListener("click", async () => {
    try {
        const element = document.getElementById("portraitScreenshot")
        if (!element) throw new Error("Element not found")
        const clone = element.cloneNode(true)
        clone.style.position = "fixed"
        clone.style.top = "0"
        clone.style.left = "0"
        clone.style.zIndex = "999999"
        clone.style.visibility = "hidden"
        clone.style.backgroundColor = "transparent"
        document.body.appendChild(clone)
        await new Promise(resolve => setTimeout(resolve, 50))
        clone.style.visibility = "visible"
        const options = {
            backgroundColor: null,
            width: element.offsetWidth,
            height: element.offsetHeight,
            cacheBust: true
        }
        const dataURL = await htmlToImage.toPng(clone, options)
        const link = document.createElement("a")
        link.href = dataURL
        link.download = `Red Flood Portrait.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (error) {
        console.error("Screenshot failed:", error)
        alert("Screenshot downloading is not supported on this browser. Chrome-based browsers seem to work just fine, so you might wanna try there. Not my fault the modules suck, i'm a Firefox user myself and this pisses me off.")
    } finally {
        const clones = document.querySelectorAll('#portraitScreenshot[style*="fixed"]')
        clones.forEach(clone => document.body.removeChild(clone))
    }
})
const state = {
    uploadedImage: null,
    selectedBackground: null,
    tolerance: 20,
    hideIsolated: true,
    backgrounds: [...ideologies, "General"],
    hasUploadedImage: false,
    isProcessing: false,
    isSortingBackgrounds: false,
    backgroundWhite: true
}
const elements = {
    portraitScreenshot: document.getElementById("portraitScreenshot"),
    toleranceSlider: document.getElementById("toleranceSlider"),
    toleranceValue: document.getElementById("toleranceValue"),
    isolatedToggle: document.getElementById("isolatedToggle"),
    backgroundSelector: document.getElementById("backgroundSelector"),
    portraitUpload2: document.getElementById("portraitUpload2"),
    portraitColor: document.getElementById("portraitColor")
}
const initializePlaceholder = () => {
    elements.portraitScreenshot.style.background = `url("./portraitPlaceholder.png") center/cover no-repeat,white`
    elements.portraitScreenshot.innerHTML = ""
    state.hasUploadedImage = false
}
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}
function findEdgeConnectedPixels(diffMap, width, height) {
    const edgeMap = new Uint8Array(diffMap.length)
    const queue = []
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = y * width + x
            if ((x === 0 || x === width - 1 || y === 0 || y === height - 1) && diffMap[idx]) {
                queue.push([x, y])
                edgeMap[idx] = 1
            }
        }
    }
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]
    while (queue.length) {
        const [x, y] = queue.shift()
        for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nIdx = ny * width + nx
                if (diffMap[nIdx] && !edgeMap[nIdx]) {
                    edgeMap[nIdx] = 1
                    queue.push([nx, ny])
                }
            }
        }
    }
    return edgeMap
}
document.getElementById("portraitColor").addEventListener("click", toggleBackgroundColor)
async function processImage() {
    if (!state.uploadedImage || !state.selectedBackground || state.isSortingBackgrounds) return
    state.isProcessing = true
    try {
        const [compositeImg, bgImg] = await Promise.all([
            loadImage(state.uploadedImage),
            loadImage(`./portraitBackground/${state.selectedBackground}.png`)
        ])
        const canvas = document.createElement("canvas")
        canvas.width = 156
        canvas.height = 210
        const ctx = canvas.getContext("2d")
        ctx.fillStyle = state.backgroundWhite ? "#fff" : "#000"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        const bgScale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height)
        const bgX = (canvas.width - bgImg.width * bgScale) / 2
        const bgY = (canvas.height - bgImg.height * bgScale) / 2
        ctx.drawImage(bgImg, bgX, bgY, bgImg.width * bgScale, bgImg.height * bgScale)
        const bgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const compScale = Math.max(canvas.width / compositeImg.width, canvas.height / compositeImg.height)
        const compX = (canvas.width - compositeImg.width * compScale) / 2
        const compY = (canvas.height - compositeImg.height * compScale) / 2
        ctx.drawImage(compositeImg, compX, compY, compositeImg.width * compScale, compositeImg.height * compScale)
        const compositeData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const diffMap = new Uint8Array(compositeData.data.length / 4)
        for (let i = 0; i < compositeData.data.length; i += 4) {
            const rDiff = Math.abs(compositeData.data[i] - bgData.data[i])
            const gDiff = Math.abs(compositeData.data[i + 1] - bgData.data[i + 1])
            const bDiff = Math.abs(compositeData.data[i + 2] - bgData.data[i + 2])
            diffMap[i / 4] = (rDiff < state.tolerance && gDiff < state.tolerance && bDiff < state.tolerance) ? 1 : 0
        }
        if (state.hideIsolated) {
            const edgeMap = findEdgeConnectedPixels(diffMap, canvas.width, canvas.height)
            for (let i = 0; i < compositeData.data.length; i += 4) {
                if (diffMap[i / 4] && !edgeMap[i / 4]) diffMap[i / 4] = 0
            }
        }
        for (let i = 0; i < compositeData.data.length; i += 4) {
            if (diffMap[i / 4]) compositeData.data[i + 3] = 0
        }
        ctx.putImageData(compositeData, 0, 0)
        const resultImg = new Image()
        resultImg.src = canvas.toDataURL()
        elements.portraitScreenshot.innerHTML = ""
        elements.portraitScreenshot.appendChild(resultImg)
    } catch (error) {
        console.error("Image processing error:", error)
    } finally {
        state.isProcessing = false
    }
}
async function sortBackgroundsByRemoval(compositeImg) {
    const backgroundScores = []
    const SORTING_TOLERANCE = 20
    for (const ideology of state.backgrounds) {
        try {
            const bgImg = await loadImage(`./portraitBackground/${ideology}.png`)
            const canvas = document.createElement("canvas")
            canvas.width = 156
            canvas.height = 210
            const ctx = canvas.getContext("2d")
            const bgScale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height)
            const bgX = (canvas.width - bgImg.width * bgScale) / 2
            const bgY = (canvas.height - bgImg.height * bgScale) / 2
            ctx.drawImage(bgImg, bgX, bgY, bgImg.width * bgScale, bgImg.height * bgScale)
            const bgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const compScale = Math.max(canvas.width / compositeImg.width, canvas.height / compositeImg.height)
            const compX = (canvas.width - compositeImg.width * compScale) / 2
            const compY = (canvas.height - compositeImg.height * compScale) / 2
            ctx.drawImage(compositeImg, compX, compY, compositeImg.width * compScale, compositeImg.height * compScale)
            const compositeData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            let removedPixels = 0
            const diffMap = new Uint8Array(compositeData.data.length / 4)
            for (let i = 0; i < compositeData.data.length; i += 4) {
                const rDiff = Math.abs(compositeData.data[i] - bgData.data[i])
                const gDiff = Math.abs(compositeData.data[i + 1] - bgData.data[i + 1])
                const bDiff = Math.abs(compositeData.data[i + 2] - bgData.data[i + 2])
                if (rDiff < SORTING_TOLERANCE && gDiff < SORTING_TOLERANCE && bDiff < SORTING_TOLERANCE) {
                    diffMap[i / 4] = 1
                    removedPixels++
                }
            }
            if (state.hideIsolated) {
                const edgeMap = findEdgeConnectedPixels(diffMap, canvas.width, canvas.height)
                for (let i = 0; i < compositeData.data.length; i += 4) {
                    if (diffMap[i / 4] && !edgeMap[i / 4]) removedPixels--
                }
            }
            backgroundScores.push({ ideology, score: removedPixels })
        } catch (e) {
            console.error(`Error processing ${ideology}:`, e)
        }
    }
    return backgroundScores.sort((a, b) => b.score - a.score).map(item => item.ideology)
}
elements.portraitUpload2.addEventListener("change", async function (e) {
    const file = e.target.files[0]
    if (!file) return
    state.isSortingBackgrounds = true
    const reader = new FileReader()
    reader.onload = async function (e) {
        state.uploadedImage = e.target.result
        state.hasUploadedImage = true
        elements.portraitScreenshot.innerHTML = ""
        elements.portraitScreenshot.style.background = state.backgroundWhite ? "#fff" : "#000"
        const img = new Image()
        img.onload = async () => {
            const sortedBackgrounds = await sortBackgroundsByRemoval(img)
            if (sortedBackgrounds.length > 0) {
                state.selectedBackground = sortedBackgrounds[0]
                rebuildBackgroundSelector(sortedBackgrounds)
                state.isSortingBackgrounds = false
                await processImage()
            }
        }
        img.src = state.uploadedImage
    }
    reader.readAsDataURL(file)
})
function toggleBackgroundColor() {
    if (!elements.portraitColor) return
    state.backgroundWhite = !state.backgroundWhite
    elements.portraitColor.textContent = state.backgroundWhite ? "Turn Background Black" : "Turn Background White"
    elements.portraitScreenshot.style.backgroundColor = state.backgroundWhite ? "#fff" : "#000"
    if (state.hasUploadedImage) processImage()
}
function rebuildBackgroundSelector(backgrounds) {
    elements.backgroundSelector.innerHTML = ""
    backgrounds.forEach(ideology => {
        const container = document.createElement("div")
        container.classList.add("backgroundContainer")
        if (ideology === state.selectedBackground) {
            container.classList.add("selectedBackground")
        }
        const img = document.createElement("img")
        img.src = `./portraitBackground/${ideology}.png`
        const name = document.createElement("div")
        name.textContent = ideology
        container.addEventListener("click", async () => {
            if (state.isProcessing || state.isSortingBackgrounds) return
            document.querySelectorAll(".backgroundContainer").forEach(c => {
                c.classList.remove("selectedBackground")
            })
            container.classList.add("selectedBackground")
            state.selectedBackground = ideology
            await processImage()
        })
        container.appendChild(img)
        container.appendChild(name)
        elements.backgroundSelector.appendChild(container)
    })
}
function updateTolerance() {
    state.tolerance = parseFloat(elements.toleranceSlider.value)
    elements.toleranceValue.textContent = `Tolerance: ${state.tolerance.toFixed(1)}`
    if (state.hasUploadedImage) {
        requestAnimationFrame(() => {
            processImage()
        })
    }
}
function toggleIsolated() {
    state.hideIsolated = !state.hideIsolated
    elements.isolatedToggle.classList.toggle("active", state.hideIsolated)
    elements.isolatedToggle.textContent = state.hideIsolated ? "Hide Isolated Pixels" : "Show Isolated Pixels"
    if (state.hasUploadedImage) {
        const img = new Image()
        img.onload = async () => {
            const sortedBackgrounds = await sortBackgroundsByRemoval(img)
            rebuildBackgroundSelector(sortedBackgrounds)
            await processImage()
        }
        img.src = state.uploadedImage
    }
}
window.addEventListener("DOMContentLoaded", () => {
    initializePlaceholder()
    elements.toleranceSlider.value = state.tolerance
    elements.toleranceValue.textContent = `Tolerance: ${state.tolerance.toFixed(1)}`
    elements.toleranceSlider.addEventListener("input", updateTolerance)
    elements.isolatedToggle.addEventListener("click", toggleIsolated)
    if (elements.portraitColor) {
        elements.portraitColor.addEventListener("click", toggleBackgroundColor)
    }
    rebuildBackgroundSelector(state.backgrounds)
})
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
setupImageUpload("flagTooltip", "flag")
setupImageUpload("portraitTooltip", "portrait")
setupImageUpload("focusIcon", "focusIcon")
setupImageUpload("eventImageUpload", "eventImage")
setupImageUpload("eventImageTooltip", "eventImage")
setupImageUpload("newsImageUpload", "newsImage")
setupImageUpload("newsImageTooltip", "newsImage")
const options = [
    ["cover", "center center"],
    ["cover", "bottom center"],
    ["cover", "top center"],
    ["cover", "left center"],
    ["cover", "right center"],
    ["contain", "center center"],
    ["contain", "bottom center"],
    ["contain", "top center"],
    ["contain", "left center"],
    ["contain", "right center"]
]
function setupImageEdit(buttonId, targetId) {
    let currentIndex = 0
    document.getElementById(buttonId).addEventListener("click", () => {
        const target = document.getElementById(targetId)
        currentIndex = (currentIndex + 1) % options.length
        target.style.backgroundSize = options[currentIndex][0]
        target.style.backgroundPosition = options[currentIndex][1]
    })
}
setupImageEdit("flagEdit", "flag")
setupImageEdit("portraitEdit", "portrait")
setupImageEdit("focusEdit", "focusIcon")
setupImageEdit("eventImageEdit", "eventImage")
setupImageEdit("newsImageEdit", "newsImage")
document.addEventListener("DOMContentLoaded", () => {
    let currentIndex = 0
    const zoneToTargetMap = {
        flagTooltip: "flag",
        portraitTooltip: "portrait",
        focusIcon: "focusIcon",
        eventImageTooltip: "eventImage",
        newsImageTooltip: "newsImage"
    }
    Object.keys(zoneToTargetMap).forEach(zoneId => {
        const element = document.getElementById(zoneId)
        element.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            const target = document.getElementById(zoneToTargetMap[zoneId])
            currentIndex = (currentIndex + 1) % options.length
            target.style.backgroundSize = options[currentIndex][0]
            target.style.backgroundPosition = options[currentIndex][1]
        })
    })
})
function setupImageReset(buttonId, targetId) { document.getElementById(buttonId).addEventListener("click", () => { document.getElementById(targetId).style.backgroundImage = "none" }) }
setupImageReset("flagReset", "flag")
setupImageReset("portraitReset", "portrait")
setupImageReset("focusReset", "focusIcon")
setupImageReset("eventImageReset", "eventImage")
setupImageReset("newsImageReset", "newsImage")
const editableDivs = ["country", "faction", "leader", "stability", "warSupport", "party", "election", "focus", "eventTitle", "eventQuote", "eventButton", "newsTitle", "newsText", "newsButton"]
editableDivs.forEach(divId => {
    window[divId] = document.getElementById(divId).textContent
})
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
        window[divId] = this.textContent
    })
    div.addEventListener("input", function () {
        window[divId] = this.textContent
    })
})
let eventTemplateButton = true
document.getElementById("eventTemplateSwitch").addEventListener("click", function () {
    const eventScreenshot = document.getElementById("eventScreenshot")
    const eventOverlay = document.getElementById("eventOverlay")
    const eventButton = document.getElementById("eventButton")
    const eventTemplateSwitch = document.getElementById("eventTemplateSwitch")
    if (eventTemplateButton) {
        eventScreenshot.style.height = "534px"
        eventOverlay.style.height = "534px"
        eventOverlay.style.backgroundImage = "url(./eventOverlay.png)"
        eventButton.style.display = "none"
        eventTemplateSwitch.innerText = "Add Event Button"
        eventTemplateButton = false
    } else {
        eventScreenshot.style.height = "618px"
        eventOverlay.style.height = "618px"
        eventOverlay.style.backgroundImage = "url(./eventOverlayButton.png)"
        eventButton.style.display = "flex"
        eventTemplateSwitch.innerText = "Remove Event Button"
        eventTemplateButton = true
    }
})
let descriptions = {}
fetch("./descriptions.json")
    .then(response => response.json())
    .then(data => descriptions = data)
    .then(() => initIdeologies())
    .catch(err => console.error("Error loading descriptions:", err))
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
    if (currentPortrait.includes("Polzl.png")) { portrait.style.backgroundImage = "url(./Wrangel.png)" }
    updateSubideologies()
}
let selectedIdeology = -1
let selectedSubideology = -1
let ideologyButtons = []
let subideologyButtons = []
function initIdeologies() {
    for (let i = 0; i < ideologies.length; i++) {
        const ideologyElement = document.createElement("ideology")
        ideologyElement.innerHTML = `<img src="./icon/${ideologies[i]}.png"><div>${ideologies[i]}</div>`
        ideologyElement.dataset.index = i
        ideologyElement.addEventListener("click", function () { toggleIdeology(this) })
        document.getElementById("ideologyPicker").appendChild(ideologyElement)
        ideologyButtons.push(ideologyElement)
    }
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
    if (currentPortrait.includes("Wrangel.png") && isSpecialSubideology) { portrait.style.backgroundImage = "url(./Polzl.png)" }
    else if (currentPortrait.includes("Polzl.png") && !isSpecialSubideology) { portrait.style.backgroundImage = "url(./Wrangel.png)" }
}
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
        clearBox.classList.add("clearBox")
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
    const inputs = document.querySelectorAll("#popularityInputs input")
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
document.getElementById("randomizeIdeology").addEventListener("click", randomizeSubideology)
document.getElementById("randomizeStability").addEventListener("click", () => {
    document.getElementById("stability").innerText = `${Math.floor(Math.random() * 101)}%`
})
document.getElementById("randomizeWarSupport").addEventListener("click", () => {
    document.getElementById("warSupport").innerText = `${Math.floor(Math.random() * 101)}%`
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
function makeImagesNonDraggable() { document.querySelectorAll('img').forEach(img => { img.setAttribute('draggable', 'false') }) }
document.addEventListener('DOMContentLoaded', makeImagesNonDraggable)
const observer = new MutationObserver((mutations) => { mutations.forEach((mutation) => { if (mutation.addedNodes.length) { makeImagesNonDraggable() } }) })
observer.observe(document.body, { childList: true, subtree: true })