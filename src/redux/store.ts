import { configureStore } from "@reduxjs/toolkit";
import loading from "./reducers/loading";
import reverseList from "./reducers/reverseList";
import theme from "./reducers/theme";

export const store = configureStore({
    reducer: {
        theme: theme,
        reverseList: reverseList,
        loading: loading
    }
});

export type RootState = ReturnType<typeof store.getState>;