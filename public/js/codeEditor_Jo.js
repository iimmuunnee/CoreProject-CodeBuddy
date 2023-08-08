const texthtml = document.querySelector('#html');
const textcss = document.querySelector('#css');
const textjs = document.querySelector('#js');
const outPut = document.querySelector('#live');
let activeEditor = null;

function createEditor(target, mode) {
    return CodeMirror.fromTextArea(target, {
        mode: mode,
        theme: 'darcula',
        lineNumbers: true,
        spellcheck: true,
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        foldGutter: true,
    });
}

let html = null;
let css = null;
let js = null;

function updateOutput() {
    const outputHTML = html ? html.getValue() : '';
    const outputCSS = css ? css.getValue() : '';
    const outputJS = js ? js.getValue() : '';

    // HTML, CSS 코드를 iframe의 body에 추가
    outPut.contentWindow.document.body.innerHTML = outputHTML + '<style>' + outputCSS + '</style>';
    
    // JavaScript 코드를 iframe의 body에 추가
    // 스크립트 태그를 생성하여 해당 코드를 추가함
    const scriptElement = document.createElement('script');
    scriptElement.textContent = outputJS;
    outPut.contentWindow.document.body.appendChild(scriptElement);
}

function setActiveEditor(editor) {
    if (activeEditor) {
        activeEditor.getWrapperElement().style.display = 'none';
    }

    if (editor) {
        editor.getWrapperElement().style.display = 'block';
        editor.refresh();
        activeEditor = editor;
    }
}

const tabItems = document.querySelectorAll('.tab-container__item');
const contentContainers = document.querySelectorAll('.content-container__content');

tabItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        tabItems.forEach((title) => {
            title.classList.remove('active');
        });
        setActiveEditor(null);

        if (index === 0) {
            if (!html) {
                html = createEditor(texthtml, 'html');
                html.on('change', updateOutput);
            }
            setActiveEditor(html);
        } else if (index === 1) {
            if (!css) {
                css = createEditor(textcss, 'text/css');
                css.on('change', updateOutput);
            }
            setActiveEditor(css);
        } else if (index === 2) {
            if (!js) {
                js = createEditor(textjs, 'text/javascript');
                js.on('change', updateOutput);
            }
            setActiveEditor(js);
        }

        item.classList.add('active');
        contentContainers[index].classList.add('target');
        updateOutput();
    });
});

//우측 에디터

const texthtml2 = document.querySelector('#html2');
const textcss2 = document.querySelector('#css2');
const textjs2 = document.querySelector('#js2');
const outPut2 = document.querySelector('#live2');
let activeEditor2 = null;

function createEditor2(target, mode) {
    return CodeMirror.fromTextArea(target, {
        mode: mode,
        theme: 'darcula',
        lineNumbers: true,
        spellcheck: true,
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        foldGutter: true,
    });
}

let html2 = null;
let css2 = null;
let js2 = null;

function updateOutput2() {
    const outputHTML2 = html2 ? html2.getValue() : '';
    const outputCSS2 = css2 ? css2.getValue() : '';
    const outputJS2 = js2 ? js2.getValue() : '';

    // HTML, CSS 코드를 iframe의 body에 추가
    outPut2.contentWindow.document.body.innerHTML = outputHTML2 + '<style>' + outputCSS2 + '</style>';
    
    // JavaScript 코드를 iframe의 body에 추가
    // 스크립트 태그를 생성하여 해당 코드를 추가함
    const scriptElement2 = document.createElement('script');
    scriptElement2.textContent = outputJS2;
    outPut2.contentWindow.document.body.appendChild(scriptElement2);
}

function setActiveEditor2(editor2) {
    if (activeEditor2) {
        activeEditor2.getWrapperElement().style.display = 'none';
    }

    if (editor2) {
        editor2.getWrapperElement().style.display = 'block';
        editor2.refresh();
        activeEditor2 = editor2;
    }
}







const tabItems2 = document.querySelectorAll('.tab-container__item2');
const contentContainers2 = document.querySelectorAll('.content-container__content2');

tabItems2.forEach((item, index) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        tabItems2.forEach((title) => {
            title.classList.remove('active');
        });
        setActiveEditor2(null);

        if (index === 0) {
            if (!html2) {
                html2 = createEditor2(texthtml2, 'html');
                html2.on('change', updateOutput2);
            }
            setActiveEditor2(html2);
        } else if (index === 1) {
            if (!css2) {
                css2 = createEditor2(textcss2, 'text/css');
                css2.on('change', updateOutput2);
            }
            setActiveEditor2(css2);
        } else if (index === 2) {
            if (!js2) {
                js2 = createEditor2(textjs2, 'text/javascript');
                js2.on('change', updateOutput2);
            }
            setActiveEditor2(js2);
        }

        item.classList.add('active');
        contentContainers2[index].classList.add('target');
        updateOutput2();
    });
});








// 접속자 2
const texthtml3 = document.querySelector('#html3');
const textcss3 = document.querySelector('#css3');
const textjs3 = document.querySelector('#js3');
const outPut3 = document.querySelector('#live3');
let activeEditor3 = null;

function createEditor3(target, mode) {
    return CodeMirror.fromTextArea(target, {
        mode: mode,
        theme: 'darcula',
        lineNumbers: true,
        spellcheck: true,
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        foldGutter: true,
    });
}

let html3 = null;
let css3 = null;
let js3 = null;

function updateOutput3() {
    const outputHTML3 = html3 ? html3.getValue() : '';
    const outputCSS3= css3 ? css3.getValue() : '';
    const outputJS3 = js3 ? js3.getValue() : '';

    // HTML, CSS 코드를 iframe의 body에 추가
    outPut3.contentWindow.document.body.innerHTML = outputHTML3 + '<style>' + outputCSS3 + '</style>';
    
    // JavaScript 코드를 iframe의 body에 추가
    // 스크립트 태그를 생성하여 해당 코드를 추가함
    const scriptElement3 = document.createElement('script');
    scriptElement3.textContent = outputJS3;
    outPut3.contentWindow.document.body.appendChild(scriptElement3);
}

function setActiveEditor3(editor3) {
    if (activeEditor3) {
        activeEditor3.getWrapperElement().style.display = 'none';
    }

    if (editor3) {
        editor3.getWrapperElement().style.display = 'block';
        editor3.refresh();
        activeEditor3 = editor3;
    }
}

const tabItems3 = document.querySelectorAll('.tab-container__item3');
const contentContainers3 = document.querySelectorAll('.content-container__content3');

tabItems3.forEach((item, index) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        tabItems3.forEach((title) => {
            title.classList.remove('active');
        });
        setActiveEditor3(null);

        if (index === 0) {
            if (!html3) {
                html3 = createEditor3(texthtml3, 'html');
                html3.on('change', updateOutput3);
            }
            setActiveEditor3(html3);
        } else if (index === 1) {
            if (!css3) {
                css3 = createEditor3(textcss3, 'text/css');
                css3.on('change', updateOutput3);
            }
            setActiveEditor3(css3);
        } else if (index === 2) {
            if (!js3) {
                js3 = createEditor3(textjs3, 'text/javascript');
                js3.on('change', updateOutput3);
            }
            setActiveEditor3(js3);
        }

        item.classList.add('active');
        contentContainers3[index].classList.add('target');
        updateOutput3();
    });
});



// 접속자 3
const texthtml4 = document.querySelector('#html4');
const textcss4 = document.querySelector('#css4');
const textjs4 = document.querySelector('#js4');
const outPut4 = document.querySelector('#live4');
let activeEditor4 = null;

function createEditor4(target, mode) {
    return CodeMirror.fromTextArea(target, {
        mode: mode,
        theme: 'darcula',
        lineNumbers: true,
        spellcheck: true,
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        foldGutter: true,
    });
}

let html4 = null;
let css4 = null;
let js4 = null;

function updateOutput4() {
    const outputHTML4 = html4 ? html4.getValue() : '';
    const outputCSS4= css4 ? css4.getValue() : '';
    const outputJS4 = js4 ? js4.getValue() : '';

    // HTML, CSS 코드를 iframe의 body에 추가
    outPut4.contentWindow.document.body.innerHTML = outputHTML4 + '<style>' + outputCSS4 + '</style>';
    
    // JavaScript 코드를 iframe의 body에 추가
    // 스크립트 태그를 생성하여 해당 코드를 추가함
    const scriptElement4 = document.createElement('script');
    scriptElement4.textContent = outputJS4;
    outPut4.contentWindow.document.body.appendChild(scriptElement4);
}

function setActiveEditor4(editor) {
    if (activeEditor4) {
        activeEditor4.getWrapperElement().style.display = 'none';
    }

    if (editor) {
        editor.getWrapperElement().style.display = 'block';
        editor.refresh();
        activeEditor4 = editor;
    }
}

const tabItems4 = document.querySelectorAll('.tab-container__item4');
const contentContainers4 = document.querySelectorAll('.content-container__content4');

tabItems4.forEach((item, index) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        tabItems4.forEach((title) => {
            title.classList.remove('active');
        });
        setActiveEditor4(null);

        if (index === 0) {
            if (!html4) {
                html4 = createEditor4(texthtml4, 'html');
                html4.on('change', updateOutput4);
            }
            setActiveEditor4(html4);
        } else if (index === 1) {
            if (!css4) {
                css4 = createEditor4(textcss4, 'text/css');
                css4.on('change', updateOutput4);
            }
            setActiveEditor4(css4);
        } else if (index === 2) {
            if (!js4) {
                js4 = createEditor4(textjs4, 'text/javascript');
                js4.on('change', updateOutput4);
            }
            setActiveEditor4(js4);
        }

        item.classList.add('active');
        contentContainers4[index].classList.add('target');
        updateOutput4();
    });
});



























// 초기에 첫 번째 탭을 활성화
setActiveEditor(null);
setActiveEditor2(null);
setActiveEditor3(null);
setActiveEditor4(null);

tabItems[0].click(); // 초기에 첫 번째 탭 클릭 이벤트 호출
tabItems2[0].click(); // 초기에 첫 번째 탭 클릭 이벤트 호출
tabItems3[0].click();
tabItems4[0].click();
