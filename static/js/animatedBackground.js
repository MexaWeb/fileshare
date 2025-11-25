const canvas = document.getElementById("animated-background");



let drawing = false

function draw(mousepos) {
    if (drawing) {
        return
    }
    const ctx = canvas.getContext("2d");

    canvas.width = document.body.getBoundingClientRect().width
    canvas.height = document.body.getBoundingClientRect().height

    let alpha = 0.2
    ctx.fillStyle = `rgba(100, 100, 100, ${alpha})`

    let width = 2
    let height = 2

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
                alpha = 1 - Math.min(distance / 1000, 1);
            }
            ctx.fillStyle = `rgba(100, 100, 100, ${alpha})`
            ctx.fillRect(x + xoffset, y + yoffset, width, height);
        }
        xoffset = 0
        yoffset += height + gap

    }
    drawing = false
}

draw()
document.addEventListener('mousemove', function(e) {
    let mousepos = [e.clientX, e.clientY]
    draw(mousepos)
})

