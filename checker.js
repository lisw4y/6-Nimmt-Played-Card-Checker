document.addEventListener('DOMContentLoaded', function () {
	function reset() {
		var td = document.getElementsByTagName("td");
		for (i = 0; i < td.length; i++) {
			if (td[i].getAttribute("id")) {
				td[i].style.backgroundColor = "white";
			}
		}
	}
	chrome.tabs.query({
		active: true
	}, function (tabs) {
		// create the long-lived connection to original content script (tabs[0])
		var port = chrome.tabs.connect(tabs[0].id);

		document.getElementById("btn_start").addEventListener("click", function () {
			port.postMessage({
				request: "start"
			});
		});

		document.getElementById("btn_reset").addEventListener("click", function () {
			reset();
		});

		window.addEventListener("beforeunload", function () {
			port.postMessage({
				request: "stop"
			});
		});

		port.onMessage.addListener(function (msg) {
			switch (msg.request) {
				case "hand":
					document.getElementById("card_" + msg.cardNo).style.backgroundColor = "#007bff";
					break;
				case "played":
					document.getElementById("card_" + msg.cardNo).style.backgroundColor = "#dc3545";
					break;
				case "reset":
					reset();
			}
		});
	});
});
