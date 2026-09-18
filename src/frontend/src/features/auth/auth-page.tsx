import { LoginForm } from "#/components/login-form";
import { StateBoundary } from "#/components/shared/state-boundary";
import { SignupForm } from "#/components/signup-form";
export function AuthPage({ signup = false }: { signup?: boolean }) {
	return (
		<div className="page-wrap py-6 md:py-10">
			<div className="grid overflow-hidden rounded-xl bg-white md:min-h-[650px] md:grid-cols-2">
				<div className="relative hidden md:block">
					<img
						src="/images/football.png"
						alt="Een rustig sportveld in de buitenlucht"
						width={1672}
						height={941}
						className="absolute h-full w-full object-cover object-[65%_50%]"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
					<div className="absolute inset-x-0 bottom-0 p-10 text-white">
						<h2 className="text-4xl leading-tight font-bold">
							Reserveer je plek.
							<br />
							Sport buiten.
						</h2>
						<p className="mt-4 text-lg">Voetbal, tennis en basketbal.</p>
					</div>
				</div>
				<div className="flex items-center justify-center p-5 py-6 md:p-10 lg:p-14">
					<div className="w-full max-w-[420px]">
						<StateBoundary>
							{signup ? <SignupForm /> : <LoginForm />}
						</StateBoundary>
					</div>
				</div>
			</div>
		</div>
	);
}
