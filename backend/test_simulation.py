<!DOCTYPE html>
<html>
<head>
    <title>Test Wasteland Warfare</title>
    <style>
        body { background-color: #1a1a1a; color: #00ff00; font-family: monospace; padding: 20px; }
        #log { white-space: pre-wrap; margin-top: 20px; }
        .btn { border: none; padding: 10px; cursor: pointer; font-weight: bold; margin-right: 10px; }
        .btn-init { background: #ffaa00; color: black; }
        .btn-action { background: #00ff00; color: black; }
    </style>
</head>
<body>
    <h2>📡 Console de Test WebSocket - Joueur 1</h2>
    
    <button class="btn btn-init" onclick="sendInitGame()">1. Initialiser la partie</button>
    <button class="btn btn-action" onclick="sendPassTurn()">2. Action : Passer le tour</button>
    
    <div id="log">En attente de connexion...</div>

    <script>
        const log = document.getElementById('log');
        const ws = new WebSocket("wss://api.wasteland-warfare.com/ws/999/1");

        ws.onopen = function() {
            log.innerHTML += "\n✅ Connecté avec succès au Game Engine (Room 999, Player 1) !";
        };

        ws.onmessage = function(event) {
            const response = JSON.parse(event.data);
            log.innerHTML += "\n\n📩 Message du Serveur :\n" + JSON.stringify(response, null, 2);
        };

        ws.onclose = function() {
            log.innerHTML += "\n❌ Déconnecté du serveur.";
        };

        // Nouvelle fonction pour créer le plateau
        function sendInitGame() {
            const action = {
                action: "init_game", // On suppose que c'est le nom de ton action d'initialisation
                payload: {}
            };
            ws.send(JSON.stringify(action));
            log.innerHTML += "\n\n📤 Envoi : " + JSON.stringify(action);
        }

        function sendPassTurn() {
            const action = {
                action: "pass_turn",
                payload: {}
            };
            ws.send(JSON.stringify(action));
            log.innerHTML += "\n\n📤 Envoi : " + JSON.stringify(action);
        }
    </script>
</body>
</html>