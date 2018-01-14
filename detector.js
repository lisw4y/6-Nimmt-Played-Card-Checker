// listen to the connection from tabs[1]
chrome.runtime.onConnect.addListener(function (port) {
	port.onMessage.addListener(function (msg) {
		// Initialize the record
		// Record cards on the player's hand and table
		function init() {
			var handCards = document.getElementsByClassName("stockitem");
			for (i = 0; i < handCards.length; i++) {
				port.postMessage({
					request: "hand",
					cardNo: handCards[i].getAttribute("id").substring(17)
				});
			}
			var cardsOnTable = document.getElementById("cards_on_table").getElementsByClassName("card_on_table");
			for (i = 0; i < cardsOnTable.length; i++) {
				port.postMessage({
					request: "played",
					cardNo: cardsOnTable[i].getAttribute("id").substring(5)
				});
			}
		}
		// Observe whether the new round has began
		// Each player owns new ten cards means the new round has began
		var newRoundObserver = new MutationObserver(function () {
			var handCards = document.getElementsByClassName("stockitem");
			if (handCards.length == 10) {
				port.postMessage({
					request: "reset"
				});
				init();
			}
		});

		// Observe what numbers of cards other players play
		var playedObserver = new MutationObserver(function () {
			var playedCards = document.getElementById("played").getElementsByClassName("card_on_table");
			for (i = 0; i < playedCards.length; i++) {
				port.postMessage({
					request: "played",
					cardNo: playedCards[i].getAttribute("id").substring(5)
				});
			}
		});

		// receive commands from the popup page
		switch (msg.request) {
			case "start":
				init();
				newRoundObserver.observe(document.querySelector("#player_hand"), {
					childList: true
				});
				playedObserver.observe(document.querySelector("#played"), {
					childList: true
				});
				break;
			case "stop":
				newRoundObserver.disconnect();
				playedObserver.disconnect();
		}
	});
});
