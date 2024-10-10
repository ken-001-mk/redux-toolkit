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

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    UserResponse,
    LoginRequest,
    LogOutResponse,
    AuthState,
    RegisterResponse,
    RegisterRequest,
} from "./types";
import type { RootState } from "../../store";
import { createSlice } from "@reduxjs/toolkit/react";

export const authBlogApi = createApi({
	baseQuery: fetchBaseQuery({
    	// Replace your address here if needed i.e. your forwarded address from a cloud environment
    	baseUrl: "http://127.0.0.1:4040/api/",
    	prepareHeaders: (headers, { getState }) => {
        	const token = (getState() as RootState).auth.token;
        	if (token) {
            	headers.set("Authorization", `Bearer ${token}`);
        	}
        	return headers;
    	},
    	credentials: "include",
	}),
	endpoints: (builder) => ({
    	login: builder.mutation<UserResponse, LoginRequest>({
        	query: (credentials) => ({
            	url: "auth/login",
            	method: "POST",
            	body: credentials,
        	}),
    	}),
    	logout: builder.mutation<LogOutResponse, void>({
        	query: () => ({
            	url: "auth/logout",
            	method: "POST",
            	validateStatus(response) {
                	return response.ok === true;
            	},
        	}),
    	}),
    	register: builder.mutation<RegisterResponse, RegisterRequest>({
        	query: (info) => ({
            	url: "auth/register",
            	method: "POST",
            	body: info,
            	validateStatus(response) {
                	return response.ok === true
            	}
        	})
    	})
	}),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } = authBlogApi;

const authSlice = createSlice({
	name: "auth",
	initialState: {
    	user: null,
    	token: null,
	} as AuthState,
	reducers: {
		refreshAuthentication: (state) => {
			const isAuthenticated = sessionStorage.getItem("isAuthenticated");
			if (isAuthenticated === "true") {
					const userSession = sessionStorage.getItem("user");
					const response: UserResponse = JSON.parse(
							userSession as string,
					) as UserResponse;
					state.token = response.token;
					state.user = {
							username: response.username,
							id: response.userId,
							email: response.email,
							role: response.role,
					};
			}
			return state;
		},
	},
	extraReducers(builder) {
		builder.addMatcher(
				authBlogApi.endpoints.login.matchFulfilled,
				(state, { payload }) => {
						state.token = payload.token;
						state.user = {
								id: payload.userId,
								username: payload.username,
								email: payload.email,
								role: payload.role,
						};
						sessionStorage.setItem("isAuthenticated", "true");
						sessionStorage.setItem("user", `${JSON.stringify(payload)}`);
						return state;
				},
		);
		builder.addMatcher(authBlogApi.endpoints.logout.matchFulfilled, (state) => {
				state.token = null;
				state.user = null;
				sessionStorage.removeItem("isAuthenticated");
				sessionStorage.removeItem("user");
				return state;
		});
	},
});

export const { refreshAuthentication } = authSlice.actions;
export default authSlice.reducer;