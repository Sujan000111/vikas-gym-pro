import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthSection() {
  return (
    <section id="auth" className="py-24 bg-[hsl(var(--bg-surface))] border-y border-[hsl(var(--border-color))]">
      <div className="container-vg">
        <div className="text-center mb-12">
          <div className="overline mb-3">Get Started</div>
          <h2 className="font-display text-5xl md:text-6xl">JOIN OR <span className="text-[hsl(var(--red))]">RETURN</span></h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <LoginForm />
          <RegisterForm />
        </div>
      </div>
    </section>
  );
}
