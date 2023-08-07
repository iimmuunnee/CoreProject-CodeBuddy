        
        const texthtml = document.querySelector('#html')
        const textcss = document.querySelector('#css')
        const textjs = document.querySelector('#js')
        const outPut = document.querySelector('#live')

        
        
        let html = CodeMirror.fromTextArea(texthtml, {
        mode:"text/html",
        theme:"darcula",
        lineNumbers: true,
        extraKeys:{"Ctrl-Space": "autocomplete"}
        })

        let css = CodeMirror.fromTextArea(textcss, {
        mode:"text/css",
        theme:"darcula",
        lineNumbers: true,
        spellcheck: true,
        extraKeys:{"Ctrl-Space": "autocomplete"}
        })

        let js = CodeMirror.fromTextArea(textjs, {
        mode:"text/javascript",
        theme:"darcula",
        lineNumbers: true,
        spellcheck: true,
        extraKeys:{"Ctrl-Space": "autocomplete"}
        })
        
        // 입력한 코드 출력
        CodeMirror.on(html, 'change', function () {
            outPut.contentWindow.document.body.innerHTML = html.getValue()
          })
        CodeMirror.on(css, 'change', function () {
            outPut.contentWindow.document.body.innerHTML = html.getValue()  + "<style>" + css.getValue() + "</style>"
          })
          CodeMirror.on(js, 'change', function () {
            const scriptElement = document.createElement("script");
            scriptElement.innerHTML = js.getValue();
           /* outPut.contentWindow.document.body.innerHTML = html.getValue() + "<style>" + css.getValue() + "</style>"; */
            outPut.contentWindow.document.body.appendChild(scriptElement);
        });


        
