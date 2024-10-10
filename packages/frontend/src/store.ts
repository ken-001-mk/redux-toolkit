// Copyright 2024 mwask
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     https://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { setupListeners } from "@reduxjs/toolkit/query";
import { authBlogApi, refreshAuthentication } from "./services/auth/authSlice";
import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { blogApi } from "./services/posts/blogSlice";
import authReducer from "./services/auth/authSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";


/**
 * This part is important. We need to keep the user logged in even after browser refresh.
 * This is because our app is running client-side so any reload can cause changes to be
 * discarded. So we have to store it either in **local storage** or **session storage**.
 **/
const authListener = createListenerMiddleware();

const store = configureStore({
    	reducer: {
            	[blogApi.reducerPath]: blogApi.reducer,
            	[authBlogApi.reducerPath]: authBlogApi.reducer,
            	auth: authReducer
    	},
    	middleware: (getDefaultMiddleware) => {
            	return getDefaultMiddleware()
                    	.concat(authBlogApi.middleware)
                    	.concat(blogApi.middleware)
                    	.concat(authListener.middleware);
    	},
});
setupListeners(store.dispatch)


/**
 * This part is important. We need to keep the user logged in even after browser refresh.
 * This is because our app is running client-side so any reload can cause changes to be
 * discarded.
 **/
authListener.startListening.withTypes<RootState, AppDispatch>()({
	predicate(_action, currentState, _originalState) {
			return (
					currentState.auth.token === null &&
					currentState.auth.user === null &&
					sessionStorage.getItem("isAuthenticated") === "true"
			);
	},
	effect: async (_action, listenerApi) => {
			console.log("Needs update");
			listenerApi.dispatch(refreshAuthentication());
			await listenerApi.delay(800);
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export default store;