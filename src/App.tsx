import { useToast } from "./toast-context";

const LOREM =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus, vero? Esse nesciunt fugit exercitationem? Nisi saepe nostrum quo? Id quidem explicabo tempore deserunt rerum distinctio minus ipsam laboriosam ullam mollitia.";

export default function App() {
  const { addToast, clearAllToasts } = useToast();

  const onSubmit = (event: any) => {
    event.preventDefault();

    const autoDismiss = event.target.elements.autoDismiss.checked;
    const autoDismissTimeoutRaw =
      event.target.elements.autoDismissTimeout.value;
    const autoDismissTimeout = Number(autoDismissTimeoutRaw)
      ? autoDismissTimeoutRaw
      : 5000;

    const text = event.target.elements.text.value || LOREM;
    const toastType = event.target.elements.toastType.value;

    addToast({
      autoDismiss,
      autoDismissTimeout,
      msg: text,
      type: toastType
    });
  };

  return (
    <div style={{ margin: 64 }}>
      <form
        onSubmit={onSubmit}
        style={{
          alignItems: "start",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div>
          <select name="toastType" defaultValue="success">
            <option value="success">Success</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>

          <div>
            <br />
            <input
              type="checkbox"
              id="autoDismiss"
              name="autoDismiss"
              defaultChecked={true}
            />
            <label htmlFor="autoDismiss">AutoDismiss</label>
          </div>

          <div>
            <br />
            <input
              id="autoDismissTimeout"
              name="autoDismissTimeout"
              defaultValue="5000"
            />
            <label htmlFor="autoDismissTimeout">
              AutoDismissTimeout (in ms)
            </label>
          </div>
        </div>
        <br />

        <textarea
          name="text"
          rows={4}
          cols={50}
          placeholder="Toast message..."
        />
        <br />

        <button type="submit">Create toast</button>
        <br />
      </form>

      <button onClick={clearAllToasts}>Clear all toats</button>
    </div>
  );
}
