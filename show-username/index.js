const {
  plugin: { scoped, store },
  util: { getFiber, reactFiberWalker }
} = shelter;

const USERNAME_QUERY = '[id^="message-username-"] > [class^="username"]';

export function forceAddUsernames() {
  for (const e of document.querySelectorAll(USERNAME_QUERY)) {
      addUsername(e, true);
  }
}

function addUsername(e, overwrite = false) {
  if (e.querySelector(".shelter-su") && !overwrite) return;

  const props = reactFiberWalker(getFiber(e), "message", true)?.pendingProps;
  if (!props?.author || !props?.message) return;

  const { nick } = props.author;
  const { username } = props.message.author;

  const style =
      "font-weight: 600;border-radius: 4px;padding: 0 4px;background: var(--background-secondary);";
  const usernameElement = (
      <span style={style} className={"shelter-su"}>
          ({username})
      </span>
  );

  // const appendNick = nick && !store.usernamesOnly && username !== nick;
  const appendNick = nick && !store.usernamesOnly;
  e.textContent = appendNick ? `${nick} ` : ``;
  e.append(usernameElement);
}

export function onLoad() {
  store.usernamesOnly ??= false;
  // apply on usernames that are already in the DOM
  forceAddUsernames();

  // using a long living observeDom here because awaiting dispatches is a bit slower and
  // adds excessive complexity for what it's worth
  scoped.observeDom(USERNAME_QUERY, (e) => {
      queueMicrotask(() => {
          addUsername(e);
      });
  });
}

export { default as settings } from "./settings";