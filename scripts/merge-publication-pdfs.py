#!/usr/bin/env python3
"""
Merge the “Selected Publications” list PDF + exactly those papers that have a PDF
in public/publications/, in the same numbered order as the list.

Default front matter: ~/Downloads/04_List_of_Publications_5424103_CatapangJasperKyle (1).pdf

The selected list has six items; item 2 (Conyo English) has no PDF in this repo — it is
skipped with a console notice; the merge contains list PDF + five paper PDFs.

Usage:
  ./.venv-pdfmerge/bin/python scripts/merge-publication-pdfs.py --out ./Merged-Publications-Catapang.pdf

  ./.venv-pdfmerge/bin/python scripts/merge-publication-pdfs.py \\
    --front-matter "/path/to/list.pdf" \\
    --out ./Merged-Publications-Catapang.pdf

  ./.venv-pdfmerge/bin/python scripts/merge-publication-pdfs.py --no-front-matter --out ./papers-only.pdf

Requires: repo .venv-pdfmerge with `pip install pypdf`.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from pypdf import PdfReader, PdfWriter


DEFAULT_FRONT_MATTER = (
    Path.home()
    / "Downloads"
    / "04_List_of_Publications_5424103_CatapangJasperKyle (1).pdf"
)

# Selected list order (same as 04_List…(1).pdf). Value None = no PDF in repo (skip).
SELECTED_PUBLICATION_SLOTS: list[tuple[str, str | None]] = [
    ("1. Asymmetrical Pluralism… (Asian Englishes)", "asymmetrical-pluralism-normative-power-ai-asian-englishes.pdf"),
    ("2. Conyo English (in press; no PDF in repo)", None),
    ("3. Language, Migration, and ChatGPT", "language-migration-chatgpt-2025.pdf"),
    ("4. Explaining Bias… / CAV (NLDB 2025)", "explaining-bias-cav-nldb-2025.pdf"),
    ("5. EMoTES-3K (NLP4DH / IWCLUL 2023)", "emotes-3k-nlp4dh-2023.pdf"),
    ("6. Bilingual chatbot (ICAIIC 2020)", "bilingual-chatbot-icaiic-2020.pdf"),
]


def append_pdf(writer: PdfWriter, path: Path) -> None:
    reader = PdfReader(str(path))
    for page in reader.pages:
        writer.add_page(page)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    pub_dir = root / "public" / "publications"

    p = argparse.ArgumentParser(
        description="Merge Selected Publications list PDF + listed paper PDFs in list order."
    )
    p.add_argument(
        "--front-matter",
        type=Path,
        default=None,
        metavar="PDF",
        help=f"PDF to prepend before papers (default: {DEFAULT_FRONT_MATTER}).",
    )
    p.add_argument(
        "--no-front-matter",
        action="store_true",
        help="Omit front matter; merge only the publication PDFs.",
    )
    p.add_argument(
        "--out",
        type=Path,
        default=root / "Merged-Publications-Catapang.pdf",
        help="Output merged PDF path.",
    )
    args = p.parse_args()

    writer = PdfWriter()

    if not args.no_front_matter:
        fm = (args.front_matter or DEFAULT_FRONT_MATTER).expanduser().resolve()
        if not fm.is_file():
            raise SystemExit(
                f"Front matter PDF not found: {fm}\n"
                "Pass --front-matter PATH or use --no-front-matter to skip."
            )
        append_pdf(writer, fm)

    missing: list[str] = []
    skipped: list[str] = []
    for label, name in SELECTED_PUBLICATION_SLOTS:
        if name is None:
            skipped.append(label)
            print(f"Skip (no PDF): {label}", file=sys.stderr)
            continue
        fp = pub_dir / name
        if not fp.is_file():
            missing.append(f"{label} -> {fp}")
            continue
        append_pdf(writer, fp)

    if missing:
        raise SystemExit("Missing PDF(s):\n" + "\n".join(missing))

    out = args.out.expanduser().resolve()
    out.parent.mkdir(parents=True, exist_ok=True)
    with open(out, "wb") as f:
        writer.write(f)

    n_pages = len(writer.pages)
    n_papers = len(SELECTED_PUBLICATION_SLOTS) - len(skipped) - len(missing)
    print(f"Wrote {out} ({n_pages} pages). Appended {n_papers} paper PDF(s).")
    if skipped:
        print(f"Skipped slots (no file in repo): {len(skipped)}", file=sys.stderr)


if __name__ == "__main__":
    main()
