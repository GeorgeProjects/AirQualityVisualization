var ObserverManager = new Object();
(function(){
	var listeners = [];
	ObserverManager.post = function(message,data,sender){
		for(var i = 0; i < listeners.length;i++){
			if(listeners[i].OMListen){
				if(sender != listeners[i]){
					listeners[i].OMListen(message,data);
				}
			}
		}
	}
	ObserverManager.addListener = function(listener){
		listeners.push(listener);
	}
	ObserverManager.getListener = function(listener){
		return listeners;
	}
	ObserverManager.setListener = function(_listener){
		listener = _listener;
	}
	window["ObserverManager"] = ObserverManager;
})();