const BUILD_URL = 'https://diegofrr.github.io/vlibras/app/vlibras-plugin.js'
const CONSOLE_STYLE = 'font-size: 32px; color: #ffc83d; font-weight: bold';
const NEW_PLUGIN = false;

root = ['[vp', '[vw', '.vpw-', '.vp-', '.vw-']

document.querySelectorAll('style').forEach(style => {
    if (root.some(i => style.textContent.includes(i))) style.remove();
})

fetch(BUILD_URL).then(r => r.text()).then(eval).then(loadPlugin).then(remove)

function loadPlugin() {
    if (!NEW_PLUGIN) return;
    window.plugin = new window.VLibras.Plugin({
        rootPath: 'https://diegofrr.github.io/vlibras-widget-plus/app',
        wrapper: document.querySelector('[vw-plugin-wrapper]'),
        position: 'R',
        opacity: 1,
    });

    addSetPersonalization();
}

function remove() {
    document.querySelectorAll('[vw]').forEach(vw => {
        if (!vw.querySelector('[vp]')) {
            vw.removeAttribute('vw');
            vw.removeAttribute('vw-access-button')
        }
    })
}

function addSetPersonalization() {
    window.setPersonalization = (personalization) => {
        window.plugin.player.setPersonalization(personalization)
    }
}

const vwCount = document.querySelectorAll('[vw]').length;
if (vwCount > 1) console.log(`%c${vwCount} Widgets 😢`, CONSOLE_STYLE);

const isLocal = Array.from(document.querySelectorAll('script')).some(script => script.src.includes('vlibras'));
if (isLocal) console.log(`%cBuild local 😵`, CONSOLE_STYLE);
