const footerLinks = [
	{
		title: "EXPLORE",
		links: ["Contact Us", "Privacy Policy", "Rosetta Journal"],
	},
	{
		title: "INSTITUTION",
		links: ["IIT Ropar Main Site", "Terms of Service", "Lab Guidelines"],
	},
]

function Footer() {
	return (
		<footer className="border-t border-[#c4c7c7] bg-[#f8f9fa]">
			<div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-2 py-6 sm:px-2 md:grid-cols-3">
				<div>
					<h2 className="mb-3 font-display text-[18px] font-bold leading-tight text-black sm:text-[22px]">
						Rogāre
					</h2>
					<p className="max-w-xs text-[13px] leading-6 text-[#444748]">
						A crowdsourced FAQ solution portal developed by the VINS interns of VLED, IIT Ropar. Summer 2026.
					</p>
				</div>

				{footerLinks.map((section) => (
					<div key={section.title}>
						<p className="mb-4 text-[12px] font-bold leading-none text-[#444748]">
							{section.title}
						</p>
						<ul className="space-y-2">
							{section.links.map((link) => (
								<li key={link}>
									<a
										className="text-[14px] leading-6 text-[#444748] transition hover:text-black"
										href="#top"
									>
										{link}
									</a>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
			<div className="mx-auto max-w-[1200px] border-t border-[#c4c7c7]/30 px-4 py-6 text-center sm:px-4">
				<p className="text-[12px] leading-6 text-[#444748]">
					© 2026 — {__PROJECT_OWNER__ || 'Vicharanashala Lab for Education of Design (VLED), Indian Institute of Technology Ropar'}. All rights reserved.
				</p>
			</div>
		</footer>
	)
}

export default Footer
