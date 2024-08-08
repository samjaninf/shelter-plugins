import { updateFastestInstance } from "./instanceTester.jsx";

const {
	plugin: { store },
	observeDom,
	flux: {
		dispatcher,
		storesFlat: { SelectedChannelStore },
	},
	util: { reactFiberWalker, getFiber },
	ui: { Header, HeaderTags, TextBox },
} = shelter;

export async function onLoad() {
	store.instance ??= await updateFastestInstance();
	for (const t of TRIGGERS) dispatcher.subscribe(t, handleDispatch);
}

store.instance ??= "invidious.darkness.services";

const TRIGGERS = [
	"MESSAGE_CREATE",
	"MESSAGE_UPDATE",
	"UPDATE_CHANNEL_DIMENSIONS",
];

function handleDispatch(payload) {
	if (!store.instance) return;
	if (
		(payload.type === "MESSAGE_CREATE" || payload.type === "MESSAGE_UPDATE") &&
		payload.message.channel_id !== SelectedChannelStore.getChannelId()
	)
		return;

	const unobs = observeDom(
		`[id^="chat-messages-"] article:not([data-invidivizer])`,
		(e) => {
			// mutex
			e.dataset.invidivizer = "1";
			unobs();

			// fix duplicates lol
			e.parentElement
				.querySelector(`iframe[src*="${store.instance}"]`)
				?.remove();
			e.parentElement
				.querySelector(`div[class="invidious-thumbnail"]`)
				?.remove();

			const found = reactFiberWalker(getFiber(e), "embed", true)?.memoizedProps
				?.embed?.url;

			if (
				typeof found !== "string" ||
				!found.startsWith("https://www.youtube.com")
			)
				return;
			e.style.display = "none";

			const match = found.match(/v=([a-zA-Z0-9-_]+)/);
			if (!match?.[1]) return;
			const tsMatch = found.match(/t=(?:\d+|(?:\d+m)?\d+s|\d+m)/);

			const embPath = tsMatch?.[0] ? match[1] + "?" + tsMatch[0] : match[1];

			e.style.display = "none";
			e.insertAdjacentElement(
				"afterend",
				<iframe
					style="border: 0; width: 100%; max-width: 600px; aspect-ratio: 16/9"
					src={`https://${store.instance}/embed/${embPath}?autoplay=0&local=true&player_style=youtube`}
					allow="fullscreen"
				/>,
			);
		},
	);

	setTimeout(unobs, 1000); // dangling
}

for (const t of TRIGGERS) dispatcher.subscribe(t, handleDispatch);

export function onUnload() {
	for (const t of TRIGGERS) dispatcher.unsubscribe(t, handleDispatch);
}

export const settings = () => (
	<>
		<Header tag={HeaderTags.H3}>Invidious Instance</Header>
		<TextBox
			placeholder="invidious.darkness.services"
			value={store.instance}
			onInput={(v) => (store.instance = v)}
		/>
	</>
);
