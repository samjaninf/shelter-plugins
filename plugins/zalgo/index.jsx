const {
	plugin: { store },
	http: { intercept },
	ui: {
		Header,
		HeaderTags,
		TextBox,
		ErrorBoundary,
		SwitchItem,
		Slider,
		showToast,
	},
} = shelter;

const zalgoUp = [
	"\u030d",
	/*     ̍     */ "\u030e",
	/*     ̎     */ "\u0304",
	/*     ̄     */ "\u0305" /*     ̅     */,
	"\u033f",
	/*     ̿     */ "\u0311",
	/*     ̑     */ "\u0306",
	/*     ̆     */ "\u0310" /*     ̐     */,
	"\u0352",
	/*     ͒     */ "\u0357",
	/*     ͗     */ "\u0351",
	/*     ͑     */ "\u0307" /*     ̇     */,
	"\u0308",
	/*     ̈     */ "\u030a",
	/*     ̊     */ "\u0342",
	/*     ͂     */ "\u0343" /*     ̓     */,
	"\u0344",
	/*     ̈́     */ "\u034a",
	/*     ͊     */ "\u034b",
	/*     ͋     */ "\u034c" /*     ͌     */,
	"\u0303",
	/*     ̃     */ "\u0302",
	/*     ̂     */ "\u030c",
	/*     ̌     */ "\u0350" /*     ͐     */,
	"\u0300",
	/*     ̀     */ "\u0301",
	/*     ́     */ "\u030b",
	/*     ̋     */ "\u030f" /*     ̏     */,
	"\u0312",
	/*     ̒    */ "\u0313",
	/*     ̓     */ "\u0314",
	/*     ̔     */ "\u033d" /*     ̽     */,
	"\u0309",
	/*     ̉     */ "\u0363",
	/*     ͣ    */ "\u0364",
	/*     ͤ    */ "\u0365" /*     ͥ    */,
	"\u0366",
	/*     ͦ    */ "\u0367",
	/*     ͧ    */ "\u0368",
	/*     ͨ    */ "\u0369" /*     ͩ    */,
	"\u036a",
	/*     ͪ    */ "\u036b",
	/*     ͫ    */ "\u036c",
	/*     ͬ    */ "\u036d" /*     ͭ    */,
	"\u036e",
	/*     ͮ    */ "\u036f",
	/*     ͯ    */ "\u033e",
	/*     ̾     */ "\u035b" /*     ͛     */,
	"\u0346",
	/*     ͆     */ "\u031a" /*     ̚     */,
];
const zalgoMid = [
	"\u0315",
	/*     ̕     */ "\u031b",
	/*     ̛     */ "\u0340",
	/*     ̀     */ "\u0341" /*     ́     */,
	"\u0358",
	/*     ͘     */ "\u0321",
	/*     ̡     */ "\u0322",
	/*     ̢     */ "\u0327" /*     ̧     */,
	"\u0328",
	/*     ̨     */ "\u0334",
	/*     ̴     */ "\u0335",
	/*     ̵     */ "\u0336" /*     ̶     */,
	"\u034f",
	/*     ͏     */ "\u035c",
	/*     ͜     */ "\u035d",
	/*     ͝     */ "\u035e" /*     ͞     */,
	"\u035f",
	/*     ͟     */ "\u0360",
	/*     ͠     */ "\u0362",
	/*     ͢     */ "\u0338" /*     ̸     */,
	"\u0337",
	/*     ̷     */ "\u0361",
	/*     ͡     */ "\u0489" /*    ҉_    */,
];
const zalgoDown = [
	"\u0316",
	/*     ̖     */ "\u0317",
	/*     ̗     */ "\u0318",
	/*     ̘     */ "\u0319" /*     ̙     */,
	"\u031c",
	/*     ̜     */ "\u031d",
	/*     ̝     */ "\u031e",
	/*     ̞     */ "\u031f" /*     ̟     */,
	"\u0320",
	/*     ̠     */ "\u0324",
	/*     ̤     */ "\u0325",
	/*     ̥     */ "\u0326" /*     ̦     */,
	"\u0329",
	/*     ̩     */ "\u032a",
	/*     ̪     */ "\u032b",
	/*     ̫     */ "\u032c" /*     ̬     */,
	"\u032d",
	/*     ̭     */ "\u032e",
	/*     ̮     */ "\u032f",
	/*     ̯     */ "\u0330" /*     ̰     */,
	"\u0331",
	/*     ̱     */ "\u0332",
	/*     ̲     */ "\u0333",
	/*     ̳     */ "\u0339" /*     ̹     */,
	"\u033a",
	/*     ̺     */ "\u033b",
	/*     ̻     */ "\u033c",
	/*     ̼     */ "\u0345" /*     ͅ     */,
	"\u0347",
	/*     ͇     */ "\u0348",
	/*     ͈     */ "\u0349",
	/*     ͉     */ "\u034d" /*     ͍     */,
	"\u034e",
	/*     ͎     */ "\u0353",
	/*     ͓     */ "\u0354",
	/*     ͔     */ "\u0355" /*     ͕     */,
	"\u0356",
	/*     ͖     */ "\u0359",
	/*     ͙     */ "\u035a",
	/*     ͚     */ "\u0323" /*     ̣     */,
];

function selectRandomElement(arr) {
	const randomIndex = Math.floor(Math.random() * arr.length);
	return arr[randomIndex];
}

function zalgoify(message) {
	line = doZalgo((contents = message));
	// if (message.length > 2000) {
	if (line.length > 2000) {
		return <ErrorBoundary />;
	}
	return line;
}

function doZalgo(message) {
	let corruptMid =
		store.corruptMid !== undefined
			? store.corruptMid == "o"
				? "o"
				: "b"
			: "b";

	let rampEnd =
		store.rampEnd !== undefined
			? store.rampEnd > 1.0
				? 1.0
				: store.rampEnd
			: 0.05;

	let endAmt =
		store.corruptionAmount !== undefined
			? store.corruptionAmount > 10.0
				? 10.0
				: store.corruptionAmount
			: 0.05;

	let startAmt = 0;

	return getZalgo(
		message,
		corruptMid,
		parseFloat(rampEnd),
		parseFloat(startAmt),
		parseFloat(endAmt),
	);
}

function getZalgo(txt, corruptMid, rampEnd, startAmt, endAmt) {
	//============================================================
	// ZALGO text script by tchouky, adapted/modified by Chami
	// See original at http://eeemo.net/
	//============================================================

	let optMid = corruptMid;

	let newTxt = "";

	let len = txt.length;
	if (len == 0) return "";

	// Figure out at what index the ramp ends
	let rampEndIndex = len * rampEnd;

	for (var i = 0; i < len; i++) {
		if (isZalgoChar(txt.substr(i, 1))) continue;

		// Add the normal character
		newTxt += txt.substr(i, 1);

		// Normalized value (0-1.0) representing our current position within the ramp
		let rampX = rampEndIndex == 0 ? 1 : Math.min(1, i / rampEndIndex);
		// Square the ramp value to ease it in
		rampX = Math.pow(rampX, 4);
		// To determine the final corruption amount at this position
		let rampDiff = rampX * (endAmt - startAmt);
		let amt = startAmt + rampDiff;

		// Modifier of .07 for up/down corruption accounts for the fact that
		// discord only displays a small portion of the characters above/below text
		let upDownMod = 0.07;
		let numUp = amt * (rand(64) / 4 + 3) * upDownMod;
		let numMid = amt * (rand(16) / 4 + 1);
		let numDown = amt * (rand(64) / 4 + 3) * upDownMod;

		// upward zalgo is disabled in current version except through manual config modification
		if (store.corruptDir == "corruptUp")
			for (var j = 0; j < numUp; j++) newTxt += randZalgo(zalgoUp);

		// middle corruption obscures the text itself
		if (optMid) for (var j = 0; j < numMid; j++) newTxt += randZalgo(zalgoMid);

		// downward corruption begins at the text baseline
		if (store.corruptDir == "corruptDown")
			for (var j = 0; j < numDown; j++) newTxt += randZalgo(zalgoDown);
	}

	// HE COMES
	return newTxt;
}

// Gets an int between 0 and max
function rand(max) {
	return Math.floor(Math.random() * max);
}

// Gets a random char from a zalgo char table
function randZalgo(array) {
	var ind = Math.floor(Math.random() * array.length);
	return array[ind];
}

// Lookup char to know if it's a zalgo char or not
function isZalgoChar(c) {
	var i;
	for (i = 0; i < zalgoUp.length; i++) if (c == zalgoUp[i]) return true;
	for (i = 0; i < zalgoDown.length; i++) if (c == zalgoDown[i]) return true;
	for (i = 0; i < zalgoMid.length; i++) if (c == zalgoMid[i]) return true;
	return false;
}

const unintercept = intercept(
	"post",
	/\/channels\/\d+\/messages/,
	(req, send) => {
		let newContent = req?.body?.content;
		// log(newContent);
		if (!newContent) {
			return send(req);
		}
		if (newContent.startsWith("!z ")) {
			newContent = newContent.replace("!z ", "", 1);
			req.body.content = zalgoify(newContent);
		}
		return send(req);
	},
);

export function onUnload() {
	unintercept();
}

export const settings = () => (
	<>
		<Header tag={HeaderTags.H3}>Corruption Amount</Header>
		<Slider
			tootltip="From 0.05 to a maximum of 10"
			min="0.05"
			max="10.0"
			step="0.01"
			value={store.corruptionAmount}
			onInput={(v) => (store.corruptionAmount = v)}
		/>
		<Header tag={HeaderTags.H3}>Ramp end position</Header>
		<Slider
			tooltip="From 0.05 to a Maximum of 1"
			min="0.05"
			max="1.0"
			step="0.01"
			value={store.rampEnd}
			onInput={(v) => (store.rampEnd = v)}
		/>
		<Header tag={HeaderTags.H3}>Obscure text</Header>
		<TextBox
			tooltip="o for over the text, or b for behind the text."
			placeholder="b"
			value={store.corruptMid}
			onInput={(v) => (store.corruptMid = v)}
		/>
		<Header tag={HeaderTags.H3}>Corruption Direction</Header>
		<select
			value={store.corruptDir}
			onInput={(v) => (store.corruptDir = v.target.value)}
		>
			<option value="corruptMid">Mid</option>
			<option value="corruptUp">Up</option>
			<option value="corruptDown">Down</option>
		</select>
	</>
);
