////////////////////////////////////////////////////////////////////////////////////////////////////
//	Variables
////////////////////////////////////////////////////////////////////////////////////////////////////

//	Ale

var aleAmount = 0;
var aleAmountFixed = 0;
var alePerSecondAmount = 0;

var barmaidAmount = 0;
var barmaidCostBase = 10;
var barmaidCost = 10;

var breweryAmount = 0;
var breweryCostBase = 25;
var breweryCost = 25;

//	Gems

var gemsAmount = 0;
var gemsAmountFixed = 0;
var gemsPerSecondAmount = 0;

var minerAmount = 0;
var minerCostBase = 25;
var minerCost = 25;

var mineAmount = 0;
var mineCostBase = 100;
var mineCost = 100;

//	Other

var update = setInterval(function(){gameUpdate()}, 100);


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
	gemsAmount++;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//	Upgrades
////////////////////////////////////////////////////////////////////////////////////////////////////

//	Ale

function buyBarmaid() {
	if (gemsAmount < barmaidCost) {
	} else {
		barmaidAmount++;
		gemsAmount = gemsAmount - barmaidCost;
		barmaidCost = barmaidCostBase * (Math.pow(1.2, barmaidAmount));
		barmaidCost = barmaidCost.toFixed(0);
	}
}

function buyBrewery() {
	if (gemsAmount < breweryCost) {
	} else {
		breweryAmount++;
		gemsAmount = gemsAmount - breweryCost;
		breweryCost = breweryCostBase * (Math.pow(1.2, breweryAmount));
		breweryCost = breweryCost.toFixed(0);
	}
}

//	Gems

function buyMiner() {
	if (aleAmount < minerCost) {
	} else {
		minerAmount++;
		aleAmount = aleAmount - minerCost;
		minerCost = minerCostBase * (Math.pow(1.2, minerAmount));
		minerCost = minerCost.toFixed(0);
	}
}

function buyMine() {
	if (aleAmount < mineCost) {
	} else {
		mineAmount++;
		aleAmount = aleAmount - mineCost;
		mineCost = mineCostBase * (Math.pow(1.2, mineAmount));
		mineCost = mineCost.toFixed(0);
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//	Update
////////////////////////////////////////////////////////////////////////////////////////////////////
function gameUpdate() {

//	Ale

	alePerSecondAmount = (barmaidAmount * 0.5) + (breweryAmount * 2);

	aleAmount = aleAmount + (0.1 * alePerSecondAmount);
	aleAmountFixed = aleAmount.toFixed(0);
	
	document.getElementById("ale").innerHTML = aleAmountFixed;
	document.getElementById("alePerSecond").innerHTML = alePerSecondAmount;
	document.getElementById("barmaid").innerHTML = barmaidAmount;
	document.getElementById("brewery").innerHTML = breweryAmount;
	document.getElementById("barmaidCost").innerHTML = barmaidCost;
	document.getElementById("breweryCost").innerHTML = breweryCost;
	
	if (gemsAmount < barmaidCost) {
		document.getElementById("buyBarmaid").style.color="#888888";
		document.getElementById("barmaidCost").style.color="#888888";
	} else {
		document.getElementById("buyBarmaid").style.color="#000000";
		document.getElementById("barmaidCost").style.color="#00CC00";
	}	
	if (gemsAmount < breweryCost) {
		document.getElementById("buyBrewery").style.color="#888888";
		document.getElementById("breweryCost").style.color="#888888";
	} else {
		document.getElementById("buyBrewery").style.color="#000000";
		document.getElementById("breweryCost").style.color="#00CC00";
	}

//	Gems

	gemsPerSecondAmount = (minerAmount * 0.5) + (mineAmount * 5);

	gemsAmount = gemsAmount + (0.1 * gemsPerSecondAmount);
	gemsAmountFixed = gemsAmount.toFixed(0);
	
	document.getElementById("gems").innerHTML = gemsAmountFixed;
	document.getElementById("gemsPerSecond").innerHTML = gemsPerSecondAmount;
	document.getElementById("miner").innerHTML = minerAmount;
	document.getElementById("mine").innerHTML = mineAmount;
	document.getElementById("minerCost").innerHTML = minerCost;
	document.getElementById("mineCost").innerHTML = mineCost;
	
	if (aleAmount < minerCost) {
		document.getElementById("buyMiner").style.color="#888888";
		document.getElementById("minerCost").style.color="#888888";
	} else {
		document.getElementById("buyMiner").style.color="#000000";
		document.getElementById("minerCost").style.color="#00CC00";
	}
	if (aleAmount < mineCost) {
		document.getElementById("buyMine").style.color="#888888";
		document.getElementById("mineCost").style.color="#888888";
	} else {
		document.getElementById("buyMine").style.color="#000000";
		document.getElementById("mineCost").style.color="#00CC00";
	}
}	