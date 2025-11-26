rootElement = document.documentElement
let currentTheme = "dark"

function toggletheme(themebutton) {
    themebutton.classList.remove(currentTheme)
    document.body.classList.remove(currentTheme)
    if (currentTheme == "dark") {
        currentTheme = "light";
    } else {
        currentTheme = "dark";
    }
    themebutton.classList.add(currentTheme)
    document.body.classList.add(currentTheme)

    if (currentTheme == "dark") {
        rootElement.style.setProperty('--color1', '#121212')
        rootElement.style.setProperty('--color2', '#1e1e1e')
        
        rootElement.style.setProperty('--color3', '#2c2c2c')
        rootElement.style.setProperty('--color4', '#3a3a3a')
        
        rootElement.style.setProperty('--color5', '#f0f8ff')
        rootElement.style.setProperty('--color6', '#d4d4d4')

        rootElement.style.setProperty('--textcolor', '#ffffff')
    } else {
        rootElement.style.setProperty('--color1', '#ffffff')
        rootElement.style.setProperty('--color2', '#e7e7e7ff')

        rootElement.style.setProperty('--color3', '#d1d1d1ff')
        rootElement.style.setProperty('--color4', '#d1d1d1ff')

        rootElement.style.setProperty('--color5', '#d1d1d1ff')
        rootElement.style.setProperty('--color6', '#aeaeaeff')

        rootElement.style.setProperty('--textcolor', '#000000')

    }

}