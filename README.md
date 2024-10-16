# TS FiveM React TS Mantine Boilerplate

This is a boilerplate for creating React applications using TypeScript and Mantine V6. If you prefer to use Mantine V7, you can change the package version accordingly.

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Thomasdev18/ts-fivem-react-mantine-boilerplate.git
   cd ts-fivem-react-mantine-boilerplate
   ```

2. **Install the dependencies**:

   ```bash
   pnpm i
   ```

3. **Run the development server**:

   ```bash
   pnpm start
   ```

   This will start the development server and open the application in your default browser.

   !! TO VIEW IN BROWSER REMEMBER TO COMMENT OUT THE VISIBILITY PROVIDER AROUND THE COMPONENT !!

## Files and Their Purpose

### `debugData.ts`

This file is used to simulate events in the browser environment during development. When you are testing your React components in a browser (instead of in the FiveM client), you can use this function to dispatch mock events to simulate `SendNuiMessage` behavior.

#### **Function: `debugData`**

Takes an array of events and a timer. It dispatches a browser event for each event in the list after the specified timer duration.

```typescript
export const debugData = <P>(events: DebugEvent<P>[], timer = 1000): void => {
  if (import.meta.env.MODE === "development" && isEnvBrowser()) {
    for (const event of events) {
      setTimeout(() => {
        window.dispatchEvent(
          new MessageEvent("message", {
            data: {
              action: event.action,
              data: event.data,
            },
          }),
        );
      }, timer);
    }
  }
};
```

### `fetchNui.ts`

This file provides a utility function to send data from the React frontend to the FiveM client using NUI messages. It also supports mock data for browser development.

#### **Function: `fetchNui`**

Sends a POST request to the FiveM client. If in a browser environment (`isEnvBrowser`), it returns mock data.

```typescript
export async function fetchNui<T = unknown>(
  eventName: string,
  data?: unknown,
  mockData?: T,
): Promise<T> {
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  };

  if (isEnvBrowser() && mockData) return mockData;

  const resourceName = (window as any).GetParentResourceName
    ? (window as any).GetParentResourceName() : "nui-frame-app";

  const resp = await fetch(`https://${resourceName}/${eventName}`, options);

  const respFormatted = await resp.json();

  return respFormatted;
}
```

### `misc.ts`

This file contains utility functions that help determine the environment (browser or client).

#### **Function: `isEnvBrowser`**

Returns `true` if the code is running in a browser environment, and `false` if in the FiveM client.

```typescript
export const isEnvBrowser = (): boolean => !(window as any).invokeNative;
```

### `VisibilityProvider.ts`

This component provides a context for managing the visibility of different UI components. It is particularly useful for toggling UI components on and off based on NUI events or user interactions.

#### **Component: `VisibilityProvider`**

A React context provider that controls the visibility state of its children. It listens for NUI events and keypresses to show or hide the component.

```typescript
export const VisibilityProvider: React.FC<{ children: React.ReactNode; componentName: string; }> = ({ children, componentName }) => {
  const [visible, setVisible] = useState(false);
  
  useNuiEvent<boolean>(`setVisible${componentName}`, setVisible);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (visible && e.code === "Escape") {
        if (!isEnvBrowser()) fetchNui("hideFrame", { name: `setVisible${componentName}` });
        else setVisible(false);
      }
    };
    window.addEventListener("keydown", keyHandler);

    return () => window.removeEventListener("keydown", keyHandler);
  }, [visible, componentName]);

  return (
    <VisibilityCtx.Provider value={{ visible, setVisible }}>
      <div style={{ visibility: visible ? "visible" : "hidden" }}>
        {children}
      </div>
    </VisibilityCtx.Provider>
  );
};
```

#### **Hook: `useVisibility`**

Provides access to the visibility state and a function to change it.

```typescript
export const useVisibility = () =>
  useContext<VisibilityProviderValue>(
    VisibilityCtx as React.Context<VisibilityProviderValue>
  );
```

### `useNuiEvent.ts`

This custom hook is used to handle events sent from the client via the NUI message system. It listens for messages from the FiveM client and triggers a handler function.

#### **Hook: `useNuiEvent`**

Registers a listener for a specific NUI event and triggers the provided handler whenever the event is received.

```typescript
export const useNuiEvent = <T = unknown>(
  action: string,
  handler: (data: T) => void,
) => {
  const savedHandler: MutableRefObject<NuiHandlerSignature<T>> = useRef(noop);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: MessageEvent<NuiMessageData<T>>) => {
      const { action: eventAction, data } = event.data;

      if (savedHandler.current) {
        if (eventAction === action) {
          savedHandler.current(data);
        }
      }
    };

    window.addEventListener("message", eventListener);
    return () => window.removeEventListener("message", eventListener);
  }, [action]);
};
```

## Lua

`nui.lua`

```lua
function ShowNUI(action, shouldShow)
    SetNuiFocus(shouldShow, shouldShow)
    SendNUIMessage({ action = action, data = shouldShow })
end

function SendNUI(action, data)
    SendNUIMessage({ action = action, data = data })
end
```

The `action` should contain `setVisible` and the component name defined in `main.tsx` to properly control the visibility of your UI components from the client side. The action could also be a action to trigger a nui event in the frontend using `useNuiEvent.ts`

EXAMPLE:
```lua
ShowNUI('setVisibleWelcome', true)
```

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests.

## License

This project is licensed under the GPL V3 License.

## Credits
Credits to Marttins | MT-Scripts for some inspo on the VisibilityProvider.
