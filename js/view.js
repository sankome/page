{
	const scms = createApp({
		template: `
			<div class="view">
				<section>
					<div v-if="fetchingContent" class="centreme">
						<h1 class="fetching"></h1>
						<div class="fetching"/>
					</div>
					<div v-else-if="content" class="centreme">
						<h1>{{content.title}}</h1>
						<div v-html="undelta(content.content)"></div>
					</div>
					<div v-else class="centreme">
						<h1>No post!</h1>
						<p>Post not found!</p>
					</div>
				</section>
				<hr v-if="content"/>
				<section v-if="content">
					<div class="centreme">
						<div v-if="fetchingComment" class="fetching"/>
						<div v-else-if="comments.length" class="comments" :class="{'comments--fetching': unfetchingComment}">
							<ul v-for="comment in comments">
								<li class="comments__comment" @click="toggleDelete(comment)">
									<p class="comments__name">{{comment.name}}</p>
									<p class="comments__text" v-html="comment.comment"></p>
									<button v-if="comment.showDelete" @click.prevent="deleteComment(comment.id)">Delete comment</button>
								</li>
							</ul>
							<div class="paging">
								<ul>
									<li><a @click.prevent="getComments(1)" href="?page=1">&lt;&lt;</a></li>
									<li v-for="i in pages">
										<span v-if="i == current">{{i}}</span>
										<a v-else @click.prevent="getComments(i)" :href="'?page=' + i">{{i}}</a>
									</li>
									<li><a @click.prevent="getComments(lastPage)" :href="'?page=' + lastPage">&gt;&gt;</a></li>
								</ul>
							</div>
						</div>
						<p v-else>No comments yet!</p>
						<form v-if="!fetchingComment" @submit.prevent="addComment()" class="add-comment" :class="{'add-comment--adding': adding}">
							<p>
								<label for="name">Name</label>
								<input type="text" v-model.lazy="name" name="name"/>
							</p>
							<p>
								<label for="password">Password</label>
								<input type="text" v-model.lazy="password" name="password"/>
							</p>
							<p>
								<label for="comment">Comment</label>
								<textarea v-model.lazy="comment" name="comment"/>
							</p>
							<p><input type="submit" value="Add comment"></p>
						</form>
					</div>
				</section>
			</div>
		`,
		data() {
			return {
				id: 0,
				slug: null,
				content: null,
				fetchingContent: true,

				comments: null,
				name: null,
				password: null,
				comment: null,
				adding: false,
				fetchingComment: true,
				unfetchingComment: false,
				
				current: null,
				pages: null,
				lastPage: null,
			};
		},
		async mounted() {
			let params = new URLSearchParams(window.location.search);
			this.id = parseInt(params.get("id"), 10);
			this.slug = params.get("post");
			
			let content;
			if (this.id) fetchGet(scmsUrl + "/contents/view", {id: this.id})
				.then(content => {
					this.content = content.content;
					this.fetchingContent = false;
					document.title = content.content.title + " - sanko";
					this.getComments();
				});
			else if (this.slug) fetchGet(scmsUrl + "/contents/view", {slug: this.slug})
				.then(content => {
					this.content = content.content;
					this.fetchingContent = false;
					document.title = content.content.title + " - sanko";
					this.getComments();
				});
			else {
				this.fetchingContent = false;
			}
		},
		methods: {
			undelta: undelta,
			async getComments(page) {
				this.unfetchingComment = true;
				
				if (!page || page <= 0) page = 1;
				
				let comments;
				if (this.id) comments = await fetchGet(
					scmsUrl + "/contents/comments/",
					{
						id: this.id,
						limit: 5,
						offset: (page - 1) * 5,
					}
				);
				else if (this.slug) comments = await fetchGet(
					scmsUrl + "/contents/comments/",
					{
						slug: this.slug,
						limit: 5,
						offset: (page - 1) * 5,
					}
				);
				
				this.comments = comments.comments || [];
				
				let count = comments.count;
				this.lastPage = 1 + Math.floor((count - 1) / 5);
				if (page > this.lastPage) page = this.lastPage;
				
				this.current = page;
				let prev = Math.max(1, page - 2);
				let next = Math.min(this.lastPage, page + 2);
				this.pages = {};
				for (let i = prev; i <= next; i++) this.pages[i] = i;
				
				this.fetchingComment = false;
				this.unfetchingComment = false;
			},
			async addComment() {
				if (this.adding) return;
				this.adding = true;
				let added = await fetchPost(
					scmsUrl + "/comments/add/",
					{
						content: this.content.id,
						name: this.name,
						password: this.password,
						comment: this.comment,
					}
				);
				this.getComments();
				if (added.added) {
					this.name = null;
					this.password = null;
					this.comment = null;
				}
				this.adding = false;
			},
			async deleteComment(commentId) {
				this.unfetchingComment = true;
				
				let password = prompt("password?");
				
				let deleted = await fetchDelete(
					scmsUrl + "/comments/remove",
					{
						id: commentId,
						password: password,
					}
				);
				if (deleted.removed) this.getComments(this.current);
				else this.unfetchingComment = false;
			},
			toggleDelete(comment) {
				comment.showDelete = !comment.showDelete;
			},
		},
	}).mount("#content");
}