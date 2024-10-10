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

import type { ErrorResponse } from "../../services/error-types";
import { useDeletePostMutation } from "../../services/posts/blogSlice";
import type { BlogModel } from "../../services/posts/types";

const DeletePostButton = ({ post }: { post: BlogModel }) => {
	const [deletePost, { isLoading: isDeletingPost }] = useDeletePostMutation();
	return (
    	<>
        	<button
            	type="button"
            	onClick={() =>
                	deletePost({ id: post.id, title: post.title })
                    	.then((payload) => {
                        	if (
                            	payload.data?.ok !== undefined &&
                            	payload.data?.message !== undefined
                        	) {
                            	if (payload.data?.ok) {
                                	alert(payload.data?.message);
                                	return;
                            	}
                        	}
                        	const error = payload.error as ErrorResponse | undefined;
                        	alert(error?.message);
                    	})
                    	.catch((error) =>
                        	console.error(`Failed to delete with error: ${error}`),
                    	)
            	}
        	>
            	{isDeletingPost ? "Deleting..." : "Delete Post"}
        	</button>
    	</>
	);
};

export default DeletePostButton;