{
	const scms = createApp({
		template: `
			<div class="about">
				<section>
					<div class="centreme">
						<h1>About Me</h1>
						<div id="about"></div>
					</div>
				</section>
			</div>
		`,
		mounted() {
			getContent("about", "#about");
		},
	}).mount("#content");
}