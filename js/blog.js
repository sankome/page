{
	const scms = createApp({
		template: `
			<div class="about">
				<section>
					<div class="centreme">
						<h1>My Blog</h1>
						<div v-if="fetching" class="fetching"/>
						<div v-else-if="contents && contents.length" class="blog" :class="{'blog--fetching': unfetching}">
							<ul class="contents">
								<li v-for="content in contents" class="contents__content">
									<h2 class="contents__title">
										<a :href="'/view/?post=' + content.slug">{{content.title}}</a>
									</h2>
									<p v-html="trimText(content.text)" class="contents__text"></p>
								</li>
							</ul>
							<div class="paging">
								<ul>
									<li><a @click.prevent="getContents(1)" href="?page=1">&lt;&lt;</a></li>
									<li v-for="i in pages">
										<span v-if="i == current">{{i}}</span>
										<a v-else @click.prevent="getContents(i)" :href="'?page=' + i">{{i}}</a>
									</li>
									<li><a @click.prevent="getContents(lastPage)" :href="'?page=' + lastPage">&gt;&gt;</a></li>
								</ul>
							</div>
						</div>
						<div v-else>
							<p>No posts yet!</p>
						</div>
					</div>
				</section>
			</div>
		`,
		data() {
			return {
				contents: null,
				current: null,
				pages: null,
				lastPage: null,
				
				fetching: true,
				unfetching: true,
			};
		},
		mounted() {
			this.getContents((new URLSearchParams(window.location.search)).get("page"));
		},
		methods: {
			async getContents(page) {
				if (page) this.unfetching = true;
				else {
					this.fetching = true;
					this.contents = null;
				}
				
				if (!page || page <= 0) page = 1;
				
				let getContents = await fetchGet(
					scmsUrl + "/contents/list",
					{limit: 5, offset: (page - 1) * 5, trim: 150},
				);
				this.contents = getContents.contents;
				
				let count = getContents.count;
				this.lastPage = 1 + Math.floor((count - 1) / 5);
				if (page > this.lastPage) page = this.lastPage;
				
				this.current = page;
				let prev = Math.max(1, page - 2);
				let next = Math.min(this.lastPage, page + 2);
				this.pages = {};
				for (let i = prev; i <= next; i++) this.pages[i] = i;
				
				if (this.current == 1) window.history.pushState({}, null, "?");
				else window.history.pushState({}, null, "?page=" + String(this.current));
				
				this.unfetching = false;
				this.fetching = false;
			},
			trimText(text) {
				text = text.trim();
				if (text.length >= 100) text += " ...";
				return text;
			},
		},
	}).mount("#content");
}