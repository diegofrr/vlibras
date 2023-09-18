const $root = Array.from([document.body, ...document.body.children]);
// const vw = document.querySelector('div[vw]');

const hasTag = (el, tags) => tags.includes(el.tagName);
const isLinkOrButton = el => hasTag(el, ["A", "BUTTON"]);
const isSubmitInput = el => hasTag(el, "INPUT") && el.type === 'submit';
const isValidImage = el => hasTag(el, "IMG") && el.alt && !isNull(el.alt);
const isSelect = el => hasTag(el, "SELECT");
const isSVG = el => hasTag(el, ['SVG', 'PATH']);

function hasLinkAncestor(el) {
    while (el) {
        if ($root.includes(el)) break;
        if (isLinkOrButton(el) || (el.onclick && !isSVG(el))) return el;
        el = el.parentNode;
    } return null;
}

function isNull(str) {
    return str && str.trim();
}

function isValidElement(element) {

    // if (vw.contains(element)) return false;

    return element.matches('.vw-link-tooltip') ? false
        : hasTextContent(element)
        || hasLinkAncestor(element)
        || isSubmitInput(element)
        || isValidImage(element)
        || isSelect(element)
}

function hasTextContent(el) {
    const check = (item) => item.nodeType === Node.TEXT_NODE && item.textContent.trim();
    return Array.from(el.childNodes).some(e => check(e));
}

function highlightElement({ target: element }) {
    if (isValidElement(element)) element.classList.add('vw-text--hover');
}

function toggleChecked(element) {
    const input = element.parentElement.querySelector('input');
    if (input && (['radio', 'checkbox'].includes(input.type))) input.checked = !input.checked;
}

function printContent(event) {
    removeTooltips();
    const element = event.target;
    const isSubmit = isSubmitInput(element);

    if (!isValidElement(element)) return;

    event.preventDefault();
    event.stopPropagation();

    const textContent = (hasTag(element, 'IMG') ? element.alt
        : isSubmit ? element.value
            : hasTag(element, 'SELECT') ? element.value ? element.value
                : element.children[0].innerText
                : element.innerText && element.innerText.replace(/\s+/g, ' ')
                || element.textContent);

    // Call VLibras Widget
    if (textContent.trim()) console.log(textContent);

    const linkElement = element.tagName === "A" ? element : hasLinkAncestor(element);

    if (linkElement) showTooltip(linkElement, event);
    if (hasTag(element, 'LABEL')) toggleChecked(element);
    else if (hasTag(element, 'BUTTON') || isSubmit) showTooltip(element, event);
}

function clickHandler(element, event = null) {
    if (event) event.stopPropagation();
    document.removeEventListener("click", printContent, true);
    element.click();
    document.addEventListener("click", printContent, true);
}

function removeHighlight(event) {
    event.target.classList.remove('vw-text--hover');
}

function showTooltip(linkElement, event) {
    if (!linkElement) return;
    removeTooltips();
    const tooltip = document.createElement("div");
    tooltip.innerText = linkElement.tagName === 'A' ? "Acessar link" : 'Interagir';
    tooltip.classList.add("vw-link-tooltip");

    const yView = event.clientY > window.innerHeight - 100;
    const xView = event.clientX > window.innerWidth - 120;

    if (yView) tooltip.style.bottom = '20px';
    else tooltip.style.top = yView + event.clientY + 48 + 'px';

    if (xView) tooltip.style.right = '20px';
    else tooltip.style.left = (event.clientX - 20 < 20 ? 20 : event.clientX - 20) + 'px';

    document.body.appendChild(tooltip);
    tooltip.onclick = (e) => clickHandler(linkElement, e);

    document.addEventListener("click", removeTooltips);
}

function removeTooltips() {
    const tooltip = document.querySelector('.vw-link-tooltip')
    if (tooltip) tooltip.remove();
    document.removeEventListener("click", removeTooltips);
}

function activate() {
    document.addEventListener("mouseover", highlightElement);
    document.addEventListener("mouseout", removeHighlight);
    document.addEventListener("scroll", removeTooltips);
    document.addEventListener("click", printContent, true);
}

function deactivate() {
    removeTooltips();
    document.removeEventListener("mouseover", highlightElement);
    document.removeEventListener("mouseout", removeHighlight);
    document.removeEventListener("scroll", removeTooltips);
    document.removeEventListener("click", printContent, true);
}

activate();

const style = document.createElement('style');
style.textContent = `
    .vw-link-tooltip {
        position: fixed;
        z-index: 2147483647 !important;
        padding: 10px 15px !important;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px !important;
        color: #FFF !important;
        white-space: nowrap;
        text-decoration: none;
        line-height: 1 !important;
        animation: showTooltip .3s ease;
        box-shadow: 0 0 10px -5px #000;
        transition: all .3s ease;
    }

    @keyframes showTooltip {
        0% {
            margin-top: -10px;
            opacity: 0;
        }
        100% {
            margin-top: 0px;
            opacity: 1;
        }
    }

    .vw-link-tooltip:hover {
        transform: scale(1.05);
    }

    .vw-link-tooltip::before {
        content: "";
        width: 20px;
        height: 20px;
        position: absolute;
        background: #2C6ED0;
        left: 10px;
        top: -5px;
        transform: rotate(45deg);
        z-index: -1;
    }

    .vw-link-tooltip::after {
        content: "";
        width: 100%;
        background-color: #3885F9;
        height: 100%;
        z-index: -1;
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 6px;
    }

    .vw-text--hover {
        text-decoration: underline !important;
        opacity: 1 !important;
        cursor: url('data:image/png;base64,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'), pointer !important;
    }
    
    .vw-text--hover img::selection {
        background: transparent !important;
    }
    `

document.body.appendChild(style);
