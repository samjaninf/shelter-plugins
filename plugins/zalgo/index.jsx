const {
	plugin: { store },
	http: { intercept },
	ui: { Header, HeaderTags, TextBox },
	util: { showToast, ErrorBoundary },
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

const defaultSettings = {
	corruptionAmount: 1.0,
	rampEnd: 0.7,
	corruptUp: false,
	corruptMid: true,
	corruptDown: false,
};

function selectRandomElement(arr) {
	const randomIndex = Math.floor(Math.random() * arr.length);
	return arr[randomIndex];
}
// returns true if all characters in the string are the same
// "aaaaaaaaaaaaa" -> true
// "aaaaaaaaaaaab" -> false
const isOneCharacterString = (str) => {
	return str.split("").every((char) => char === str[0]);
};

// function replaceString(inputString) {
//   let replaced = false;
//   for (const replacement of replacements) {
//     const regex = new RegExp(`\\b${replacement[0]}\\b`, "gi");
//     if (regex.test(inputString)) {
//       inputString = inputString.replace(regex, replacement[1]);
//       replaced = true;
//     }
//   }
//   return replaced ? inputString : false;
// }

function zalgoify(message) {
	const rule = /\S+|\s+/g;
	const words = message.match(rule);
	let answer = "";

	if (words === null) return "";

	let regex =
		/\{\{(?:(?:(?:(o|b))?,?)?(?:(r)(\d+(?:\.\d+)?)?,?)?(?:(\d+(?:\.\d+)?)-)?(\d+(?:\.\d+)?)?\:)?((?:(?!{{).)*?)\}\}/g;
	if (regex.test(message)) {
		message = message.replace(regex, doZalgo(message));
		if (message.length > 2000) {
			// log("This message would exceed the 2000-character limit.\nReduce corruption amount or shorten text.\n\nLength including corruption: " + value.length, { type: 'error' });
			showToast({
				title: "Message Too Long",
				content:
					"This message would exceed the 2000-character limit.\nReduce corruption amount or shorten text.\n\nLength including corruption: " +
					value.length,
				onClick() {},
				duration: 3000,
			});
			// e.preventDefault();
			return <ErrorBoundary />;
		}
		message = message;
	}

	for (let i = 0; i < words.length; i++) {
		if (isOneCharacterString(words[i]) || words[i].startsWith("https://")) {
			answer += words[i];
			continue;
		}
	}

	// answer += " " + selectRandomElement(endings);
	return answer;
}

function doZalgo(
	match,
	midMode,
	ramp,
	rampEnd,
	startAmt,
	endAmt,
	contents,
	offset,
	string,
) {
	const maxAmt = 10;
	let hasStart = startAmt >= 0 && startAmt <= maxAmt;
	let hasEnd = endAmt >= 0 && endAmt <= maxAmt;
	let hasRampEnd = rampEnd >= 0 && rampEnd <= 1;

	let corruptMid = midMode == "o" || (midMode != "b" && store.corruptMid);
	let doRamp = ramp == "r" || hasStart;

	if (!hasRampEnd) rampEnd = store.rampEnd;
	// use default end amount if not provided
	if (!hasEnd) endAmt = store.corruptionAmount;
	// set end/start amounts to equal if we're not ramping anyway
	if (!doRamp) startAmt = endAmt;
	// otherwise, start at 0 if we are ramping but no start provided
	else if (!hasStart) startAmt = 0;

	return getZalgo(
		contents,
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

	// Get saved options for corruption directions
	let config = store;
	let optUp = config.corruptUp;
	let optMid = corruptMid;
	let optDown = config.corruptDown || (!optUp && !optMid);

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
		if (optUp) for (var j = 0; j < numUp; j++) newTxt += randZalgo(zalgoUp);

		// middle corruption obscures the text itself
		if (optMid) for (var j = 0; j < numMid; j++) newTxt += randZalgo(zalgoMid);

		// downward corruption begins at the text baseline
		if (optDown)
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
			req.body.content = zalgoify((contents = newContent));
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
		<TextBox
			placeholder="0.05"
			value={store.corruptionAmount}
			onInput={(v) => (store.corruptionAmount = v)}
		/>
		<Header tag={HeaderTags.H3}>Ramp end position</Header>
		<TextBox
			placeholder="0.05"
			value={store.rampEnd}
			onInput={(v) => (store.rampEnd = v)}
		/>
		<Header tag={HeaderTags.H3}>Obscure text</Header>
		<TextBox
			placeholder="b"
			value={store.corruptMid}
			onInput={(v) => (store.corruptMid = v)}
		/>
	</>
);
