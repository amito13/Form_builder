import Link from "next/link";
import { ArrowUpRight, Check, FileText, Link2, ListChecks, SlidersHorizontal } from "lucide-react";
import styles from "./landing.module.css";

const features = [
  { icon: SlidersHorizontal, title: "Your questions, your way.", description: "Build with text, email, number, yes/no, and password fields. Add descriptions, placeholders, and required questions." },
  { icon: FileText, title: "See it come together.", description: "Give your form a title, shape each question, and preview the experience before you share it." },
  { icon: Link2, title: "One link. An open door.", description: "Copy your form’s share link and send it to your audience. Anyone with the link can respond without an account." },
  { icon: ListChecks, title: "Every answer has a place.", description: "Keep your forms organized in one workspace and review submissions alongside the questions you asked." },
];
const steps = [
  { title: "Make it yours", description: "Start with a title and add the questions that matter." },
  { title: "Send it out", description: "Share your form’s link wherever your audience is." },
  { title: "Bring answers together", description: "Open your responses and see what people have to say." },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Formroom home"><span className={styles.mark} aria-hidden="true">F</span>Formroom</Link>
        <nav className={styles.nav} aria-label="Main navigation">
          <a className={styles.sectionLink} href="#features">Features</a>
          <a className={styles.sectionLink} href="#how-it-works">How it works</a>
          <Link href="/auth" className={styles.signIn}>Sign in <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </nav>
      </header>
      <main id="main">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true" />A place for every question</p>
            <h1 id="hero-title">Good questions.<br />Clear answers.<br /><span>Room for more.</span></h1>
            <p className={styles.intro}>From your first question to your next useful insight. Create forms, share them with anyone, and keep every response together in Formroom.</p>
            <div className={styles.actions}><Link href="/auth" className={styles.primary}>Get started <ArrowUpRight size={19} aria-hidden="true" /></Link><a href="#features" className={styles.secondary}>Explore the features <span aria-hidden="true">↓</span></a></div>
            <p className={styles.heroNote}>Build. Share. Listen. All in one room.</p>
          </div>
          <div className={styles.showcase} aria-label="Example Formroom form preview">
            <div className={styles.previewTop}><span><span className={styles.smallMark} aria-hidden="true">F</span> Your next conversation</span><span className={styles.previewLabel}>FORM PREVIEW</span></div>
            <div className={styles.paper}>
              <p className={styles.paperEyebrow}>LET’S HEAR FROM YOU</p>
              <h2>A little feedback.<br />A better next step.</h2>
              <p>Help us make the next experience even better.</p>
              <div className={styles.sampleField}><span>What should we call you? *</span><div>Alex Morgan</div></div>
              <div className={styles.sampleField}><span>Your email address *</span><div>alex@example.com</div></div>
              <div className={styles.sampleField}><span>Would you join us again?</span><div className={styles.sampleChoice}><span><Check size={14} aria-hidden="true" /> Yes, absolutely</span><span>No</span></div></div>
              <div className={styles.sampleSubmit}>Submit response <ArrowUpRight size={17} aria-hidden="true" /></div>
              <p className={styles.paperFooter}>Made with Formroom · Example form</p>
            </div>
            <div className={styles.previewBottom}><Check size={15} aria-hidden="true" /><span>A simple form. A meaningful conversation.</span></div>
          </div>
        </section>
        <section id="features" className={styles.features} aria-labelledby="features-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>THOUGHTFUL TOOLS, LESS FRICTION</p><h2 id="features-title">Everything your questions<br />need to find their answers.</h2><p>A focused workspace for collecting feedback, gathering details, and getting to know your audience.</p></div>
          <div className={styles.featureGrid}>{features.map(({ icon: Icon, title, description }, index) => <article className={styles.feature} key={title}><div className={styles.featureTop}><Icon size={23} strokeWidth={1.5} aria-hidden="true" /><span>0{index + 1}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div>
        </section>
        <section id="how-it-works" className={styles.how} aria-labelledby="how-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>FROM AN IDEA TO AN ANSWER</p><h2 id="how-title">Three steps. One clear flow.</h2></div>
          <ol className={styles.steps}>{steps.map((step, index) => <li key={step.title}><span className={styles.stepNumber}>0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
        </section>
        <section className={styles.cta} aria-labelledby="cta-title"><p className={styles.eyebrow}>YOUR NEXT QUESTION STARTS HERE</p><h2 id="cta-title">Make room for<br />better conversations.</h2><p>Your audience has something to say. Give them a place to say it.</p><Link href="/auth" className={styles.primary}>Get started <ArrowUpRight size={19} aria-hidden="true" /></Link></section>
      </main>
      <footer className={styles.footer}><Link href="/" className={styles.brand}><span className={styles.mark} aria-hidden="true">F</span>Formroom</Link><p>A place for every question.</p><Link href="/auth">Get started <span aria-hidden="true">↗</span></Link></footer>
    </div>
  );
}
