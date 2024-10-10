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

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterResponse {
	message: string,
	ok?: boolean
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
}

export interface User {
	id: number;
	username: string;
	email: string;
	role: string;
}

export type AuthState = {
	user: User | null;
	token: string | null;
};

export interface UserResponse {
	token: string;
	username: string;
	userId: number;
	email: string;
	role: string;
	status: number;
	ok: boolean;
}

export interface LogOutResponse {
	message: string;
	ok?: boolean;
}