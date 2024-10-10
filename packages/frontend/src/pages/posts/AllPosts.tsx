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

import { useGetAllBlogPostsQuery } from "../../services/posts/blogSlice";

/**
 * Loads all posts and rerenders on update.
 * @returns JSX.Element
 */
const AllPost = () => {
	const { data: allBlogs, isLoading } = useGetAllBlogPostsQuery();

	if (isLoading)
    	return (
        	<div>
            	<h1>Loading all posts...</h1>
        	</div>
    	);

	return (
    	<div>
        	{allBlogs?.map((blog) => (
            	<article className={"card"} key={blog.id}>
                	<h1>
                    	{blog.title} by {blog.authorUserName}
                	</h1>
                	<div className={"time"}>
                    	<time dateTime={blog.createdAt.toString()}>
                        	Created on: {blog.createdAt.toString()}
                    	</time>
                    	<time dateTime={blog.updatedAt.toString()}>
                        	Last updated on: {blog.updatedAt.toString()}
                    	</time>
                	</div>
                	<p>{blog.content}</p>
            	</article>
        	))}
    	</div>
	);
};

export default AllPost;