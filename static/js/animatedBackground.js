const canvas = document.getElementById("animated-background");



let drawing = false

function draw(mousepos) {
    if (drawing) {
        return
    }
    const ctx = canvas.getContext("2d");

    canvas.width = document.getElementsByTagName("main")[0].getBoundingClientRect().width
    canvas.height = document.getElementsByTagName("main")[0].getBoundingClientRect().height

    let alpha = 0.2
    ctx.fillStyle = `rgba(100, 100, 100, ${alpha})`

    let width = 3
    let height = 3

    let gap = 100
    let xoffset = 0
    let yoffset = 0

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawing = true
    for (let y = 0; y + yoffset < canvas.height; y++) {
        for (let x = 0; x + xoffset < canvas.width; x++) {
            xoffset += width + gap
            if (mousepos) {
                distance = Math.sqrt((x + xoffset - mousepos[0]) ** 2 + (y + yoffset - mousepos[1]) ** 2)
                alpha = 1 - Math.min(distance / 300, 1);
            }
            ctx.fillStyle = `rgba(100, 100, 100, ${alpha})`
            ctx.fillRect(x + xoffset, y + yoffset, width, height);
        }
        xoffset = 0
        yoffset += height + gap

    }
    drawing = false
}


document.addEventListener('mousemove', async function(e) {
    mousepos = [e.clientX, e.clientY]
    draw(mousepos)
})

