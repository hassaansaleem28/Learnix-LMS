import { store } from "../redux-toolkit/store";
import { Provider } from "react-redux";

interface ProviderProps {
  children: any;
}

export function Providers({ children }: ProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
