{
	const scms = createApp({
		template: `
			<div class="home fullscreen">
				<section class="intro">
					<div class="intro__inner centreme" id="home-intro"></div>
				</section>
				<section class="about">
					<div class="centreme" id="home-about"></div>
				</section>
				<hr/>
				<section class="projects">
					<div class="centreme" id="home-projects"></div>
				</section>
				<hr/>
				<section class="contact">
					<div class="centreme" id="home-contact"></div>
				</section>
			</div>
		`,
		mounted() {
			getHTML("home-intro", "#home-intro");
			getContent("home-about", "#home-about");
			getContent("home-projects", "#home-projects");
			getContent("home-contact", "#home-contact");
		},
	}).mount("#content");
}