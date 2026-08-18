"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/trpc";

type AuthMode = "sign-in" | "sign-up";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userQuery = trpc.auth.getLoggedInUserInfo.useQuery(undefined, { retry: false });
  const goToForms = () => router.replace("/forms");
  const signInMutation = trpc.auth.signInUserWithEmailAndPassword.useMutation({ onSuccess: goToForms });
  const signUpMutation = trpc.auth.createUserWithEmailAndPassword.useMutation({ onSuccess: goToForms });
  const isSigningUp = mode === "sign-up";
  const activeMutation = isSigningUp ? signUpMutation : signInMutation;
  const isSubmitting = signInMutation.isPending || signUpMutation.isPending;

  useEffect(() => { if (userQuery.isSuccess) goToForms(); }, [userQuery.isSuccess]);

  function changeMode(nextMode: AuthMode) { setMode(nextMode); signInMutation.reset(); signUpMutation.reset(); }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSigningUp) signUpMutation.mutate({ name: name.trim(), email: email.trim(), password });
    else signInMutation.mutate({ email: email.trim(), password });
  }

  return <main className="auth-page">
    <section className="auth-intro" aria-label="About Formroom">
      <div className="auth-brand"><span className="auth-brand-mark" aria-hidden="true">F</span><span>Formroom</span></div>
      <div className="auth-intro-copy"><p className="auth-kicker">A calm place to build</p><h1>Good questions deserve a clear room.</h1><p>Create thoughtful forms, keep every response in view, and turn feedback into the next useful decision.</p></div>
      <div className="auth-note"><span className="auth-note-dot" aria-hidden="true" />Built for your next conversation</div>
    </section>
    <section className="auth-panel" aria-labelledby="auth-title">
      <div className="auth-card">
        <div className="auth-card-heading"><p className="auth-eyebrow">Your workspace</p><h2 id="auth-title">{isSigningUp ? "Start a new workspace" : "Welcome back"}</h2><p>{isSigningUp ? "Set up your account and begin with a blank canvas." : "Sign in to pick up where your forms left off."}</p></div>
        <div className="auth-switch" role="tablist" aria-label="Authentication options"><button type="button" role="tab" aria-selected={!isSigningUp} className={!isSigningUp ? "is-active" : undefined} onClick={() => changeMode("sign-in")}>Sign in</button><button type="button" role="tab" aria-selected={isSigningUp} className={isSigningUp ? "is-active" : undefined} onClick={() => changeMode("sign-up")}>Create account</button></div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isSigningUp && <label><span>Full name</span><input className="form-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Alex Morgan" autoComplete="name" required /></label>}
          <label><span>Email address</span><input className="form-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" autoComplete="email" required /></label>
          <label><span>Password</span><input className="form-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isSigningUp ? "At least 6 characters" : "Enter your password"} autoComplete={isSigningUp ? "new-password" : "current-password"} minLength={isSigningUp ? 6 : undefined} required /></label>
          {activeMutation.error && <p className="auth-error" role="alert">{activeMutation.error.message}</p>}
          <button className="btn-primary auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Opening your workspace…" : isSigningUp ? "Create workspace" : "Sign in to Formroom"}<span aria-hidden="true">→</span></button>
        </form>
        <p className="auth-footer">{isSigningUp ? "Already have an account?" : "New to Formroom?"} <button type="button" onClick={() => changeMode(isSigningUp ? "sign-in" : "sign-up")}>{isSigningUp ? "Sign in" : "Create an account"}</button></p>
      </div>
    </section>
  </main>;
}
