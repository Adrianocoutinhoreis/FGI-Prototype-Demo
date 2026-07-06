/* ==========================================================================
   FGI - Framework de Jogos Inclusivos
   Script Global de Lógica (app.js)
   Gerenciamento de rotas por URL, estados do protótipo e acessibilidade.
   ========================================================================== */

(function () {
    "use strict";

    // Namespace Global FGI
    var FGI = {
        // Obter parâmetro da URL por nome
        getParam: function (name) {
            var urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        },

        // Obter todos os parâmetros relevantes da URL
        getState: function () {
            var urlParams = new URLSearchParams(window.location.search);
            return {
                student: urlParams.get("student") || "",
                profile: urlParams.get("profile") || "",
                time: urlParams.get("time") || "none",
                sound: urlParams.get("sound") || "on",
                narrator: urlParams.get("narrator") || "on",
                difficulty: urlParams.get("difficulty") || "easy",
                hits: urlParams.get("hits") || "0",
                misses: urlParams.get("misses") || "0",
                duration: urlParams.get("duration") || "00:00"
            };
        },

        // Gerar string de URL baseada no estado atual
        buildUrl: function (targetPage, state) {
            var params = new URLSearchParams();
            if (state.student) params.set("student", state.student);
            if (state.profile) params.set("profile", state.profile);
            if (state.time) params.set("time", state.time);
            if (state.sound) params.set("sound", state.sound);
            if (state.narrator) params.set("narrator", state.narrator);
            if (state.difficulty) params.set("difficulty", state.difficulty);
            if (state.hits) params.set("hits", state.hits);
            if (state.misses) params.set("misses", state.misses);
            if (state.duration) params.set("duration", state.duration);
            return targetPage + "?" + params.toString();
        },

        // Presets adaptativos baseados no Perfil de Apoio
        getPresetsForProfile: function (profile) {
            switch (profile) {
                case "TEA Nível 3":
                    return {
                        time: "none",
                        sound: "off",     // Evitar sobrecarga auditiva
                        narrator: "on",   // Narração para auxílio cognitivo
                        difficulty: "easy" // Nível inicial
                    };
                case "TEA Nível 2":
                    return {
                        time: "none",
                        sound: "on",
                        narrator: "on",
                        difficulty: "easy"
                    };
                case "TEA Nível 1":
                    return {
                        time: "none",
                        sound: "on",
                        narrator: "on",
                        difficulty: "medium"
                    };
                case "TDAH":
                    return {
                        time: "2min",      // Tempo limite para engajamento rápido
                        sound: "on",
                        narrator: "on",
                        difficulty: "medium"
                    };
                case "Dislexia":
                    return {
                        time: "none",
                        sound: "on",
                        narrator: "on",   // Narração essencial para leitura
                        difficulty: "medium"
                    };
                case "Aluno típico":
                default:
                    return {
                        time: "none",
                        sound: "on",
                        narrator: "off",
                        difficulty: "medium"
                    };
            }
        },

        // Mostrar notificação Toast
        showToast: function (message) {
            var toast = document.getElementById("toast-notice");
            if (!toast) {
                toast = document.createElement("div");
                toast.id = "toast-notice";
                toast.className = "toast-notice";
                document.body.appendChild(toast);
            }
            toast.textContent = message;
            toast.classList.add("show");

            setTimeout(function () {
                toast.classList.remove("show");
            }, 3000);
        },

        // Atualizar barra de progresso visual do atendimento
        updateStepProgress: function (currentStep) {
            var progressContainer = document.querySelector(".step-progress");
            if (!progressContainer) return;

            var steps = ["Aluno", "Perfil", "Configurar", "Jogar"];
            progressContainer.innerHTML = "";

            for (var i = 0; i < steps.length; i++) {
                var stepNum = i + 1;
                var stepEl = document.createElement("div");
                stepEl.className = "step-item";
                stepEl.textContent = stepNum;
                stepEl.setAttribute("title", steps[i]);
                stepEl.setAttribute("aria-label", "Etapa " + stepNum + ": " + steps[i]);

                if (stepNum < currentStep) {
                    stepEl.classList.add("done");
                    stepEl.innerHTML = "✓";
                } else if (stepNum === currentStep) {
                    stepEl.classList.add("active");
                }

                progressContainer.appendChild(stepEl);
            }
        }
    };

    // Exporta para o escopo window
    window.FGI = FGI;
})();
