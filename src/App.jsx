const Section = ({ id, title, children, className = '' }) => (
  <section id={id} className={`py-10 border-b border-gray-200 last:border-b-0 ${className}`}>
    <h2 className="font-sans text-xl font-semibold uppercase tracking-widest text-gray-600 mb-6 pb-2 border-b border-gray-200">
      {title}
    </h2>
    {children}
  </section>
)

const SubsectionTitle = ({ children }) => (
  <h3 className="font-sans text-base font-semibold uppercase tracking-wide text-gray-600 mt-5 mb-2.5 first:mt-0">
    {children}
  </h3>
)

const Entry = ({ role, company, date, location, desc, bullets, meta }) => (
  <article className="pb-10 mb-10 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0">
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-1">
      <h3 className="font-sans text-[1.15rem] font-semibold m-0">{role}</h3>
      <span className="font-medium text-black">{company}</span>
      <span className="ml-auto text-sm text-gray-600 tabular-nums">{date}</span>
    </div>
    {location && <p className="text-sm text-gray-600 mb-2">{location}</p>}
    {desc && <p className="mb-2.5">{desc}</p>}
    {bullets && (
      <ul className="my-2 pl-5 space-y-1.5">
        {bullets.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    )}
    {meta && <p className="text-sm text-gray-600 mt-3">{meta}</p>}
  </article>
)

const IconLink = ({ href, label, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    title={label}
    className="inline-flex items-center justify-center w-10 h-10 rounded text-accent hover:text-black hover:bg-accent/10 transition-colors"
  >
    {children}
  </a>
)

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const GoogleScholarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 3L1 9l4 2.18v2.81c0 .73.4 1.39 1 1.73l5 2.73 5-2.73c.6-.34 1-.99 1-1.73v-2.81l4-2.18-11-6z"/>
  </svg>
)

export default function App() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-white/92 backdrop-blur-md border-b border-gray-200">
        <nav className="max-w-prose mx-auto px-6 py-6 flex flex-wrap justify-center gap-4">
          {['About', 'Experience', 'Research', 'Publications', 'Contact'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-sm font-medium uppercase tracking-widest text-gray-600 hover:text-accent transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main className="max-w-prose mx-auto px-6 pb-10">
        <section id="hero" className="py-12 text-center border-b border-gray-200">
          <h1 className="font-sans text-3xl md:text-4xl font-bold tracking-tight text-black mb-1.5">
            Jasper Kyle Catapang
          </h1>
          <p className="text-lg text-gray-600 mb-1">NLP & AI Research · Explainable AI · LLM Post-Training</p>
          <p className="text-[0.95rem] text-gray-600 italic">Tokyo, Japan · PhD Candidate, Tokyo University of Foreign Studies</p>
        </section>

        <Section id="about" title="About">
          <div className="max-w-[38rem] space-y-4">
            <p>
              With over six years of experience in NLP and AI, I specialize in <strong>explainable AI (XAI)</strong>, <strong>LLM post-training</strong>, and <strong>agentic evaluation</strong>—most notably leading the fine-tuning of the top-ranked GodziLLa-2 model. Grounded in computer science and applied linguistics, my work prioritizes ethical alignment and model transparency—critical assets for developing safe, trustworthy, and culturally aware multimodal agents.
            </p>
            <p>
              Currently pursuing a PhD at the Tokyo University of Foreign Studies, I balance advanced research with cross-functional technical leadership, bridging the gap between responsible AI principles and robust, real-world product deployment.
            </p>
          </div>
        </Section>

        <Section id="experience" title="Experience">
          <Entry
            role="AI Agent Development Lead"
            company="Money Forward"
            date="Jan 2026 – Present"
            location="Tokyo, Japan"
            desc="I lead the design, development, and delivery of internal AI modules at Money Forward, overseeing cross-team execution while ensuring alignment among product intent, technical architecture, and operational constraints."
            bullets={[
              'Expanded scope from lead AI decision quality to end-to-end ownership of internal products’ AI agent development and delivery across multiple initiatives.',
              'Work closely with product managers, engineering leads, platform teams, and senior stakeholders to define agent roadmaps, prioritize features, and coordinate releases.',
              '<strong>MyPage Agent:</strong> Lead cross-functional execution of high-impact AI agent initiatives.',
              '<strong>Accounting Agent:</strong> Development and delivery.',
            ]}
            meta="Python, Azure, A2A, MCP, PyTorch, Cursor, GPT-5 · Japanese, English"
          />
          <Entry
            role="AI Evaluation Lead"
            company="Money Forward"
            date="Sep 2025 – Dec 2025"
            location="Tokyo, Japan"
            desc="Led AI quality enforcement and research for the Expense AI Agent, ensuring robust schema design, reliable rule retrieval, and agent performance benchmarking."
            bullets={[
              '<strong>Valid8R (LLM Evaluation Suite):</strong> Architected a scalable pipeline to benchmark agent performance; automated regression testing reduced iteration time for model alignment experiments by 75%; reduced manual QA by ~40%.',
              '<strong>Expense AI Rulebook:</strong> Spearheaded schema development and quality evaluation pipelines; achieved 45% improvement in rule retrieval precision.',
              'Screened ~10 candidates for Principal AI QA Engineer roles.',
            ]}
            meta="Python, Azure, A2A, MCP, PyTorch, Cursor, GPT-5 · Japanese, English"
          />
          <Entry
            role="Senior AI Engineer"
            company="Money Forward"
            date="Aug 2024 – Aug 2025"
            location="Tokyo, Japan"
            desc="Researched and developed components and modules for the internal AI assistant project, powered by state-of-the-art generative AI technologies."
            bullets={[
              '<strong>AI Agent Platform:</strong> Developed modular A2A hybrid architecture; reduced MTTR for internal AI assistant tasks by 60%.',
              '<strong>SQL Generator:</strong> Reduced engineering toil by 40% and boosted query generation speed by 5x via RAG-like architecture.',
              '<strong>GraphQL Generator:</strong> Scaled automation to cover 150% more production database schemas; handled over 70% of common query types.',
            ]}
            meta="Python, Azure, Cursor, LangChain, GPT-5, GPT-4o, Docker, Ruby, Kotlin, Gradle, Redis"
          />
          <Entry
            role="NLP Lead"
            company="Maya Philippines"
            date="Apr 2023 – Jul 2024"
            location="Mandaluyong City, Philippines"
            desc="Researched and developed ethical NLP technologies for the Maya fintech app; supervised the Chatbot (NLP) team in the Data Science department."
            bullets={[
              '<strong>GodziLLa-2:</strong> Achieved rank #2 on the Hugging Face Open LLM leaderboard with local media coverage; surpassed GPT-3.5 and GPT-4 on a truthfulness benchmark.',
              '<strong>Mayari:</strong> Developed and deployed an LLM-powered customer service agent with RAG; reduced customer query resolution time by 50% and stakeholder promoter score 1.8x.',
              'Supervised a cross-functional NLP team of 4 engineers.',
            ]}
            meta="Python, PyTorch, Hugging Face, LangChain, spaCy, LanceDB, AWS · Filipino, English"
          />
          <Entry
            role="Lead Machine Learning Engineer"
            company="Docquity"
            date="May 2022 – Nov 2022"
            location="Bonifacio Global City, Philippines"
            desc="Researched and developed ethical ML, NLP, and biology-inspired technologies for the SEA region; led NLP projects and prompt engineering for LLMs (e.g. GPT-3)."
            bullets={[
              '<strong>Actionome:</strong> User behavior analysis through genome-like processing of in-app actions; shortened delivery of user behavior reports from 1 week to less than an hour.',
            ]}
            meta="Python, GPT-3, PyTorch, Hugging Face, AWS, Amazon Redshift, Whisper · English, Indonesian, Malaysian, Vietnamese, Thai"
          />
          <Entry
            role="Machine Learning Lead"
            company="Augmented Intelligence Pros"
            date="Feb 2021 – Apr 2022"
            location="Silicon Valley, CA, USA"
            bullets={[
              '<strong>Chat Deviation Handler:</strong> Transformer-based handling of conversation deviation via PPO reinforcement learning; lessened unhandled user message cases by 75%.',
            ]}
            meta="Python, PyTorch, TensorFlow, Hugging Face, wav2vec, spaCy · Chinese, English"
          />
          <Entry
            role="Machine Learning Lead"
            company="Alfafusion"
            date="Jul 2020 – Jan 2021"
            location="Quezon City, Philippines"
            desc="Managed all operations in AI, NLP, and analytics; pioneered the company’s first AI Lab; recruited and mentored junior engineers."
            meta="Python, RasaNLU, Scikit-Learn, Statsmodels, spaCy, Flask · Filipino, English"
          />
          <Entry
            role="AI Engineer"
            company="Monster Group (UK)"
            date="Aug 2020 – Dec 2020"
            location="York, UK"
            desc="Developed tools to improve SEO and to reverse engineer search result algorithms through deep learning and NLP."
            meta="Python, Scikit-Learn, imblearn, Beautiful Soup, SciPy, JavaScript"
          />
          <Entry
            role="Analytics Lecturer"
            company="De La Salle–College of Saint Benilde"
            date="Aug 2021 – May 2024"
            location="Manila, Philippines"
            desc="Advised and paneled for undergraduate theses and defenses under the Business Intelligence and Analytics Programme. Taught classes in data analytics and AI ethics."
          />
        </Section>

        <Section id="education" title="Education">
          <Entry
            role="Doctor of Philosophy, Global Studies"
            company="Tokyo University of Foreign Studies"
            date="Oct 2024 – Present"
            location="Tokyo, Japan"
            desc="Language and Culture Program. Dissertation: Lexical innovations in Southeast Asian Englishes: A mixed methods analysis of social media."
          />
          <Entry
            role="Master of Arts, Applied Linguistics"
            company="University of Birmingham"
            date="Dec 2020 – Jul 2023"
            location="Birmingham, United Kingdom"
            desc="Student Representative 2021/2022. Dissertation: A cross-cultural corpus analysis of honorifics in spoken and written text corpora of American, British, Philippine, and Singapore Englishes."
          />
          <Entry
            role="Bachelor of Science, Computer Science"
            company="University of the Philippines"
            date="Aug 2015 – Jan 2020"
            location="Manila, Philippines"
            desc="Thesis: SmartRetail: A bilingual retail chatbot using support vector machine."
          />
          <p className="text-sm text-gray-600 mt-4">ALPS 2021: Advanced Language Processing School, Université Grenoble Alpes, L’Escandille, France (Jan 2021).</p>
        </Section>

        <Section id="skills" title="Technical Skills">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { title: 'LLM & Post-Training', text: 'SFT, RLHF, Model Alignment, Prompt Engineering, RAG, Agentic AI, Hallucination Reduction, Evaluation Pipeline.' },
              { title: 'Frameworks & Tools', text: 'PyTorch, LangChain, HuggingFace Transformers, Azure OpenAI, WandB, Docker, Cursor.' },
              { title: 'Languages', text: 'Python, SQL, JavaScript, C++.' },
            ].map(({ title, text }) => (
              <div key={title} className="p-4 pl-5 bg-surface rounded border-l-4 border-accent">
                <h4 className="font-sans text-sm font-semibold uppercase tracking-wide text-accent m-0 mb-1.5">{title}</h4>
                <p className="text-[0.95rem] m-0">{text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="research" title="Research & Consulting">
          <Entry
            role="NLI Consultant"
            company="DOST-ASTI"
            date="Jun 2022 – Dec 2022"
            location="Quezon City, Philippines"
            desc="Advised on semantic parsing, prompt engineering, and machine translation for a natural language querying engine for government use. Technologies: GPT-3, Python."
          />
          <Entry
            role="Research Assistant"
            company="University of the Philippines"
            date="Sep 2020 – Apr 2021"
            location="Manila, Philippines"
            desc="Advised and assisted on NLP code-switching research about COVID-19 misinformation in the Philippines. Technologies: Python, scikit-learn."
          />
          <div className="p-5 mt-4 rounded border-l-4 border-accent bg-accent-soft">
            <h4 className="font-sans text-base font-semibold m-0 mb-2">UP ISC Research Grant 2025–2026</h4>
            <p className="text-[0.95rem] m-0">
              UP Intelligent Systems Center, Manila. Research Project: Design, Development, and Evaluation of a Filipino Conversational Agent for the Self-management of Type 2 Diabetes Mellitus. Co-investigator. Funding: PHP 8,360,056 (≈ JPY 22M).
            </p>
          </div>
        </Section>

        <Section id="publications" title="Publications">
          <SubsectionTitle>Journal Articles</SubsectionTitle>
          <ul className="pl-5 space-y-2.5 text-[0.95rem]">
            <li>Catapang, J.K. (2026). Building the Ethical AI Framework of the Future: From Philosophy to Practice. <em>AI and Ethics</em>, 6, 150. DOI: 10.1007/s43681-026-01003-8</li>
            <li>Catapang, J.K., Borlongan, A.M., & Go, M.A.C. (2025). Language, Migration, and ChatGPT. <em>Journal of Modern Languages</em>, 35(2), 167–189.</li>
            <li>Catapang, J.K. (2025). Explaining Bias in Internal Representations of Large Language Models via Concept Activation Vectors. <em>NLDB 2025</em>. LNCS, vol 15836. Springer.</li>
            <li>Isip-Tan, I.T., Cleofas, J.V., Solano, G.A., Pillejera, J.G.A., Catapang, J.K. (2023). Interdisciplinary Approach to Identify and Characterize COVID-19 Misinformation on Twitter. <em>JMIR Formative Research</em>, 7, e41134.</li>
          </ul>
          <SubsectionTitle>Conference Proceedings (selected)</SubsectionTitle>
          <ul className="pl-5 space-y-2.5 text-[0.95rem]">
            <li>Catapang, J.K. (Dec 2024). Can we repurpose multiple-choice question-answering models to rerank retrieved documents? <em>PACLIC 38</em>. Tokyo. ACL.</li>
            <li>Catapang, J.K., & Visperas, M. (Dec 2023). Emotion-based Morality in Tagalog and English Scenarios (EMoTES-3K). <em>NLP4DH + ComputEL 8</em>. Tokyo. ACL.</li>
            <li>Catapang, J.K., Santiago, D.E., & Isip-Tan, I.T. (Sep 2023). Improving detection of diabetic retinopathy in low-resolution images via latent diffusion. <em>MIPR 2023</em>. Singapore. IEEE. Acceptance rate: 19.5%.</li>
            <li>Catapang, J.K. (Nov 2022). HEAT: Fast Approximation of Dot Product Self-attention for Transformers. <em>ISCMI 2022</em>. Toronto. IEEE.</li>
          </ul>
          <SubsectionTitle>Conference Presentations & Lectures</SubsectionTitle>
          <ul className="pl-5 space-y-1.5 text-sm">
            <li>Stance and Register Variation in Philippine English Journalism. JAFAE 56th National Conference. Hiroshima, Jan 2026.</li>
            <li>Explaining Lexical Innovations of Southeast Asian Englishes in Social Media. JAFAE 55th National Conference. Chiba, Jun 2025.</li>
            <li>Transformers for Natural Language Processing. Tokyo University of Foreign Studies, Feb 2026.</li>
            <li>Do the Models Hear Us? Artificial Intelligence and the (In)visibility of Migrant Voices. 2nd International Conference on Migration Linguistics. UST, Philippines, Dec 2025.</li>
            <li>Interpretability on how large language models process information. De La Salle University, Jul 2025.</li>
          </ul>
        </Section>

        <Section id="services" title="Professional Services">
          <p className="mb-3"><strong>Programme committee:</strong> PACLIC 38 (2024); LoResMT @ COLING 2022, MT Summit 2021, AACL-IJCLNP 2020.</p>
          <p className="mb-3"><strong>Journal reviews:</strong> Language Resources and Evaluation (Springer); Computers in Biology and Medicine (Elsevier); IEEE Access; IEEE TNNLS.</p>
          <p><strong>Conference reviews:</strong> PACLIC 38, AMTA 2024, LREC-Coling 2024, Oriental COCOSDA, LoResMT, PCSC, WCTP, CSP-ICE, among others.</p>
        </Section>

        <Section id="media" title="Media & Affiliations">
          <ul className="pl-5 space-y-2 mb-4">
            <li>Breaking the illusion of language data scarcity in the Philippines. <em>The Manila Times</em>, Nov 10, 2024.</li>
            <li>Maya PH’s open-source LLM, Godzilla 2, surpasses ChatGPT in truthfulness. <em>Rappler</em>, Sep 6, 2023.</li>
          </ul>
          <p><strong>Affiliations:</strong> NLPinas (Founder, Aug 2020 – Present); IEEE (Member, Jul 2023 – Present); ACL (Member, Oct 2020 – Present); Linguistic Society of the Philippines; Japan Association for Asian Englishes (Jun 2025 – Present).</p>
        </Section>

        <Section id="certificates" title="Certificates & Qualifications">
          <p className="mb-3">Machine Learning (Stanford, 2020); Outbreaks and Epidemics (Johns Hopkins, 2020); Measuring Disease in Epidemiology (Imperial College London, 2020).</p>
          <p>Japanese Highly Skilled Professional (i)(b) Visa Holder; score above 80 points on the HSP visa evaluation.</p>
        </Section>

        <Section id="contact" title="Contact" className="pb-10">
          <div className="flex flex-wrap gap-4 mb-2">
            <a href="mailto:jasperkylecatapang@gmail.com" className="font-medium text-accent hover:border-b hover:border-accent transition-colors">jasperkylecatapang@gmail.com</a>
            <a href="tel:+817083683609" className="font-medium text-accent hover:border-b hover:border-accent transition-colors">+81 70 8368 3609</a>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            <IconLink href="https://www.linkedin.com/in/jcatapang/" label="LinkedIn">
              <LinkedInIcon />
            </IconLink>
            <IconLink href="https://www.facebook.com/jazbrave/" label="Facebook">
              <FacebookIcon />
            </IconLink>
            <IconLink href="https://scholar.google.com/citations?user=yNIX3HQAAAAJ" label="Google Scholar">
              <GoogleScholarIcon />
            </IconLink>
          </div>
          <p className="text-[0.95rem] text-gray-600 m-0">Suginami-ku, Tokyo-to, Japan</p>
        </Section>
      </main>

      <footer className="max-w-prose mx-auto px-6 py-6 border-t border-gray-200 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Jasper Kyle Catapang
      </footer>
    </>
  )
}
