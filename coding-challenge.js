function powerOn() {
	ship.powerOn = true;
}

function countModules() {
	var count = 0;
	for (var i = 0 ; i < availableModules.length ; i++) {
		count++;
	}
	return count;
}

function countEssential() {
	var numberOfModules = countModules();
	var count = 0;
	for (var i = 0 ; i < numberOfModules ; i++) {
		if (availableModules[i].essential === true) {
			count++;
		}
	}
	return count;
}

function loadModule(index) {
	if (availableModules[index].hasOwnProperty('essential')) {
		availableModules[index].essential = true;
	}
	availableModules[index].enabled = true;
	ship.modules.push(availableModules[index]);
}

function findModuleIndex(name) {
	for (var i = 0 ; i < availableModules.length ; i++) {
		if (availableModules[i].name == name) {
			return i;
		}
	}
}

loadModule(findModuleIndex("life-support"));
loadModule(findModuleIndex("propulsion"));
loadModule(findModuleIndex("navigation"));

function resetLARRY() {
	for (var i = 0 ; i < 10 ; i++) {
		LARRY.quack();
	}
}

resetLARRY();

loadModule(findModuleIndex("communication"));

function setMessage() {
	var jsonString = JSON.stringify(navigation);
	radio.message = jsonString;
}

setMessage();

function activateBeacon() {
	radio.beacon = true;
}

activateBeacon();

function setFrequency() {
	radio.frequency = (radio.range.low + radio.range.high) / 2;
}

function initialize() {
	navigation.x = 0;
	navigation.y = 0;
	navigation.z = 0;
}

function calibrateX() {
	var signal;
	for (var i = 1 ; i <= 12 ; i++) {
		signal = checkSignal();
		if (signal !== undefined) {
			navigation.x = signal;
			break;
		}
	}
}

function calibrateY() {
	var signal;
	for (var i = 1 ; i <= 60 ; i++) {
		signal = checkSignal();
		if (signal !== undefined) {
			navigation.y = signal;
			break;
		}
	}
}

function calibrateZ() {
	var signal;
	for (var i = 1 ; i <= 60 ; i++) {
		signal = checkSignal();
		if (signal !== undefined) {
			navigation.z = signal;
			break;
		}
	}
}

function calibrate() {
	calibrateX();
	calibrateY();
	calibrateZ();
}

function setSpeed(speed) {
	var integerSpeed = parseInt(speed, 10);
	if (Math.sign(integerSpeed) !== -1) {
		navigation.speed = integerSpeed;
	}
}

function activateAntenna() {
	ship.antenna.active = true;
}

function sendBroadcast() {
	for (var i = 0 ; i < 100 ; i++) {
		broadcast();
	}
}

function configureBroadcast() {
	setFrequency();
	activateAntenna();
	sendBroadcast();
}

configureBroadcast();

function decodeMessage(message) {
	message = message.split("");
	for (var i = 0; i < message.length; i++) {
		if (message[i] == "4") {
			message[i] = "a";
		} else if (message[i] == "3") {
			message[i] = "e";
		} else if (message[i] == "1") {
			message[i] = "i";
		} else if (message[i] == "0") {
			message[i] = "o";
		} else if (message[i] == "2") {
			message[i] = "u";
		} else if (message[i] === "5") {
			message[i] = "y";
		}
	}
	return message.join("");
}

function returnToEarth() {
	var getX = broadcast('x');
	var getY = broadcast('y');
	var getZ = broadcast('z');

	navigation.x = parseInt(decodeMessage(getX), 16);
	navigation.y = parseInt(decodeMessage(getY), 16);
	navigation.z = parseInt(decodeMessage(getZ), 16);
}

returnToEarth();