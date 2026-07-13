/* ==========================================================================
   FGI - Componente: Arrastar e Soltar (games/shared/js/components/dragdrop.js)
   Extraído e generalizado do game001 (Jogo da Soma): Pointer Events
   (mouse, dedo ou caneta) com fallback por teclado (Enter/Espaço).
   ========================================================================== */

(function () {
    "use strict";

    window.GameComponents = window.GameComponents || {};

    var config = { margin: 24, ghostOpacity: 0.95, onDrop: null, onDragStart: null };
    var alvos = []; // { element, options }
    var arrastaveisRegistrados = []; // { element, handlerPointerDown, handlerKeyDown }

    function pointerSobreAlvo(evento, alvoEl, margem) {
        var rect = alvoEl.getBoundingClientRect();
        return evento.clientX >= rect.left - margem &&
               evento.clientX <= rect.right + margem &&
               evento.clientY >= rect.top - margem &&
               evento.clientY <= rect.bottom + margem;
    }

    function alvoSobPonteiro(evento) {
        for (var i = 0; i < alvos.length; i++) {
            var margem = (alvos[i].options && alvos[i].options.margin) || config.margin;
            if (pointerSobreAlvo(evento, alvos[i].element, margem)) return alvos[i];
        }
        return null;
    }

    function dispararDrop(alvoRegistrado, data) {
        var alvoEl = alvoRegistrado.element;
        if (alvoRegistrado.options && typeof alvoRegistrado.options.onDrop === "function") {
            alvoRegistrado.options.onDrop(data, alvoEl);
        } else if (typeof config.onDrop === "function") {
            config.onDrop(data, alvoEl);
        }
    }

    function iniciarArrasto(evento, elemento, data) {
        evento.preventDefault();

        var rect = elemento.getBoundingClientRect();
        var deslocX = evento.clientX - rect.left;
        var deslocY = evento.clientY - rect.top;

        var fantasma = elemento.cloneNode(true);
        fantasma.classList.add("fantasma");
        fantasma.style.width = rect.width + "px";
        fantasma.style.height = rect.height + "px";
        fantasma.style.left = rect.left + "px";
        fantasma.style.top = rect.top + "px";
        fantasma.style.opacity = String(config.ghostOpacity);
        document.body.appendChild(fantasma);

        elemento.classList.add("origem-arrasto");
        try {
            elemento.setPointerCapture(evento.pointerId);
        } catch (e) {
            // Segue funcionando pelos eventos no próprio elemento
        }

        if (typeof config.onDragStart === "function") config.onDragStart(elemento, data);

        function destacarAlvo(evt) {
            var alvoAtivo = alvoSobPonteiro(evt);
            alvos.forEach(function (a) {
                if (a.options && a.options.highlight !== false) {
                    a.element.classList.toggle("pronta", a === alvoAtivo);
                }
            });
        }

        function limparDestaque() {
            alvos.forEach(function (a) { a.element.classList.remove("pronta"); });
        }

        function aoMover(ev) {
            fantasma.style.left = (ev.clientX - deslocX) + "px";
            fantasma.style.top = (ev.clientY - deslocY) + "px";
            destacarAlvo(ev);
        }

        function encerrar() {
            elemento.classList.remove("origem-arrasto");
            elemento.removeEventListener("pointermove", aoMover);
            elemento.removeEventListener("pointerup", aoSoltar);
            elemento.removeEventListener("pointercancel", aoCancelar);
            limparDestaque();
        }

        function devolverFantasma() {
            fantasma.classList.add("voltando");
            fantasma.style.left = rect.left + "px";
            fantasma.style.top = rect.top + "px";
            window.setTimeout(function () { fantasma.remove(); }, 320);
        }

        function aoSoltar(ev) {
            var alvoAtingido = alvoSobPonteiro(ev);
            encerrar();
            if (alvoAtingido) {
                fantasma.remove();
                dispararDrop(alvoAtingido, data);
            } else {
                devolverFantasma();
            }
        }

        function aoCancelar() {
            encerrar();
            devolverFantasma();
        }

        elemento.addEventListener("pointermove", aoMover);
        elemento.addEventListener("pointerup", aoSoltar);
        elemento.addEventListener("pointercancel", aoCancelar);
    }

    GameComponents.dragdrop = {
        // Inicializar sistema de arrastar e soltar
        init: function (options) {
            options = options || {};
            config.margin = options.margin || 24;
            config.ghostOpacity = typeof options.ghostOpacity === "number" ? options.ghostOpacity : 0.95;
            config.onDrop = options.onDrop || null;
            config.onDragStart = options.onDragStart || null;
        },

        // Tornar um elemento arrastável
        makeDraggable: function (element, data) {
            var handlerPointerDown = function (evento) {
                iniciarArrasto(evento, element, data);
            };
            var handlerKeyDown = function (evento) {
                if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    // Sem posição de ponteiro: usa o primeiro alvo registrado
                    if (alvos[0]) dispararDrop(alvos[0], data);
                }
            };

            element.addEventListener("pointerdown", handlerPointerDown);
            element.addEventListener("keydown", handlerKeyDown);
            arrastaveisRegistrados.push({ element: element, handlerPointerDown: handlerPointerDown, handlerKeyDown: handlerKeyDown });
        },

        // Registrar um alvo de drop
        setTarget: function (element, options) {
            alvos.push({ element: element, options: options || {} });
        },

        // Remover todos os arrastáveis e alvos registrados
        clearAll: function () {
            arrastaveisRegistrados.forEach(function (r) {
                r.element.removeEventListener("pointerdown", r.handlerPointerDown);
                r.element.removeEventListener("keydown", r.handlerKeyDown);
            });
            arrastaveisRegistrados = [];
            alvos.forEach(function (a) { a.element.classList.remove("pronta"); });
            alvos = [];
        }
    };
})();
