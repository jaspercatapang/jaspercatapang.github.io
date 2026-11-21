---
title: Where bilingual speakers can switch: a small theorem
date: 2026-11-21
tags: Computational sociolinguistics, World Englishes
summary: A common recipe for generating code-switched text defines a set of sentences. The set has a clean shape, and for Tagalog and English it is stricter than real speech.
files:
  - files/ec_closure.pdf | The write-up | Definitions, proof, and what is and isn't new
  - files/ec_closure_files.zip | Proof and tests | The Lean proof and the test scripts
---

Bilingual speakers switch languages in the middle of a sentence, but not just anywhere. The oldest precise guess about where is Shana Poplack's Equivalence Constraint (1980): switch only at a point where the word orders of the two languages agree.

In NLP we use that rule as a recipe. To make synthetic code-switched data, line a sentence up with its translation and allow a switch only where no alignment link crosses it. I had been using it for years without asking what set of sentences the recipe actually allows.

## The answer

Under a tidy model of the two languages, the set has a clean shape. It can be described by an ordinary grammar, so you can check a sentence with a parser or sample valid ones directly, instead of generating freely and filtering afterwards. That is the theorem, and I'm calling it the EC closure theorem. It is small, and part of it goes back to Sankoff in 1998.

The proof is formalized in Lean, à la Levent Alpöge's claimed proof of the Riemann Hypothesis [this week](https://www.nytimes.com/2026/11/20/science/anthropic-ai-math-riemann-hypothesis.html), which he made with Claude. Mine is the small-scale version: a theorem short enough to hold in your head, and a machine that agrees. Whether his holds up is a whole different can of worms, and something I'm out of my depth to really tackle here. Anyway, we're getting off topic.

## The part I care about

Tagalog puts the verb first and English puts the subject first, and that is where the recipe gets strict. Take *Bumili ako ng | new phone*. The recipe allows that switch, and speakers say it. Now take *Bumili ang | teacher ng libro*. I would say that too, but the recipe rules it out.

So the rule we implement is narrower than the one linguists wrote down. What's new is that we can now say exactly how much narrower, for a given pair of grammars. The next step is to measure it on real Taglish.

## The rest is in the PDF

Definitions, the proof, how this relates to earlier work, what was machine-checked, and who did what are all in the write-up. The files are below.
