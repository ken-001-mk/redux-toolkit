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

import { useState } from "react";
import { useNavigate } from "react-router";
import { useRegisterMutation } from "../../services/auth/authSlice";
import type { RegisterRequest } from "../../services/auth/types";

const Register = ({
	isAuthenticated,
}: { isAuthenticated: boolean }) => {
	const navigate = useNavigate();
	const [register, { isLoading }] = useRegisterMutation();
	const [registerFormData, setRegisterFormData] = useState<RegisterRequest>({
    	username: "",
    	email: "",
    	password: "",
	});

	return (
    	<div className="card">
        	{!isAuthenticated && (
            	<>
                	<h2>Register to our blogging platform</h2>
                	<form
                    	className="login"
                    	onSubmit={(e) => {
                        	e.preventDefault();
                        	try {
                            	register(registerFormData)
                                	.then((data) => {
                                    	if (data?.data?.ok) {
                                        	return navigate("/", {
                                            	replace: true,
                                        	});
                                    	}
                                    	alert("Invalid credentials!");
                                	})
                                	.catch(() =>
                                    	alert("Server error! Please file a bug report!"),
                                	);
                        	} catch (err) {
                            	alert(`Failed to register; got ${err}`);
                        	}
                    	}}
                	>
                    	<input
                        	id="username"
                        	placeholder="Username"
                        	type="text"
                        	value={registerFormData.username}
                        	onChange={(e) =>
                            	setRegisterFormData({
                                	...registerFormData,
                                	username: e.target.value,
                            	})
                        	}
                    	/>
                    	<input
                        	id="email"
                        	placeholder="Email"
                        	type="email"
                        	value={registerFormData.email}
                        	onChange={(e) =>
                            	setRegisterFormData({
                                	...registerFormData,
                                	email: e.target.value,
                            	})
                        	}
                    	/>
                    	<input
                        	id="password"
                        	type="password"
                        	placeholder="Password"
                        	value={registerFormData.password}
                        	onChange={(e) =>
                            	setRegisterFormData({
                                	...registerFormData,
                                	password: e.target.value,
                            	})
                        	}
                    	/>
                    	<button type="submit">
                        	{isLoading ? "Registering..." : "Register"}
                    	</button>
                	</form>
            	</>
        	)}
    	</div>
	);
};

export default Register;