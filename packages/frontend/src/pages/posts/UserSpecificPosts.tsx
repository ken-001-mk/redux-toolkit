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

import { useLoaderData, useNavigate } from "react-router";
import { useGetBlogPostsByUsernameQuery } from "../../services/posts/blogSlice";
import DeletePostButton from "./DeletePostButton";

const UserSpecificPosts = ({
	isAuthenticated,
}: { isAuthenticated: boolean }) => {
	const navigate = useNavigate();
	const query: string | undefined = useLoaderData() as string | undefined;

	const { isLoading, data: posts } = useGetBlogPostsByUsernameQuery(
    	query as string,
	);

	if (isLoading)
    	return (
        	<div>
            	<h1>Loading {query}'s posts...</h1>
        	</div>
    	);
	console.log(posts);

	if (isLoading)
    	return (
        	<div>
            	<h1>Loading posts...</h1>
        	</div>
    	);

	return (
    	<div>
        	{posts?.map((post) => (
            	<article className="card" key={post.id}>
                	<h1>{post.title}</h1>
                	<h2>{post.authorUserName}</h2>
                	<p>{post.content}</p>
                	{isAuthenticated && (
                    	<div className="buttons">
                        	<button
                            	type="button"
                            	onClick={() =>
                                	navigate(
                                    	encodeURI(
                                        	`/posts/user/${post.authorUserName}/post/edit/${post.id}`,
                                    	),
                                	)
                            	}
                        	>
                            	Edit/Update Blog Post
                        	</button>
                        	<DeletePostButton post={post} />
                    	</div>
                	)}
            	</article>
        	))}
    	</div>
	);
};

export default UserSpecificPosts;