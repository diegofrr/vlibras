const BUILD_URL = 'http://127.0.0.1:5501/app/vlibras-plugin.js'
const CONSOLE_STYLE = 'font-size: 32px; color: #ffc83d; font-weight: bold';

root = ['[vp', '[vw', '.vpw-', '.vp-', '.vw-']

document.querySelectorAll('style').forEach(style => {
    if (root.some(i => style.textContent.includes(i))) style.remove();
})

fetch(BUILD_URL).then(r => r.text()).then(eval).then(remove);

function loadPlugin() {
    window.plugin = new window.VLibras.Plugin({
        rootPath: 'https://diegofrr.github.io/vlibras-widget-plus/app',
        wrapper: document.querySelector('[vw-plugin-wrapper]'),
        position: 'R',
        opacity: 1,
    });
}

function remove() {
    document.querySelectorAll('[vw]').forEach(vw => {
        if (!vw.querySelector('[vp]')) {
            vw.removeAttribute('vw');
            vw.removeAttribute('vw-access-button')
        }
    })
}

const vwCount = document.querySelectorAll('[vw]').length;
if (vwCount > 1) console.log(`%c${vwCount} Widgets 😢`, CONSOLE_STYLE);

const isLocal = document.querySelector('[vw]').innerHTML.includes(location.host);
if (isLocal) console.log(`%cBuild local 😵`, CONSOLE_STYLE);
