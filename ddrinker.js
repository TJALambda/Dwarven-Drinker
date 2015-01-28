////////////////////////////////////////////////////////////////////////////////////////////////////
//	Variables
////////////////////////////////////////////////////////////////////////////////////////////////////
/*
click gets gems
gems buy ale upgrades
ale upgrades increase ale/second
ale/second increase fortress size
fortress size increase gems/click
gem upgrades increase gem/second

ale - Farmers Son, Farmer, Barmaid, Brewer, Brewmaster
gems - Baby Dwarf, Breaker Boy, Apprentice Miner, Miner, Excavator
*/

//	Hover Functions

var descY = "0";
function setPos(e, name) {
	var heightY = e.clientY;
	heightY -= 40;
	descY = heightY.toString();
	document.getElementById(name.concat(" Hover")).style.top = descY.concat("px");
}

function HoverOut(name) {
	document.getElementById(name.concat(" Hover")).style.display = "none";
}

//	Game Start

var fortress = {
	size: 1,
	rate: 0.2,
	aleRate: 3
};

var ale = {
	amount: 0,
	amountFixed: 0,
	perSecond: 0
};

var gems = {
	amount: 0,
	amountFixed: 0,
	perSecond: 0,
	perClick: 1
};

var Dwarf = function(id, name, description, amount, rate, cost, costBase, costCurrency, upgrade, state) {
	this.id = id;
	this.name = name;
	this.description = description;
	this.amount = amount;
	this.rate = rate;
	this.cost = cost;
	this.costBase = costBase;
	this.costCurrency = costCurrency;
	this.upgrade = upgrade;
	this.state = state;
};

//	New dwarfs should be added in order
var dwarfs = [
	new Dwarf(100, 'Farmers Son', 'Ploughs the land for the seeds', 0, 0.5, 10, 10, 'gems', 1, 0),
	new Dwarf(101, 'Farmer', 'Plants and grows the seeds', 0, 1, 50, 50, 'gems', 1, 0),
	new Dwarf(102, 'Barmaid', 'Sells you ale, for a price', 0, 3, 250, 250, 'gems', 1, 0),
	new Dwarf(103, 'Alcoholic', 'Brews, and lives on, his own', 0, 8, 666, 666, 'gems', 1, 0),
	new Dwarf(104, 'Brewer', 'Trained to brew you traditional ale', 0, 20, 1000, 1000, 'gems', 1, 0),
	new Dwarf(105, 'Brewmaster', 'This master brewer knows exactly the flavor you like', 0, 50, 10000, 10000, 'gems', 1, 0),
	
	new Dwarf(200, 'Baby Dwarf', 'Even a baby dwarf can mine', 0, 0.8, 25, 25, 'ale', 1, 0),
	new Dwarf(201, 'Breaker Boy', 'This boy? Well he breaks rocks', 0, 2, 150, 150, 'ale', 1, 0),
	new Dwarf(202, 'Apprentice', 'This miner is not too shabby with a pick-axe', 0, 5, 800, 800, 'ale', 1, 0),
	new Dwarf(203, 'Miner', 'This guys even less shabby with a pick-axe', 0, 15, 1500, 1500, 'ale', 1, 0),
	new Dwarf(204, 'Supervisor', 'Somehow he actually increases efficiency?', 0, 33, 4000, 4000, 'ale', 1, 0), 
	new Dwarf(205, 'Excavator', 'This guy is a digging machine', 0, 75, 15000, 15000, 'ale', 1, 0)
];

var Upgrade = function(id, name, description, bought, multiplier, cost, costCurrency, object, state) {
	this.id = id;
	this.name = name;
	this.description = description;
	this.bought = bought;
	this.multiplier = multiplier;
	this.cost = cost;
	this.costCurrency = costCurrency;
	this.object = object;
	this.state = state;
};

var upgrades = [
	new Upgrade(300, 'The Cane', 'You strike the ground or I strike you', 0, 1.5, 250, 'gems', 'Farmers Son', 0),
	new Upgrade(301, 'Old Bessie', "Good old Bessie, although she's going to die some day", 0, 2, 1250, 'gems', 'Farmer', 0),

	new Upgrade(400, 'Potty Training', 'Now toilet breaks are a lot less messy', 0, 1.5, 1000, 'ale', 'Baby Dwarf', 0),
	new Upgrade(401, 'Big Hammer', 'Sometimes all you need is a bigger hammer', 0, 2, 2500, 'ale', 'Breaker Boy', 0)
];

//	Other
var cost = "Cost";
var buy = "buy";
var costRate = 1.2;
var tempAle = 0;
var tempGems = 0;
var load = 0;
var save = 0;
var version = 0.9;
var update = setInterval(function(){GameLoop()}, 100);

////////////////////////////////////////////////////////////////////////////////////////////////////
//	Saving and Loading
////////////////////////////////////////////////////////////////////////////////////////////////////

function GameReset() {
	for (i=0; i<upgrades.length; i++) {
		var name = upgrades[i].name;
		localStorage.setItem(name, "0");
	}
	
	for (i=0; i<dwarfs.length; i++) {
		var name = dwarfs[i].name;
		localStorage.setItem(name, "0");
	}
	
	localStorage.setItem("fortressSaved", "1");
	localStorage.setItem("aleSaved", "0");	
	localStorage.setItem("gemsSaved", "0");
	
	// remove dwarfs and upgrades
	var dwarfsNode = document.getElementById("dwarfsLeft");
	while (dwarfsNode.hasChildNodes()) {
		dwarfsNode.removeChild(dwarfsNode.lastChild);
	}
	var dwarfsNode = document.getElementById("dwarfsRight");
	while (dwarfsNode.hasChildNodes()) {
		dwarfsNode.removeChild(dwarfsNode.lastChild);
	}
	
	var upgradesNode = document.getElementById("upgradesLeft");
	while (upgradesNode.hasChildNodes()) {
		upgradesNode.removeChild(upgradesNode.lastChild);
	}
	var upgradesNode = document.getElementById("upgradesRight");
	while (upgradesNode.hasChildNodes()) {
		upgradesNode.removeChild(upgradesNode.lastChild);
	}
	
	for (i=0; i<dwarfs.length; i++) {
		dwarfs[i].state = 0;
	}	
	for (i=0; i<upgrades.length; i++) {
		upgrades[i].state = 0;
	}
	
	localStorage.setItem("fortressSaved", "1");
	localStorage.setItem("aleSaved", "0");	
	localStorage.setItem("gemsSaved", "0");
	
	LoadSave();
	WriteSave();
}

function WriteSave() {
	save = 1;
	
	localStorage.setItem("save", save);
	localStorage.setItem("fortressSaved", fortress.size);
	localStorage.setItem("aleSaved", ale.amount);
	localStorage.setItem("gemsSaved", gems.amount);
	
	for (i=0; i<upgrades.length; i++) {
		var name = upgrades[i].name;
		var bought = upgrades[i].bought;
		localStorage.setItem(name, bought);
	}

	for (i=0; i<dwarfs.length; i++) {
		var name = dwarfs[i].name;
		var amount = dwarfs[i].amount;
		localStorage.setItem(name, amount);
	}
}

function LoadSave() {
	fortress.size = parseInt(localStorage.getItem("fortressSaved"));
	ale.amount = parseInt(localStorage.getItem("aleSaved"));
	gems.amount = parseInt(localStorage.getItem("gemsSaved"));

	for (i=0; i<upgrades.length; i++) {
		var name = upgrades[i].name;
		var bought = parseInt(localStorage.getItem(name));
		if (isNaN(bought)) {
			upgrades[i].bought = 0;
		} else {
			upgrades[i].bought = bought
		}
	}
	
	for (i=0; i<dwarfs.length; i++) {
		var name = dwarfs[i].name;
		amount = parseInt(localStorage.getItem(name));
		if (isNaN(amount)) {
			dwarfs[i].amount = 0;
		} else {
			dwarfs[i].amount = amount
		}
	}
	
	LoadDwarfs();
}

function GameLoad() {
	load = 1;
	if (localStorage.getItem("save") == 1) {
		LoadSave();	
	} else {
		WriteSave();
	}
}

function LoadDwarfs() {
	for (i=0; i<dwarfs.length; i++) {
		if (dwarfs[i].amount > 0) {
			dwarfs[i].state = 1;
		}
	}
}	


////////////////////////////////////////////////////////////////////////////////////////////////////
//	Upgrade Functions
////////////////////////////////////////////////////////////////////////////////////////////////////

function BuyUpgrade(name) {

	for (i=0; i < upgrades.length; i++) {
		if (name == upgrades[i].name) {
			if (upgrades[i].bought == 0) {
				if (upgrades[i].costCurrency == "ale") {
					if (ale.amount < upgrades[i].cost) {
					} else {
						ale.amount = ale.amount - upgrades[i].cost;
						upgrades[i].bought = 1;
						var element = document.getElementById(name);
						var parent = element.parentNode;
						parent.removeChild(element);
					}
				} else {
					if (gems.amount < upgrades[i].cost) {
					} else {
						gems.amount = gems.amount - upgrades[i].cost;
						upgrades[i].bought = 1;
						var element = document.getElementById(name);
						var parent = element.parentNode;
						parent.removeChild(element);
					}
				}
			}
		}
	}
}

//	States: 0=Don't draw | 1=Draw | 2=Drawn | 3=Bought

function DrawUpgrades() {
	for (i=0; i<upgrades.length; i++) {
		if (upgrades[i].bought == 0) {
			var name = upgrades[i].name;
			if (upgrades[i].state == 0) {
				if (upgrades[i].costCurrency == "ale") {
					if (upgrades[i].cost < (ale.amount * 2)) {
						upgrades[i].state = 1;
					}
				} else if (upgrades[i].costCurrency == "gems") {
					if (upgrades[i].cost < (gems.amount * 2)) {
						upgrades[i].state = 1;
					}
				}
			} else if (upgrades[i].state == 1) {
				upgrades[i].state = 2;
		
				var upgradeDiv = document.createElement('div');
				upgradeDiv.id = name;
				upgradeDiv.className = 'upgrade';
		
				var upgradeImg = document.createElement('img');
				upgradeImg.src = 'imgs/upgrade1.png';
				upgradeImg.setAttribute("onmouseover", 'HoverUpgrade("'+name+'")');
				upgradeImg.setAttribute("onmouseout", 'HoverOut("'+name+'")');
				upgradeImg.setAttribute("onmousemove",'setPos(event,"'+name+'")');
				upgradeImg.setAttribute("onClick", 'BuyUpgrade("'+name+'")');
		
				if (upgrades[i].costCurrency == "ale") {
					document.getElementById("upgradesRight").appendChild(upgradeDiv);
					document.getElementById(name).appendChild(upgradeImg);
				} else if (upgrades[i].costCurrency == "gems") {
					document.getElementById("upgradesLeft").appendChild(upgradeDiv);
					document.getElementById(name).appendChild(upgradeImg);
				}
			} else if (upgrades[i].state == 2) {
				if (upgrades[i].costCurrency == "ale") {
					if (upgrades[i].cost > ale.amount) {
						document.getElementById(name).style.opacity = 0.2;
					} else {
						document.getElementById(name).style.opacity = 1;
					}
				} else if (upgrades[i].costCurrency == "gems") {
					if (upgrades[i].cost > gems.amount) {
						document.getElementById(name).style.opacity = 0.2;
					} else {
						document.getElementById(name).style.opacity = 1;
					}
				}
			}
		} else if (upgrades[i].bought == 1 && upgrades[i].state != 3) {
			upgrades[i].state = 3;
			var object = upgrades[i].object;
			var multiplier = upgrades[i].multiplier;
			for (i=0; i < dwarfs.length; i++) {
				if (dwarfs[i].name == object) {
					dwarfs[i].upgrade = dwarfs[i].upgrade * multiplier;
				}
			}		
		}
	} 
}

function HoverUpgrade(name) {

	for (i=0; i < upgrades.length; i++) {
		if (name == upgrades[i].name) {
			var hoverDiv = document.createElement('div');
			hoverDiv.id = (name.concat(" Hover"));
			hoverDiv.className = 'upgradeHover';
			hoverDiv.style.display = "block";
			hoverDiv.style.top = descY.concat("px");
			if (upgrades[i].costCurrency == "ale") {
				hoverDiv.style.right = '310px';
			} else if (upgrades[i].costCurrency == "gems") {
				hoverDiv.style.left = '310px';
			}
			
			var nameDiv = document.createElement('div');
			nameDiv.className = 'hoverName';
			nameDiv.innerHTML = name;
			
			var descDiv = document.createElement('div');
			var desc = '"' + upgrades[i].description + '"';
			descDiv.className = 'hoverDesc';
			descDiv.innerHTML = desc;
			
			var costDiv = document.createElement('div');
			var cost = upgrades[i].cost;
			costDiv.className = 'hoverCost';
			costDiv.innerHTML = cost;
			
			var infoDiv = document.createElement('div');
			var object = upgrades[i].object;
			var mult = upgrades[i].multiplier;
			var info = object + " increased by " + mult + " times";
			infoDiv.className = 'hoverInfo';
			infoDiv.innerHTML = info;
			
			var parent = document.getElementById("middle");
			parent.insertBefore(hoverDiv, parent.firstChild);
			hoverDiv.appendChild(costDiv);
			hoverDiv.appendChild(nameDiv);
			hoverDiv.appendChild(infoDiv);
			hoverDiv.appendChild(descDiv);
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//	Dwarfs
////////////////////////////////////////////////////////////////////////////////////////////////////

function BuyDwarf(name) {
	for (i=0; i<dwarfs.length; i++) {
		if (dwarfs[i].name == name) {
			if (dwarfs[i].costCurrency == "ale") {
				if (ale.amount < dwarfs[i].cost) {
				} else {
				ale.amount = ale.amount - dwarfs[i].cost;
				dwarfs[i].amount ++;
				}
			} else {
				if (gems.amount < dwarfs[i].cost) {
				} else {
				gems.amount = gems.amount - dwarfs[i].cost;
				dwarfs[i].amount++;
				}
			}
		} 
	}
}

//	States: 0=Don't draw | 1=Draw | 2=Drawn

function DrawDwarfs() {
	for (i=0; i<dwarfs.length; i++) {
		var name = dwarfs[i].name;
		
		if (dwarfs[i].state == 0) {
			if (dwarfs[i].costCurrency == "ale") {
				if (dwarfs[i].cost < (ale.amount * 2)) {
					dwarfs[i].state = 1;
				}
			} else if (dwarfs[i].costCurrency == "gems") {
				if (dwarfs[i].cost < (gems.amount * 2)) {
					dwarfs[i].state = 1;
				}
			}
		} else if (dwarfs[i].state == 1) {
			dwarfs[i].state = 2;
			var dwarfDiv = document.createElement('div');
			dwarfDiv.id = name;
			dwarfDiv.className = 'dwarf';
			dwarfDiv.setAttribute("onmouseover", 'HoverDwarfs("'+name+'")');
			dwarfDiv.setAttribute("onmouseout", 'HoverOut("'+name+'")');
			dwarfDiv.setAttribute("onmousemove",'setPos(event,"'+name+'")');
			dwarfDiv.setAttribute("onClick", 'BuyDwarf("'+name+'")');
		
			var dwarfImg = document.createElement('img');
			dwarfImg.src = 'imgs/dwarf1.png';

			var dwarfName = document.createElement('div');
			dwarfName.className = 'dwarfName';
			var dwarfCost = document.createElement('div');
			dwarfCost.className = 'dwarfCost';
			var dwarfAmount = document.createElement('div');
			dwarfAmount.className = 'dwarfAmount';
		
			if (dwarfs[i].costCurrency == "ale") {
				document.getElementById("dwarfsRight").appendChild(dwarfDiv);
				document.getElementById(name).appendChild(dwarfImg);
				document.getElementById(name).appendChild(dwarfName);
				document.getElementById(name).appendChild(dwarfCost);
				document.getElementById(name).appendChild(dwarfAmount);
			} else if (dwarfs[i].costCurrency == "gems") {
				document.getElementById("dwarfsLeft").appendChild(dwarfDiv);
				document.getElementById(name).appendChild(dwarfImg);
				document.getElementById(name).appendChild(dwarfName);
				document.getElementById(name).appendChild(dwarfCost);
				document.getElementById(name).appendChild(dwarfAmount);
			}
		} else if (dwarfs[i].state == 2) {
		
			dwarfs[i].cost = (dwarfs[i].costBase * (Math.pow(costRate, dwarfs[i].amount))).toFixed(0);
			document.getElementById(name).children[1].innerHTML = name;
			document.getElementById(name).children[2].innerHTML = dwarfs[i].cost;
			document.getElementById(name).children[3].innerHTML = dwarfs[i].amount;
		
			if (dwarfs[i].costCurrency == "ale") {
				if (dwarfs[i].cost > ale.amount) {
					document.getElementById(name).style.opacity = 0.2;
				} else {
					document.getElementById(name).style.opacity = 1;
				}
			} else if (dwarfs[i].costCurrency == "gems") {
				if (dwarfs[i].cost > gems.amount) {
					document.getElementById(name).style.opacity = 0.2;
				} else {
					document.getElementById(name).style.opacity = 1;
				}
			}
		}
	}
}

function HoverDwarfs(name) {
	for (i=0; i<dwarfs.length; i++) {
		if (name == dwarfs[i].name) {
			var hoverDiv = document.createElement('div');
			hoverDiv.id = (name.concat(" Hover"));
			hoverDiv.className = "dwarfHover";
			hoverDiv.style.display = "block";
			hoverDiv.style.top = descY.concat("px");
			if (dwarfs[i].costCurrency == "ale") {
				hoverDiv.style.right = '310px';
			} else if (dwarfs[i].costCurrency == "gems") {
				hoverDiv.style.left = '310px';
			}
		 
			var dNameDiv = document.createElement('div');
			dNameDiv.className = "dHoverName";
			dNameDiv.innerHTML = name;
		 
			var dDescDiv = document.createElement('div');
			var description = '"' + dwarfs[i].description + '"';
			dDescDiv.className = "dHoverDesc";
			dDescDiv.innerHTML = description;
		 
			var dCostDiv = document.createElement('div');
			var cost = dwarfs[i].cost;
			dCostDiv.className = "dHoverCost";
			dCostDiv.innerHTML = cost;
		 
			var dInfoDiv = document.createElement('div');
			if (dwarfs[i].costCurrency == "ale") {
				var object = "gems";
			} else if (dwarfs[i].costCurrency == "gems") {
				var object = "ale";
			}
			var amount = dwarfs[i].amount;
			var rate = dwarfs[i].rate;
			var info = amount + " " + name + "s producing " + (rate*amount).toFixed(1) + " " + object +" per second";
			dInfoDiv.className = "dHoverInfo";
			dInfoDiv.innerHTML = info;
			
			var parent = document.getElementById("middle");
			parent.insertBefore(hoverDiv, parent.firstChild);
			hoverDiv.appendChild(dCostDiv);
			hoverDiv.appendChild(dNameDiv);
			hoverDiv.appendChild(dInfoDiv);
			hoverDiv.appendChild(dDescDiv);
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//	Dwarf Animation
////////////////////////////////////////////////////////////////////////////////////////////////////
function dwarfMouseOver() {
	document.getElementById("dwarf").src = "imgs/dwarfMouseOver.png";
}

function dwarfMouseOut() {
	document.getElementById("dwarf").src = "imgs/dwarfNormal.png";
}

function dwarfMouseDown() {
	document.getElementById("dwarf").src = "imgs/dwarfDrink.png";
	gems.amount = gems.amount + gems.perClick;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//	Other Functions
////////////////////////////////////////////////////////////////////////////////////////////////////

function Test(name) {
var hi = name
	alert("This Works" + hi);
}

function toNumber(val) {
	var num = val.toFixed(0);
	return num;
}

function tidyNumber(val) {
	if (val < 1000000) {
		var result = val.toFixed(0);
		return result;
	} else if (val < 1000000000) {
		var result = (val / 1000000).toFixed(3) + " Million";
		return result;
	} else if (val < 1000000000000) {
			var result = (val / 1000000000).toFixed(3) + " Billion";
			return result;
	} else if (val < 1000000000000000) {
			var result = (val / 1000000000000).toFixed(3) + " Trillion";
			return result;
	} else if (val < 1000000000000000000) {
			var result = (val / 1000000000000000).toFixed(3) + " Quadrillion";
			return result;
	} else {
		var result = "Are you serious?";
		return result;
	}
}

function tidyPSNum(val) {
	var num = val.toFixed(0);
	if (val - num == 0) {
		var result = val.toFixed(0);
		return result;
	} else {
		var result = val.toFixed(1);
		return result;
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//	Values
////////////////////////////////////////////////////////////////////////////////////////////////////

function UpdateValues() {
//	Updates Per Click
	gems.perClick = 1 + (fortress.size * fortress.rate);

//	Updates Resource Amount
	ale.amount = ale.amount + (0.1 * ale.perSecond);
	ale.amountFixed = tidyNumber(ale.amount);
	gems.amount = gems.amount + (0.1 * gems.perSecond);
	gems.amountFixed = toNumber(gems.amount);
	fortress.size = toNumber(ale.perSecond * fortress.aleRate);
	
	document.getElementById("ale").innerHTML = ale.amountFixed;
	document.getElementById("gems").innerHTML = gems.amountFixed;
	document.getElementById("fortress").innerHTML = fortress.size;	

//	Updates Resource Amount Per Second
	tempAle = 0;
	tempGems = 0;
	for (i=0; i < dwarfs.length; i++) {
		if (dwarfs[i].costCurrency == "ale") {
			tempGems = tempGems + (dwarfs[i].amount * (dwarfs[i].rate * dwarfs[i].upgrade));
		} else {
			tempAle = tempAle + (dwarfs[i].amount * (dwarfs[i].rate * dwarfs[i].upgrade));
		}
	}
	
	ale.perSecond = tidyPSNum(tempAle);
	gems.perSecond = tidyPSNum(tempGems);
	
	document.getElementById("alePerSecond").innerHTML = ale.perSecond;
	document.getElementById("gemsPerSecond").innerHTML = gems.perSecond;	
}

function DrawValues() {
	var space = " - - - - - ";
	document.getElementById("amount").innerHTML = "- Ales: " + ale.amountFixed + " - - - - Gems: " + gems.amountFixed;
	document.getElementById("perSecond").innerHTML = "Per Second: " + ale.perSecond + " - - - - - Per Second: " + gems.perSecond;
	
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//	Main Loop
////////////////////////////////////////////////////////////////////////////////////////////////////

function GameLoop() {
	
//	Loading and Saving	
	if (load == 0) {
		GameLoad();
	} else {
		WriteSave();
	}	
	
//	Upgrades	
	DrawUpgrades();
	
//	Dwarfs
	DrawDwarfs();
	
//	Updates Per Click
	UpdateValues();
	DrawValues();
}
	
