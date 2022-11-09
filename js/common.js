//vue
const createApp = Vue.createApp;

{
	//common layout
	const scms = createApp({
		template: `
			<header class="header" :class="{'header--show-nav': showNav}">
				<div class="header__inner centreme">
					<div class="header__nav-toggle-title">
						<button class="header__nav-toggle" @click="toggleNav">
							<div></div>
							<div></div>
						</button>
						<div class="header__title">
							<a href="/">sanko</a>
						</div>
					</div>
					<button class="header__nav-close" @click="closeNav">
						<div>
							<div></div>
							<div></div>
						</div>
					</button>
					<nav class="header__nav">
						<ul>
							<li class="header__nav-home"><a href="/">home</a></li>
							<li><a href="/about/">about</a></li>
							<li><a href="/blog/">blog</a></li>
							<li><a href="/contact/">contact</a></li>
						</ul>
					</nav>
				</div>
			</header>
			<div id="content"></div>
			<hr/>
			<footer class="footer">
				<button v-if="false" class="toggle-outline" @click="toggleOutline">toggle outline</button>
				<div class="centreme">
					<p class="footer__copyright">&amp;copy; sanko 2022</p>
				</div>
			</footer>
		`,
		data() {
			return {
				showNav: false,
			};
		},
		methods: {
			toggleNav() {
				this.showNav = !this.showNav;
			},
			closeNav() {
				this.showNav = false;
			},
			toggleOutline() {
				document.body.classList.toggle("outline");
			},
		},
	}).mount("#page");
}