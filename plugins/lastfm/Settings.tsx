import { DEFAULT_INTERVAL, DEFAULT_NAME } from "./cfg";
import { Component } from "solid-js";

// @ts-expect-error
const { store } = shelter.plugin;
const {
	TextBox,
	SwitchItem,
	Header,
	HeaderTags,
	Divider,
	Text,
	LinkButton,
	Space,
	Button,
	ButtonColors,
	ButtonLooks,
	ButtonSizes,
} = shelter.ui;

const ServiceButton: Component<{
	service: string;
	children: string;
}> = (props) => (
	<Button
		grow
		onClick={() => (store.service = props.service)}
		color={
			store.service === props.service
				? ButtonColors.BRAND
				: ButtonColors.SECONDARY
		}
		look={ButtonLooks.OUTLINED}
		size={ButtonSizes.TINY}
	>
		{props.children}
	</Button>
);

export const settings = () => (
	<>
		<Header tag={HeaderTags.H3}>Application Name</Header>
		<TextBox
			placeholder={DEFAULT_NAME}
			value={store.appName ?? ""}
			onInput={(v) => (store.appName = v)}
		/>

		<Header tag={HeaderTags.H3}>Service</Header>
		<div style="display: flex">
			<ServiceButton service="lfm">Last.fm</ServiceButton>
			<ServiceButton service="lbz">Listenbrainz</ServiceButton>
		</div>

		<Header tag={HeaderTags.H3}>
			{store.service === "lbz" ? "Listenbrainz" : "Last.fm"} username (required)
		</Header>
		<TextBox value={store.user ?? ""} onInput={(v) => (store.user = v)} />

		<Header tag={HeaderTags.H3}>Update interval (seconds)</Header>
		<TextBox
			placeholder={DEFAULT_INTERVAL / 1000 + ""}
			value={store.interval ? store.interval / 1000 + "" : ""}
			onInput={(v) =>
				(!v || !isNaN(parseFloat(v))) &&
				(store.interval = !v
					? undefined
					: parseFloat(v) * 1000 || DEFAULT_INTERVAL)
			}
		/>

		<Divider mt mb />

		<SwitchItem
			value={store.stamp}
			onChange={(v) => (store.stamp = v)}
			note="Show time since song started playing"
		>
			Show time elapsed
		</SwitchItem>

		<SwitchItem
			value={store.ignoreSpotify}
			onChange={(v) => (store.ignoreSpotify = v)}
			note="Hide the status if Spotify is playing"
		>
			Hide when using Spotify
		</SwitchItem>

		<Text>
			Thanks to
			<LinkButton href="https://github.com/amsyarasyiq/letup/blob/main/plugins/Last.fm">
				<Space />
				Pylix's Vendetta plugin
				<Space />
			</LinkButton>
			for useful implementation details and reference.
		</Text>
	</>
);
