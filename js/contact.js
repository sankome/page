{
	const scms = createApp({
		template: `
			<div class="about">
				<section>
					<div class="centreme">
						<h1>Contact Me</h1>
						<div id="contact"></div>
					</div>
				</section>
			</div>
		`,
		mounted() {
			getContent("contact", "#contact");
		},
	}).mount("#content");
}