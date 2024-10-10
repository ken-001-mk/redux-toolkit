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

import Login from "./pages/auth/Login";
import CreatePost from "./pages/posts/CreatePost";
import AllPost from "./pages/posts/AllPosts";
import { useAppSelector } from "./store";
import UserSpecificPosts from "./pages/posts/UserSpecificPosts";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Posts from "./pages/posts/Posts";
import EditPost from "./pages/posts/EditPost";
import NotFound from "./pages/404";
import Register from "./pages/auth/Register";
import type { AuthState, UserResponse } from "./services/auth/types";
import "./App.css";

const App = () => {
	let authState: AuthState = {
    	user: null,
    	token: null
	}
	const { user, token } = useAppSelector((state) => state.auth);
	const userSession = sessionStorage.getItem("user");
	const response: UserResponse = userSession ? JSON.parse(userSession) : null;
	if (sessionStorage.getItem("isAuthenticated") === "true" && response !== null) {
   		authState = {
			user: {
				username: response.username,
				id: response.userId,
				email: response.email,
				role: response.role
			},
       		token: response.token ?? token
   		}
	}
	const isAuthenticated = authState.user !== null && authState.token !== null;

	const router = createBrowserRouter([
    	{
        	path: "/",
        	element: (
            	<Login authState={authState} isAuthenticated={isAuthenticated} />
        	),
        	children: [
            	{
                	path: "register",
                	element: (
                    	<Register isAuthenticated={isAuthenticated} />
                	),
            	},
        	],
    	},
    	{
        	path: "/post/create/",
        	element: (
            	<CreatePost isAuthenticated={isAuthenticated} authState={authState} />
        	),
    	},
    	{
        	path: "/posts/",
        	element: (
            	<Posts isAuthenticated={isAuthenticated} authState={authState} />
        	),
        	children: [
            	{
                	path: "",
                	element: <AllPost />,
            	},
            	{
                	path: "user/:username",
                	element: <UserSpecificPosts isAuthenticated={isAuthenticated} />,
                	loader: async ({ params }) => {
                    	return params.username;
                	},
            	},
            	{
                	path: "user/:username/post/edit/:postId",
                	element: <EditPost isAuthenticated={isAuthenticated} />,
                	loader: ({ params }) => {
                    	return { username: params.username, postId: params.postId };
                	},
            	},
        	],
    	},
    	{
        	path: "*",
        	element: <NotFound />,
    	},
	]);

	return (
    	<div>
        	<RouterProvider router={router} />
    	</div>
	);
};

export default App;