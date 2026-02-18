import { useState, useEffect } from 'react'

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

const MediaCard = ({ title, url, outlet, domain, date, credit }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="block p-4 rounded border border-gray-200 bg-white hover:border-accent hover:bg-accent/5 transition-colors group"
  >
    <div className="flex items-center gap-2 mb-2">
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
        alt=""
        width={20}
        height={20}
        className="w-5 h-5 shrink-0"
      />
      <span className="text-sm font-medium text-gray-600">{outlet}</span>
      <span className="text-sm text-gray-400">·</span>
      <span className="text-sm text-gray-500">{date}</span>
    </div>
    <h4 className="font-sans text-[1rem] font-semibold text-black group-hover:text-accent transition-colors mb-1">
      {title}
    </h4>
    {credit && <p className="text-sm text-gray-500 m-0">{credit}</p>}
  </a>
)

const boldAuthor = (authorsStr, name = 'Catapang, J.K.') => {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return authorsStr.replace(new RegExp(escaped, 'g'), `<strong>${name}</strong>`)
}

const citationToPlainText = (html) => {
  if (typeof document === 'undefined') return html.replace(/<[^>]*>/g, ' ')
  const div = document.createElement('div')
  div.innerHTML = html
  return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim()
}

const PdfIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M9 15h6M9 19h6M9 11h2" />
  </svg>
)

const CiteIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2z" />
  </svg>
)

const CopyIcon = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

const CitationModal = ({ citationHtml, onClose }) => {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(citationToPlainText(citationHtml)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 300)
    })
  }
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="citation-modal-title">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-4 pt-4 pb-2 border-b border-gray-200 flex items-center justify-between">
          <h3 id="citation-modal-title" className="font-sans text-sm font-semibold uppercase tracking-wide text-gray-600">APA Citation</h3>
          <button type="button" onClick={onClose} className="p-1 rounded text-gray-400 hover:text-black hover:bg-gray-100" aria-label="Close">✕</button>
        </div>
        <div className="p-4 overflow-auto flex-1">
          <div className="relative">
            <div className="p-4 pr-12 rounded border border-gray-200 bg-gray-50 text-[0.875rem] text-gray-700 [&_a]:text-accent [&_a:hover]:underline [&_em]:italic" dangerouslySetInnerHTML={{ __html: citationHtml }} />
            <button
              id="citation-copy-btn"
              type="button"
              onClick={handleCopy}
              className={`absolute top-3 right-3 p-2 rounded border transition-colors ${copied ? 'bg-accent text-white border-accent' : 'text-gray-500 hover:text-accent hover:bg-white border-gray-200 hover:border-accent'}`}
              aria-label={copied ? 'Copied' : 'Copy citation'}
              title="Copy citation"
            >
              <CopyIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PublicationCard ({ title, authors, monthYear, venue, citation, pdfUrl }) {
  const [citeOpen, setCiteOpen] = useState(false)
  return (
    <>
      <article className="flex flex-wrap items-start gap-4 p-4 rounded border border-gray-200 bg-white min-w-0">
        <div className="min-w-0 flex-1 basis-64">
          <h4 className="font-sans text-[1rem] font-semibold text-black mb-0.5">{title}</h4>
          <p className="text-sm text-gray-600 mb-0.5 [&_strong]:font-semibold [&_strong]:text-black" dangerouslySetInnerHTML={{ __html: boldAuthor(authors) }} />
          <p className="text-sm text-gray-500">{monthYear}{venue && venue !== '—' ? ` · ${venue}` : ''}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {pdfUrl ? (
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
              <PdfIcon />
              <span>View PDF</span>
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 cursor-not-allowed" aria-disabled="true">
              <PdfIcon />
              <span>View PDF</span>
            </span>
          )}
          <button type="button" onClick={() => setCiteOpen(true)} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
            <CiteIcon />
            <span>Cite</span>
          </button>
        </div>
      </article>
      {citeOpen && <CitationModal citationHtml={citation} onClose={() => setCiteOpen(false)} />}
    </>
  )
}

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

const OrcidIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" fill="currentColor" aria-hidden>
    <path d="M256,128c0,70.7-57.3,128-128,128C57.3,256,0,198.7,0,128C0,57.3,57.3,0,128,0C198.7,0,256,57.3,256,128z"/>
    <path d="M86.3,186.2H70.9V79.1h15.4v48.4V186.2z" fill="white"/>
    <path d="M108.9,79.1h41.6c39.6,0,57,28.3,57,53.6c0,27.5-21.5,53.6-56.8,53.6h-41.8V79.1z M124.3,172.4h24.5c34.9,0,42.9-26.5,42.9-39.7c0-21.5-13.7-39.7-43.7-39.7h-23.7V172.4z" fill="white"/>
    <path d="M88.7,56.8c0,5.5-4.5,10.1-10.1,10.1c-5.6,0-10.1-4.6-10.1-10.1c0-5.6,4.5-10.1,10.1-10.1C84.2,46.7,88.7,51.3,88.7,56.8z" fill="white"/>
  </svg>
)

const HuggingFaceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="9" fill="none" />
    <path d="M9 10.3 Q 10 9.2 11 10.3" fill="none" />
    <path d="M13 10.3 Q 14 9.2 15 10.3" fill="none" />
    <path d="M8.5 14 Q 12 17 15.5 14" fill="none" />
    <ellipse cx="3.5" cy="12" rx="1.3" ry="3.8" transform="rotate(-28 3.5 12)" />
    <ellipse cx="20.5" cy="12" rx="1.3" ry="3.8" transform="rotate(28 20.5 12)" />
  </svg>
)

const SKILLS = [
  { title: 'LLM & Post-Training', text: 'SFT, RLHF, Model Alignment, Prompt Engineering, RAG, Agentic AI, Hallucination Reduction, Evaluation Pipeline.' },
  { title: 'Frameworks & Tools', text: 'PyTorch, LangChain, HuggingFace Transformers, Azure OpenAI, WandB, Docker, Cursor, React, Tailwind.' },
  { title: 'Languages', text: 'Python, SQL, JavaScript, C++.' },
]

const MEDIA_ITEMS = [
  {
    title: 'Breaking the illusion of language data scarcity in the Philippines',
    url: 'https://www.manilatimes.net/2024/11/10/opinion/columns/breaking-the-illusion-of-language-data-scarcity-in-the-philippines/2001098',
    outlet: 'The Manila Times',
    domain: 'manilatimes.net',
    date: 'November 10, 2024',
    credit: 'Guest column',
  },
  {
    title: 'Maya PH\'s open-source LLM, Godzilla 2, surpasses ChatGPT in truthfulness',
    url: 'https://www.rappler.com/technology/maya-philippines-open-source-llm-godzilla-2-surpasses-chatgpt-truthfulness/',
    outlet: 'Rappler',
    domain: 'rappler.com',
    date: 'September 6, 2023',
    credit: 'Reported by Jessica Bonifacio',
  },
]

const PUBLICATION_CARDS = [
  { category: 'pending', title: 'Concept Realization Manifolds for Multi-Concept Activation and its (Dis)Entanglement in Large Language Models', authors: 'Catapang, J.K.', monthYear: 'Submitted', venue: '—', citation: 'Catapang, J.K. (submitted). <em>Concept Realization Manifolds for Multi-Concept Activation and its (Dis)Entanglement in Large Language Models</em>.', pdfUrl: '' },
  { category: 'pending', title: 'Asymmetrical Pluralism and the Normative Power of Artificial Intelligence in Asian Englishes', authors: 'Catapang, J.K.', monthYear: 'Submitted', venue: '—', citation: 'Catapang, J.K. (submitted). <em>Asymmetrical Pluralism and the Normative Power of Artificial Intelligence in Asian Englishes</em>.', pdfUrl: '' },
  { category: 'pending', title: 'ChatGPT as a Tool in Describing Variation and Change in English Worldwide', authors: 'Catapang, J.K.', monthYear: 'Forthcoming', venue: '—', citation: 'Catapang, J.K. (forthcoming). <em>ChatGPT as a Tool in Describing Variation and Change in English Worldwide</em>.', pdfUrl: '' },
  { category: 'pending', title: 'Conyo English', authors: 'Borlongan, A.M., Catapang, J.K., Samejon, K., Asamura, S.', monthYear: 'Forthcoming', venue: 'Journal of English and Applied Linguistics, De La Salle University', citation: 'Borlongan, A.M., Catapang, J.K., Samejon, K., Asamura, S. (forthcoming). <em>Conyo English</em>. Journal of English and Applied Linguistics. De La Salle University.', pdfUrl: '' },
  { category: 'journal', title: 'Building the Ethical AI Framework of the Future: From Philosophy to Practice', authors: 'Catapang, J.K.', monthYear: '2026', venue: 'AI and Ethics', citation: 'Catapang, J.K. (2026). <em>Building the Ethical AI Framework of the Future: From Philosophy to Practice</em>. AI and Ethics, 6, 150. <a href="https://doi.org/10.1007/s43681-026-01003-8" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">DOI: 10.1007/s43681-026-01003-8</a>', pdfUrl: '/publications/ethical-ai-framework-2026.pdf' },
  { category: 'journal', title: 'Language, Migration, and ChatGPT', authors: 'Catapang, J.K., Borlongan, A.M., & Go, M.A.C.', monthYear: '2025', venue: 'Journal of Modern Languages', citation: 'Catapang, J.K., Borlongan, A.M., & Go, M.A.C. (2025). <em>Language, Migration, and ChatGPT</em>. Journal of Modern Languages, 35(2), 167–189. <a href="https://doi.org/10.22452/jml.vol35no2.9" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">https://doi.org/10.22452/jml.vol35no2.9</a>', pdfUrl: '/publications/language-migration-chatgpt-2025.pdf' },
  { category: 'journal', title: 'Interdisciplinary Approach to Identify and Characterize COVID-19 Misinformation on Twitter: Mixed Methods Study', authors: 'Isip-Tan, I.T., Cleofas, J.V., Solano, G.A., Pillejera, J.G.A., Catapang, J.K.', monthYear: '2023', venue: 'JMIR Formative Research', citation: 'Isip-Tan, I.T., Cleofas, J.V., Solano, G.A., Pillejera, J.G.A., Catapang, J.K. (2023). <em>Interdisciplinary Approach to Identify and Characterize COVID-19 Misinformation on Twitter: Mixed Methods Study</em>. JMIR Formative Research, 7, e41134. <a href="https://formative.jmir.org/2023/1/e41134" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">DOI: 10.2196/41134</a>', pdfUrl: '/publications/covid-misinformation-twitter-jmir-2023.pdf' },
  { category: 'conference', title: 'Explaining Bias in Internal Representations of Large Language Models via Concept Activation Vectors', authors: 'Catapang, J.K.', monthYear: '2025', venue: 'NLDB 2025, LNCS, Springer', citation: 'Catapang, J.K. (2025). <em>Explaining Bias in Internal Representations of Large Language Models via Concept Activation Vectors</em>. In: Ichise, R. (eds) Natural Language Processing and Information Systems. NLDB 2025. LNCS, vol 15836. Springer, Cham. <a href="https://doi.org/10.1007/978-3-031-97141-9_8" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">DOI: 10.1007/978-3-031-97141-9_8</a>', pdfUrl: '/publications/explaining-bias-cav-nldb-2025.pdf' },
  { category: 'conference', title: 'Can we repurpose multiple-choice question-answering models to rerank retrieved documents?', authors: 'Catapang, J.K.', monthYear: 'December 2024', venue: '38th Pacific Asia Conference on Language, Information and Computation (PACLIC 38)', citation: 'Catapang, J.K. (December 2024). <em>Can we repurpose multiple-choice question-answering models to rerank retrieved documents?</em> 38th Pacific Asia Conference on Language, Information and Computation. Tokyo, Japan. ACL. <a href="https://aclanthology.org/2024.paclic-1.85" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">aclanthology.org/2024.paclic-1.85</a>', pdfUrl: '/publications/paclic-38-rerank-2024.pdf' },
  { category: 'conference', title: 'Emotion-based Morality in Tagalog and English Scenarios (EMoTES-3K): A Parallel Corpus for Explaining (Im)morality of Actions', authors: 'Catapang, J.K., & Visperas, M.', monthYear: 'December 2023', venue: 'NLP4DH + ComputEL 8, Tokyo', citation: 'Catapang, J.K., & Visperas, M. (December 2023). <em>Emotion-based Morality in Tagalog and English Scenarios (EMoTES-3K): A Parallel Corpus for Explaining (Im)morality of Actions</em>. Joint 3rd International Conference on Natural Language Processing for Digital Humanities and 8th International Workshop on Computational Linguistics for Uralic Languages. Tokyo, Japan. pp. 1-6. ACL. <a href="https://aclanthology.org/2023.nlp4dh-1.1" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">aclanthology.org/2023.nlp4dh-1.1</a>', pdfUrl: '/publications/emotes-3k-nlp4dh-2023.pdf' },
  { category: 'conference', title: 'Improving detection of diabetic retinopathy in low-resolution images via latent diffusion', authors: 'Catapang, J.K., Santiago, D.E., & Isip-Tan, I.T.', monthYear: 'September 2023', venue: 'IEEE MIPR 2023, Singapore', citation: 'Catapang, J.K., Santiago, D.E., & Isip-Tan, I.T. (September 2023). <em>Improving detection of diabetic retinopathy in low-resolution images via latent diffusion</em>. 2023 IEEE 6th International Conference on Multimedia Information Processing and Retrieval. Singapore, pp. 53-58. <a href="https://ieeexplore.ieee.org/document/10254404" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">DOI: 10.1109/MIPR59079.2023.00024</a>. Acceptance rate: 19.5%.', pdfUrl: '/publications/diabetic-retinopathy-mipr-2023.pdf' },
  { category: 'conference', title: 'On Modern Text-to-SQL Semantic Parsing Methodologies for Natural Language Interface to Databases: A Comparative Study', authors: 'Visperas, M., Adoptante, A.J., Borjal, C.J., Abia, M.T., Catapang, J.K., Peramo, E.', monthYear: 'February 2023', venue: 'ICAIIC 2023, Bali', citation: 'Visperas, M., Adoptante, A.J., Borjal, C.J., Abia, M.T., Catapang, J.K., Peramo, E. (February 2023). <em>On Modern Text-to-SQL Semantic Parsing Methodologies for Natural Language Interface to Databases: A Comparative Study</em>. 2023 International Conference on Artificial Intelligence in Information and Communication. Bali, Indonesia. pp. 390-396. <a href="https://ieeexplore.ieee.org/document/10067134" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">DOI: 10.1109/ICAIIC57133.2023.10067134</a>', pdfUrl: '' },
  { category: 'conference', title: 'Parallel Corpus Curation for Filipino Text-to-SQL Semantic Parsing', authors: 'Borjal, C.J., Visperas, M., Adoptante, A.J., Abia, M.T., Catapang, J.K., Peramo, E.', monthYear: 'February 2023', venue: 'ICAIIC 2023, Bali', citation: 'Borjal, C.J., Visperas, M., Adoptante, A.J., Abia, M.T., Catapang, J.K., Peramo, E. (February 2023). <em>Parallel Corpus Curation for Filipino Text-to-SQL Semantic Parsing</em>. 2023 International Conference on Artificial Intelligence in Information and Communication. Bali, Indonesia. pp. 163-169. IEEE. <a href="https://ieeexplore.ieee.org/document/10066976" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">DOI: 10.1109/ICAIIC57133.2023.10066976</a>', pdfUrl: '/publications/parallel-corpus-filipino-text-to-sql-2023.pdf' },
  { category: 'conference', title: 'Hadamard Estimated Attention Transformer (HEAT): Fast Approximation of Dot Product Self-attention for Transformers Using Low-Rank Projection of Hadamard Product', authors: 'Catapang, J.K.', monthYear: 'November 2022', venue: 'IEEE ISCMI 2022, Toronto', citation: 'Catapang, J.K. (November 2022). <em>Hadamard Estimated Attention Transformer (HEAT): Fast Approximation of Dot Product Self-attention for Transformers Using Low-Rank Projection of Hadamard Product</em>. 2022 International Conference on Soft Computing & Machine Intelligence. Toronto, Canada. pp. 203-206. IEEE. <a href="https://ieeexplore.ieee.org/document/10068484" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">DOI: 10.1109/ISCMI56532.2022.10068484</a>', pdfUrl: '/publications/heat-iscmi-2022.pdf' },
  { category: 'conference', title: 'Optimizing Speed and Accuracy Trade-off in Machine Learning Models via Stochastic Gradient Descent Approximation', authors: 'Catapang, J.K.', monthYear: 'November 2022', venue: 'IEEE ISCMI 2022, Toronto', citation: 'Catapang, J.K. (November 2022). <em>Optimizing Speed and Accuracy Trade-off in Machine Learning Models via Stochastic Gradient Descent Approximation</em>. 2022 International Conference on Soft Computing & Machine Intelligence. Toronto, Canada. pp. 124-128. IEEE. <a href="https://ieeexplore.ieee.org/document/10068476" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">DOI: 10.1109/ISCMI56532.2022.10068476</a>', pdfUrl: '/publications/speed-accuracy-sgd-iscmi-2022.pdf' },
  { category: 'conference', title: 'Identification and Analysis of COVID-19-related Misinformation Tweets via Kullback-Leibler Divergence for Informativeness and Phraseness and Biterm Topic Modeling', authors: 'Clamor, T.D.S., Solano, G.A., Oco, N., Catapang, J.K., Cleofas, J.V., & Isip-Tan, I.T.', monthYear: 'February 2022', venue: 'ICAIIC 2022, Jeju', citation: 'Clamor, T.D.S., Solano, G.A., Oco, N., Catapang, J.K., Cleofas, J.V., & Isip-Tan, I.T. (February 2022). <em>Identification and Analysis of COVID-19-related Misinformation Tweets via Kullback-Leibler Divergence for Informativeness and Phraseness and Biterm Topic Modeling</em>. 2022 International Conference on Artificial Intelligence in Information and Communication. Jeju, South Korea. pp. 451-456. IEEE. <a href="https://ieeexplore.ieee.org/document/9722623" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">DOI: 10.1109/ICAIIC54071.2022.9722623</a>', pdfUrl: '/publications/covid-misinformation-tweets-icaiic-2022.pdf' },
  { category: 'conference', title: 'Topic Modeling, Clade-assisted Sentiment Analysis, and Vaccine Brand Reputation Analysis of COVID-19 Vaccine-related Facebook Comments in the Philippines', authors: 'Catapang, J.K., & Cleofas, J.V.', monthYear: 'January 2022', venue: 'IEEE ICSC 2022, Laguna Hills', citation: 'Catapang, J.K., & Cleofas, J.V. (January 2022). <em>Topic Modeling, Clade-assisted Sentiment Analysis, and Vaccine Brand Reputation Analysis of COVID-19 Vaccine-related Facebook Comments in the Philippines</em>. 2022 IEEE International Conference on Semantic Computing. Laguna Hills, California, USA. pp. 123-130. IEEE. <a href="https://ieeexplore.ieee.org/document/9736280" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">DOI: 10.1109/ICSC52841.2022.00026</a>. Acceptance rate: 20%.', pdfUrl: '/publications/topic-modeling-vaccine-facebook-icsc-2022.pdf' },
  { category: 'conference', title: 'A Floyd-Warshall-based Reoptimization of Q Matrix on the Single DVRPPD with On-demand Cancellations', authors: 'Catapang, J.K., & Solano, G.A.', monthYear: 'October 2021', venue: 'ICTC 2021, Jeju', citation: 'Catapang, J.K., & Solano, G.A. (October 2021). <em>A Floyd-Warshall-based Reoptimization of Q Matrix on the Single DVRPPD with On-demand Cancellations</em>. 2021 International Conference on Information and Communication Technology Convergence. Jeju, South Korea. pp. 172-177. IEEE. <a href="https://ieeexplore.ieee.org/document/9621108" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">DOI: 10.1109/ICTC52510.2021.9621108</a>', pdfUrl: '/publications/floyd-warshall-dvrppd-ictc-2021.pdf' },
  { category: 'conference', title: 'A Bilingual Chatbot Using Support Vector Classifier on an Automatic Corpus Engine Dataset', authors: 'Catapang, J.K., Solano, G.A., & Oco, N.', monthYear: 'February 2020', venue: 'ICAIIC 2020, Fukuoka', citation: 'Catapang, J.K., Solano, G.A., & Oco, N. (February 2020). <em>A Bilingual Chatbot Using Support Vector Classifier on an Automatic Corpus Engine Dataset</em>. 2020 International Conference on Artificial Intelligence in Information and Communication. Fukuoka, Japan. pp. 187-192. IEEE. <a href="https://ieeexplore.ieee.org/document/9065208" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">DOI: 10.1109/ICAIIC48513.2020.9065208</a>', pdfUrl: '/publications/bilingual-chatbot-icaiic-2020.pdf' },
]

const EXPERIENCE_ENTRIES = [
  {
    role: 'AI Agent Development Lead',
    company: 'Money Forward',
    date: 'Jan 2026 – Present',
    location: 'Tokyo, Japan',
    desc: 'I lead the design, development, and delivery of internal AI modules at Money Forward, overseeing cross-team execution while ensuring alignment among product intent, technical architecture, and operational constraints.',
    bullets: [
      'Expanded scope from lead AI decision quality to end-to-end ownership of internal products’ AI agent development and delivery across multiple initiatives.',
      'Work closely with product managers, engineering leads, platform teams, and senior stakeholders to define agent roadmaps, prioritize features, and coordinate releases.',
      '<strong>AI Agent Client:</strong> Lead cross-functional execution of high-impact AI agent initiatives.',
      '<strong>Accounting Agent:</strong> Development and delivery.',
    ],
    meta: 'Python, Azure, A2A, MCP, PyTorch, Cursor, GPT-5 · Japanese, English',
  },
  {
    role: 'AI Evaluation Lead',
    company: 'Money Forward',
    date: 'Sep 2025 – Dec 2025',
    location: 'Tokyo, Japan',
    desc: 'Led AI quality enforcement and research for the Expense AI Agent, ensuring robust schema design, reliable rule retrieval, and agent performance benchmarking.',
    bullets: [
      '<strong>Valid8R (LLM Evaluation Suite):</strong> Architected a scalable pipeline to benchmark agent performance; automated regression testing reduced iteration time for model alignment experiments by 75%; reduced manual QA by ~40%.',
      '<strong>Expense AI Rulebook:</strong> Spearheaded schema development and quality evaluation pipelines; achieved 45% improvement in rule retrieval precision.',
      'Screened ~10 candidates for Principal AI QA Engineer roles.',
    ],
    meta: 'Python, Azure, A2A, MCP, PyTorch, Cursor, GPT-5 · Japanese, English',
  },
  {
    role: 'Senior AI Engineer',
    company: 'Money Forward',
    date: 'Aug 2024 – Aug 2025',
    location: 'Tokyo, Japan',
    desc: 'Researched and developed components and modules for the internal AI assistant project, powered by state-of-the-art generative AI technologies.',
    bullets: [
      '<strong>AI Agent Platform:</strong> Developed modular A2A hybrid architecture; reduced MTTR for internal AI assistant tasks by 60%.',
      '<strong>SQL Generator:</strong> Reduced engineering toil by 40% and boosted query generation speed by 5x via RAG-like architecture.',
      '<strong>GraphQL Generator:</strong> Scaled automation to cover 150% more production database schemas; handled over 70% of common query types.',
    ],
    meta: 'Python, Azure, Cursor, LangChain, GPT-5, GPT-4o, Docker, Ruby, Kotlin, Gradle, Redis',
  },
  {
    role: 'NLP Lead',
    company: 'Maya Philippines',
    date: 'Apr 2023 – Jul 2024',
    location: 'Mandaluyong City, Philippines',
    desc: 'Researched and developed ethical NLP technologies for the Maya fintech app; supervised the Chatbot (NLP) team in the Data Science department.',
    bullets: [
      '<strong>GodziLLa-2:</strong> Achieved rank #2 on the Hugging Face Open LLM leaderboard with local media coverage; surpassed GPT-3.5 and GPT-4 on a truthfulness benchmark.',
      '<strong>Mayari:</strong> Developed and deployed an LLM-powered customer service agent with RAG; reduced customer query resolution time by 50% and stakeholder promoter score 1.8x.',
      'Supervised a cross-functional NLP team of 4 engineers.',
    ],
    meta: 'Python, PyTorch, Hugging Face, LangChain, spaCy, LanceDB, AWS · Filipino, English',
  },
  {
    role: 'Lead Machine Learning Engineer',
    company: 'Docquity',
    date: 'May 2022 – Nov 2022',
    location: 'Bonifacio Global City, Philippines',
    desc: 'Researched and developed ethical ML, NLP, and biology-inspired technologies for the SEA region; led NLP projects and prompt engineering for LLMs (e.g. GPT-3).',
    bullets: [
      '<strong>Actionome:</strong> User behavior analysis through genome-like processing of in-app actions; shortened delivery of user behavior reports from 1 week to less than an hour.',
    ],
    meta: 'Python, GPT-3, PyTorch, Hugging Face, AWS, Amazon Redshift, Whisper · English, Indonesian, Malaysian, Vietnamese, Thai',
  },
  {
    role: 'Machine Learning Lead',
    company: 'Augmented Intelligence Pros',
    date: 'Feb 2021 – Apr 2022',
    location: 'Silicon Valley, CA, USA',
    desc: 'Researched and developed AI and NLP frameworks and models across the company\'s product modules in online gaming and learning management systems.',
    bullets: [
      '<strong>Chat Deviation Handler:</strong> Transformer-based handling of conversation deviation via PPO reinforcement learning; lessened unhandled user message cases by 75%.',
    ],
    meta: 'Python, PyTorch, TensorFlow, Hugging Face, wav2vec, spaCy · Chinese, English',
  },
  {
    role: 'Machine Learning Lead',
    company: 'Alfafusion',
    date: 'Jul 2020 – Jan 2021',
    location: 'Quezon City, Philippines',
    desc: 'Managed all operations in AI, NLP, and analytics; pioneered the company’s first AI Lab; recruited and mentored junior engineers.',
    meta: 'Python, RasaNLU, Scikit-Learn, Statsmodels, spaCy, Flask · Filipino, English',
  },
  {
    role: 'AI Engineer',
    company: 'Monster Group (UK)',
    date: 'Aug 2020 – Dec 2020',
    location: 'York, UK',
    desc: 'Developed tools to improve SEO and to reverse engineer search result algorithms through deep learning and NLP.',
    meta: 'Python, Scikit-Learn, imblearn, Beautiful Soup, SciPy, JavaScript',
  },
  {
    role: 'Analytics Lecturer',
    company: 'De La Salle–College of Saint Benilde',
    date: 'Aug 2021 – May 2024',
    location: 'Manila, Philippines',
    desc: 'Advised and paneled for undergraduate theses and defenses under the Business Intelligence and Analytics Programme. Taught classes in data analytics and AI ethics.',
  },
]

function MobileIntro() {
  const navItems = [
    { href: '#skills', label: 'Technical skills' },
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#research', label: 'Research' },
    { href: '#grants', label: 'Grants' },
    { href: '#publications', label: 'Publications' },
    { href: '#media', label: 'Media' },
  ]
  return (
    <div className="md:hidden print:hidden px-6 py-8 border-b border-gray-200 bg-surface">
      <div className="flex flex-col items-center text-center mb-6">
        <img src="/professional_headshot.jpeg?v=2" alt="" width={88} height={88} className="w-[88px] h-[88px] shrink-0 rounded-full object-cover mb-4" />
        <h1 className="font-sans text-2xl font-bold tracking-tight text-black mb-2">Jasper Kyle Catapang</h1>
        <p className="text-base text-gray-600 mb-1">NLP & AI Research · Explainable AI · LLM Post-Training</p>
        <p className="text-sm text-gray-600 italic mb-4">PhD Candidate, Tokyo University of Foreign Studies</p>
        <div className="space-y-2 flex flex-col items-center">
          <a href="mailto:jasperkylecatapang@gmail.com" className="font-medium text-accent hover:underline text-sm">jasperkylecatapang@gmail.com</a>
          <div className="flex flex-wrap gap-1 justify-center">
            <IconLink href="https://www.linkedin.com/in/jcatapang/" label="LinkedIn"><LinkedInIcon /></IconLink>
            <IconLink href="https://www.facebook.com/jcatapang07/" label="Facebook"><FacebookIcon /></IconLink>
            <IconLink href="https://scholar.google.com/citations?user=yNIX3HQAAAAJ" label="Google Scholar"><GoogleScholarIcon /></IconLink>
            <IconLink href="https://orcid.org/0000-0002-4510-0975" label="ORCID"><OrcidIcon /></IconLink>
            <IconLink href="https://huggingface.co/jaspercatapang" label="Hugging Face"><HuggingFaceIcon /></IconLink>
          </div>
          <p className="text-sm text-gray-600 m-0">Suginami, Tokyo, Japan</p>
        </div>
      </div>
      <nav className="flex flex-wrap gap-3 justify-center">
        {navItems.map(({ href, label }) => (
          <a key={href} href={href} className="text-sm font-medium uppercase tracking-widest text-gray-600 hover:text-accent transition-colors">
            {label}
          </a>
        ))}
      </nav>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="hidden md:block print:hidden w-72 shrink-0 border-r border-gray-200 bg-surface min-h-screen sticky top-0 py-8 px-6">
      <div className="space-y-10">
        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-gray-600 mb-4 pb-2 border-b border-gray-200">
            Contact
          </h2>
          <div className="space-y-3">
            <a href="mailto:jasperkylecatapang@gmail.com" className="block font-medium text-accent hover:underline text-sm">jasperkylecatapang@gmail.com</a>
            <div className="flex flex-wrap gap-1 pt-1">
              <IconLink href="https://www.linkedin.com/in/jcatapang/" label="LinkedIn">
                <LinkedInIcon />
              </IconLink>
              <IconLink href="https://www.facebook.com/jcatapang07/" label="Facebook">
                <FacebookIcon />
              </IconLink>
              <IconLink href="https://scholar.google.com/citations?user=yNIX3HQAAAAJ" label="Google Scholar">
                <GoogleScholarIcon />
              </IconLink>
              <IconLink href="https://orcid.org/0000-0002-4510-0975" label="ORCID">
                <OrcidIcon />
              </IconLink>
              <IconLink href="https://huggingface.co/jaspercatapang" label="Hugging Face">
                <HuggingFaceIcon />
              </IconLink>
            </div>
            <p className="text-sm text-gray-600 m-0">Suginami, Tokyo, Japan</p>
          </div>
        </div>
        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-gray-600 mb-4 pb-2 border-b border-gray-200">
            Technical Skills
          </h2>
          <div className="space-y-4">
            {SKILLS.map(({ title, text }) => (
              <div key={title} className="p-3 pl-4 bg-white rounded border-l-4 border-accent">
                <h4 className="font-sans text-xs font-semibold uppercase tracking-wide text-accent m-0 mb-1">{title}</h4>
                <p className="text-[0.875rem] m-0 text-gray-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default function App() {
  const [showAllExperience, setShowAllExperience] = useState(false)
  const firstExperience = EXPERIENCE_ENTRIES[0]
  const restExperience = EXPERIENCE_ENTRIES.slice(1)

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <a
        href="#main-content"
        className="absolute left-4 top-4 -translate-y-[200%] z-[100] px-4 py-2 bg-accent text-white font-medium rounded focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-transform print:hidden"
      >
        Skip to main content
      </a>
      <MobileIntro />
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:block print:hidden sticky top-0 z-10 bg-white/92 backdrop-blur-md border-b border-gray-200">
          <nav className="px-8 py-6 flex flex-wrap gap-4">
            {['About', 'Experience', 'Research', 'Grants', 'Publications', 'Media'].map((label) => (
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

        <main id="main-content" className="flex-1 px-6 md:px-8 pb-10 max-w-4xl" tabIndex={-1}>
          <section id="hero" className="hidden md:block py-12 border-b border-gray-200">
            <div className="flex gap-6 items-center">
              <img src="/professional_headshot.jpeg?v=2" alt="" width={128} height={128} className="w-32 h-32 shrink-0 rounded-full object-cover aspect-square" />
              <div className="min-w-0">
                <h1 className="font-sans text-3xl md:text-4xl font-bold tracking-tight text-black mb-1.5">
                  Jasper Kyle Catapang
                </h1>
                <p className="text-lg text-gray-600 mb-1">NLP & AI Research · Explainable AI · LLM Post-Training</p>
                <p className="text-[0.95rem] text-gray-600 italic">PhD Candidate, Tokyo University of Foreign Studies</p>
              </div>
            </div>
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

          <section id="skills" className="md:hidden py-8 border-b border-gray-200">
            <h2 className="font-sans text-xl font-semibold uppercase tracking-widest text-gray-600 mb-4 pb-2 border-b border-gray-200">Technical Skills</h2>
            <div className="space-y-4">
              {SKILLS.map(({ title, text }) => (
                <div key={title} className="p-3 pl-4 bg-surface rounded border-l-4 border-accent">
                  <h4 className="font-sans text-xs font-semibold uppercase tracking-wide text-accent m-0 mb-1">{title}</h4>
                  <p className="text-[0.875rem] m-0 text-gray-700">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <Section id="experience" title="Experience">
            <Entry
              role={firstExperience.role}
              company={firstExperience.company}
              date={firstExperience.date}
              location={firstExperience.location}
              desc={firstExperience.desc}
              bullets={firstExperience.bullets}
              meta={firstExperience.meta}
            />
            {restExperience.length > 0 && (
              <>
                {showAllExperience ? (
                  restExperience.map((entry, i) => (
                    <Entry
                      key={i}
                      role={entry.role}
                      company={entry.company}
                      date={entry.date}
                      location={entry.location}
                      desc={entry.desc}
                      bullets={entry.bullets}
                      meta={entry.meta}
                    />
                  ))
                ) : null}
                <button
                  type="button"
                  onClick={() => setShowAllExperience(!showAllExperience)}
                  className="flex items-center gap-2 text-sm font-medium text-accent hover:underline mt-2"
                  aria-expanded={showAllExperience}
                >
                  {showAllExperience ? (
                    <>Show less</>
                  ) : (
                    <>
                      <span className="text-lg leading-none">⋯</span>
                      View more experience ({restExperience.length})
                    </>
                  )}
                </button>
              </>
            )}
          </Section>

          <Section id="education" title="Education">
            <Entry
              role="Doctor of Philosophy, Global Studies"
              company="Tokyo University of Foreign Studies"
              date="Oct 2024 – Present"
              location="Tokyo, Japan"
              desc={<>Language and Culture Program.<br />Dissertation: Lexical innovations in Southeast Asian Englishes: A mixed methods analysis of social media.</>}
            />
            <Entry
              role="Master of Arts, Applied Linguistics"
              company="University of Birmingham"
              date="Dec 2020 – Jul 2023"
              location="Birmingham, United Kingdom"
              desc={<>Student Representative 2021/2022.<br />Dissertation: A cross-cultural corpus analysis of honorifics in spoken and written text corpora of American, British, Philippine, and Singapore Englishes.</>}
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
          </Section>

          <Section id="grants" title="Grants and Funding">
            <div className="p-5 rounded border border-gray-200 bg-white">
              <h4 className="font-sans text-base font-semibold m-0 mb-2">UP ISC Research Grant 2026–2028</h4>
              <p className="text-[0.95rem] m-0">
                UP Intelligent Systems Center. Research Project: Design, Development, and Evaluation of a Filipino Conversational Agent for the Self-management of Type 2 Diabetes Mellitus. Co-investigator.
              </p>
            </div>
          </Section>

          <Section id="publications" title="Publications" className="pb-10">
            <SubsectionTitle>Pending</SubsectionTitle>
            <div className="space-y-3 mb-6">
              {PUBLICATION_CARDS.filter(p => p.category === 'pending').map((pub, i) => (
                <PublicationCard
                  key={`pending-${i}`}
                  title={pub.title}
                  authors={pub.authors}
                  monthYear={pub.monthYear}
                  venue={pub.venue}
                  citation={pub.citation}
                  pdfUrl={pub.pdfUrl}
                />
              ))}
            </div>
            <SubsectionTitle>Journal Articles</SubsectionTitle>
            <div className="space-y-3 mb-6">
              {PUBLICATION_CARDS.filter(p => p.category === 'journal').map((pub, i) => (
                <PublicationCard
                  key={`journal-${i}`}
                  title={pub.title}
                  authors={pub.authors}
                  monthYear={pub.monthYear}
                  venue={pub.venue}
                  citation={pub.citation}
                  pdfUrl={pub.pdfUrl}
                />
              ))}
            </div>
            <SubsectionTitle>Conference Proceedings</SubsectionTitle>
            <div className="space-y-3 mb-10">
              {PUBLICATION_CARDS.filter(p => p.category === 'conference').map((pub, i) => (
                <PublicationCard
                  key={`conference-${i}`}
                  title={pub.title}
                  authors={pub.authors}
                  monthYear={pub.monthYear}
                  venue={pub.venue}
                  citation={pub.citation}
                  pdfUrl={pub.pdfUrl}
                />
              ))}
            </div>
            <SubsectionTitle>Conference Presentations</SubsectionTitle>
            <ul className="pl-5 space-y-1.5 text-sm">
              <li>Catapang, J.K. (January 2026). <em>Stance and Register Variation in Philippine English Journalism: Quantitative Evidence from Media Coverage of a National Controversy</em>. The 56th Japanese Association of Asian Englishes (JAFAE) National Conference. Hiroshima, Japan.</li>
              <li>Catapang, J.K. (June 2025). <em>Explaining Lexical Innovations of Southeast Asian Englishes in Social Media: A Framework-Driven Survey</em>. The 55th Japanese Association of Asian Englishes (JAFAE) National Conference. Chiba, Japan.</li>
            </ul>
            <SubsectionTitle>Lectures</SubsectionTitle>
            <ul className="pl-5 space-y-1.5 text-sm">
              <li>Transformers for Natural Language Processing. (February 9-11, 2026). Tokyo University of Foreign Studies, Japan.</li>
              <li>Do the Models Hear Us? Artificial Intelligence and the (In)visibility of Migrant Voices and Languages. (December 5, 2025). 2nd International Conference on Migration Linguistics. University of Santo Tomas, Philippines.</li>
              <li>LLM Theory to Practice Series. (August 20, 2025). Tokyo University of Foreign Studies, Japan.</li>
              <li>Interpretability on how large language models process information. (July 14, 2025). De La Salle University, Philippines.</li>
              <li>The good, the bad, and the ugly: A lecture on emotion-based AI morality. (June 6, 2024). De La Salle University, Philippines.</li>
              <li>From generic to genius: Finetuning LLMs to enhance AI performance and reliability. (May 30, 2024). De La Salle University, Philippines.</li>
              <li>Text is superficial: Commonsense as dark matter of language. (May 4, 2023). University of the Philippines Manila.</li>
              <li>Language in the Time of Pandemic. (November 22, 2021). Tokyo University of Foreign Studies, Singapore Association for Applied Linguistics, and Oxford Languages.</li>
              <li>Natural Language Processing 101: From Characters to Meaning. (August 19, 2021). NLPinas, University of the Philippines Diliman, and Philippine-California Advanced Research Institutes.</li>
              <li>Artificial intelligence for natural language processing. (March 6, 2020). University of the Philippines Manila.</li>
            </ul>
            <SubsectionTitle>Speaking Engagements</SubsectionTitle>
            <ul className="pl-5 space-y-1.5 text-sm">
              <li>MARISTory: A Homecoming Odyssey. (January 26, 2024). Marist School Marikina, Philippines.</li>
              <li>ML/AI Unleashed: Exploring Potential and Impact. (July 29, 2023). Amazon Web Services Philippines.</li>
              <li>Eskwelabs Data Science Sprint Judging. (April 13, 2023). Eskwelabs.</li>
              <li>DPSM Science e-Camp 2021. (August 3, 2021). University of the Philippines Manila.</li>
              <li>Eskwelabs Data Science Sprint Judging & Fireside Chat. (July 10, 2021). Eskwelabs.</li>
              <li>Data Talk: Open Citizens Data with NLPinas. (May 15, 2021). Eskwelabs.</li>
              <li>Life of AI 2.0. (March 19, 2021). De La Salle-College of Saint Benilde.</li>
            </ul>
          </Section>

          <Section id="media" title="Media" className="pb-10">
            <div className="grid gap-4 sm:grid-cols-2">
              {MEDIA_ITEMS.map((item) => (
                <MediaCard
                  key={item.url}
                  title={item.title}
                  url={item.url}
                  outlet={item.outlet}
                  domain={item.domain}
                  date={item.date}
                  credit={item.credit}
                />
              ))}
            </div>
          </Section>
        </main>

        <footer className="print:hidden px-8 py-6 border-t border-gray-200 text-sm text-gray-600">
          © {new Date().getFullYear()} Jasper Kyle Catapang
        </footer>
      </div>
    </div>
  )
}
