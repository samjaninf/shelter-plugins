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
  if (window.goofcord.getConfig("invidiousEmbeds") === false) return;
  injectOrUpdateCSS(style, "invidious-embed-css");
  for (const t of TRIGGERS) dispatcher.subscribe(t, handleDispatch);
}
// store.instance ??= "yewtu.be";
store.instance ??= "inv.n8pjl.ca";

// taken and improved from more-embeds

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
      e.parentElement.querySelector(`iframe[src*="${store.instance}"]`)?.remove();
      e.parentElement.querySelector(`div[class="invidious-thumbnail"]`)?.remove();

      // const found = reactFiberWalker(getFiber(e), "embed", true)?.memoizedProps
      const yurl = reactFiberWalker(getFiber(e), "embed", true)?.memoizedProps?.embed?.url;
      // const yurl = new URL(found)

      if (
        // !(typeof found === "string") ||
        !(typeof yurl.hostname === "string") ||
        // !found.startsWith("https://www.youtube.com") ||
        !yurl.hostname === ("youtube.com") ||
        // !found.startsWith("https://www.youtu.be") ||
        !yurl.hostname === ("youtu.be") ||
        !yurl.hostname === ("youtube-nocookie.com") ||
        !yurl.hostname.endsWith(".youtube.com") ||
        !yurl.hostname.endsWith(".youtube-nocookie.com") ||
        !yurl.hostname.endsWith(".youtu.be")
      )
        return;
      e.style.display = "none";

      // let thumbs = e.parentElement.querySelectorAll('img[src*="img.youtube.com"], img[src*="i.ytimg.com"]');

      // for (let x = 0; x < thumbs.length; x++) 
      // {
      //     let thumb = thumbs[x];
      //     let thumbsrc = new URL(thumb.src);

      //     if (thumbsrc.hostname === "img.youtube.com" || thumbsrc.hostname === "i.ytimg.com")
      //     {
      //         if (thumb.hasAttribute('srcset') && thumb.srcset.indexOf(thumbsrc) !== -1)
      //         {
      //             thumb.setAttribute('srcset', thumb.srcset.replace(thumbsrc, thumbsrc.protocol + '//' + instance + thumbsrc.pathname + thumbsrc.search + thumbsrc.hash));
      //         }
      //         thumb.setAttribute('src', thumbsrc.protocol + '//' + instance + thumbsrc.pathname + thumbsrc.search + thumbsrc.hash);
      //     }
      // }

      // const match = found.match(/v=([a-zA-Z0-9-_]+)/);
      // if (!match?.[1]) return;
      // const tsMatch = found.match(/t=(?:\d+|(?:\d+m)?\d+s|\d+m)/);

      // const embPath = tsMatch?.[0] ? match[1] + "?" + tsMatch[0] : match[1];

      // e.style.display = "none";
      // e.insertAdjacentElement(
      // 	"afterend",
      // 	<iframe
      // 		style="border: 0; width: 100%; max-width: 600px; aspect-ratio: 16/9"
      // 		src={`https://${store.instance}/embed/${embPath}?autoplay=0`}
      // 		allow="fullscreen"
      // 	/>,
      // );
      const embPath = found.replace("https://www.youtube.com/watch?v=", "")

      const iframe = (<iframe
        className={"invidious-embed"}
        src={`${store.instance}/embed/${embPath}?autoplay=0&player_style=youtube&local=true`}
        allow="fullscreen"
      />)

      function showIframe() {
        e.insertAdjacentElement(
          "afterend",
          iframe,
        );
        preview.style.display = "none";
      }

      const preview = (<div className={"invidious-thumbnail invidious-embed"}>
        <div className={"invidious-wrapper"}>
          <svg onClick={showIframe} className={"invidious-playbutton"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="white" d="M9.25 3.35C7.87 2.45 6 3.38 6 4.96v14.08c0 1.58 1.87 2.5 3.25 1.61l10.85-7.04a1.9 1.9 0 0 0 0-3.22L9.25 3.35Z" className=""></path>
          </svg>
        </div>
      </div>)
      preview.style.backgroundImage = `url(https://i.ytimg.com/vi/${embPath}/hqdefault.jpg)`;

      e.insertAdjacentElement(
        "afterend",
        preview,
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
      placeholder="inv.n8pjl.ca"
      value={store.instance}
      onInput={(v) => (store.instance = v)}
    />
  </>
);

const style = `
    .invidious-embed {
        border: 0; 
        width: 100%; 
        max-width: 500px; 
        aspect-ratio: 16/9; 
        border-radius: 4px
    }
    
    .invidious-thumbnail {
        display: flex;
        align-content: center;
        flex-wrap: wrap;
        justify-content: center;
        background-position: center;
    }
    
    .invidious-wrapper {
        box-sizing: border-box;
        display: flex;
        padding: 12px;
        height: 48px;
        border-radius: 24px;
        background-color: hsl(0 calc( 1 * 0%) 0% /.6);
    }
    
    .invidious-playbutton {
        cursor: pointer;
        transition: opacity .25s;
        opacity: .6;
    }
    
    .invidious-playbutton:hover {
        opacity: 1;
    }
`