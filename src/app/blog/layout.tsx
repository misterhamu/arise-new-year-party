export default function BlogLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col items-start justify-start gap-2">
			<div className="inline-block max-w-lg text-left justify-start">
				{children}
			</div>
		</section>
	);
}
