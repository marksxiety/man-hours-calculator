# Man-Hours Calculator

![Tests](https://github.com/marksxiety/man-hours-calculator/actions/workflows/tests.yml/badge.svg)
![Build](https://github.com/marksxiety/man-hours-calculator/actions/workflows/build.yml/badge.svg)
![Lint](https://github.com/marksxiety/man-hours-calculator/actions/workflows/lints.yml/badge.svg)
![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)

The Man-Hours Calculator is a data-driven framework designed to bridge the gap between technical uncertainty and business requirements. By replacing "gut-feeling" guesses with the Program Evaluation and Review Technique (PERT), it provides a disciplined way to account for the inherent risks in software development.

---

## The PERT Methodology

The core of this system is the three-point estimation technique. Instead of providing a single number, developers provide three distinct data points for every task:

1. Optimistic (O): The "perfect world" scenario—no blockers or surprises.
2. Most Likely (M): The most realistic, frequent outcome under normal conditions.
3. Pessimistic (P): The "worst-case" scenario—unexpected bugs or hidden dependencies.

### The Weighted Average (Expected Duration)
The system calculates Expected Duration (E) using a weighted average that deliberately leans toward the most likely estimate while still accounting for outliers:

$$E = \frac{O + 4M + P}{6}$$

The "4M" weight reflects real-world behavior: outcomes cluster around what is most likely. Pure averages treat all scenarios equally, which often overestimates uncertainty. This formula keeps the estimate grounded while acknowledging the "tails" of risk.

---

## Features and Interface

* Real-Time Computation: All calculations update instantly as you type, including task-level duration, standard deviation, and project-level variance.
* Probability Analysis: Calculates the statistical chance of finishing by a target deadline based on accumulated project variance.
* Developer Feedback Loop: Allows developers to self-correct unrealistic estimates by seeing the mathematical impact of their inputs immediately.
* Modern Tech Stack: Built with Vue 3, TypeScript, Vite, and TailwindCSS for a high-performance experience.

---

## Understanding the Math

### Standard Deviation (σ)
A measure of "spread"—how far apart your best and worst-case guesses are.
Formula: $$\sigma = \frac{P - O}{6}$$
* Small σ: Signals high confidence; the task is well-understood.
* Large σ: Acts as a warning sign; the task is unpredictable or poorly scoped.

### Variance (σ²)
Variance is the key to project-level uncertainty. While you cannot add standard deviations together, variances can be summed to find the total project risk. Higher cumulative variance means a wider, less predictable delivery window.

### Confidence Intervals
| Range | Interpretation |
|---|---|
| E ± 1σ | ~68% chance of finishing within this window |
| E ± 2σ | ~95% chance of finishing within this window |
| E ± 3σ | ~99.7% chance of finishing within this window |

---

## Glossary of Terms

* PERT: Program Evaluation and Review Technique—a statistical tool used in project management.
* Estimation Debt: The accumulated cost of optimistic guesses that ignore technical reality.
* Sigma (σ): A statistical term for Standard Deviation; used here to represent task-level risk.
* Expected Duration (E): The final number used for planning, derived from the weighted PERT formula.

---

## Documentation Links

* [Getting Started](./docs/getting-started.md) — Setup and installation.
* [Usage Guide](./docs/usage.md) — How to use the app effectively.
* [Testing Guide](./docs/tests.md) — Unit testing and build verification.

---

## Project Goal
To eliminate "Estimation Debt" by applying a mathematical approach to quoting that accounts for uncertainty while providing full transparency to both developers and stakeholders.