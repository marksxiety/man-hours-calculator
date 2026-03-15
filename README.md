# Man-Hours Calculator

<p align="center">
  <img src="https://github.com/marksxiety/man-hours-calculator/actions/workflows/tests.yml/badge.svg" alt="Tests" />
  <img src="https://github.com/marksxiety/man-hours-calculator/actions/workflows/build.yml/badge.svg" alt="Build" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License" />
</p>

### A Data-Driven Framework for Software Project Quoting

This system replaces "gut-feeling" guesses with **Program Evaluation and Review Technique (PERT)**. It is designed to bridge the gap between developer technical uncertainty and business requirements for fixed-timeline accuracy.

---

## The PERT Methodology

The core of this system is the **three-point estimation technique**. Instead of providing a single number, developers provide three distinct data points for every task:

1. **Optimistic (O):** The "perfect world" scenario — everything goes right, no blockers, no surprises.
2. **Most Likely (M):** The most realistic, most frequent outcome under normal conditions.
3. **Pessimistic (P):** The "worst-case" scenario — unexpected bugs, blockers, or dependencies cause delays.

The system calculates **Expected Duration (E)** using a weighted average that deliberately leans toward the most likely estimate, while still accounting for outliers:

$$
E = \frac{O + 4M + P}{6}
$$

> **Why weighted?** The `4M` weight reflects real-world behavior: outcomes cluster around what's *most likely*. Pure averages treat all three scenarios equally, which overestimates uncertainty. PERT's weighting keeps the estimate grounded while still acknowledging the tails.

---

## Understanding the Statistical Terms

These terms appear throughout the app — here's what each one actually tells you and why it matters for your estimates.

### Standard Deviation (`σ` — "sigma")

A measure of *spread* — how far apart your best-case and worst-case guesses are.

```
σ = (P - O) / 6
```

If your optimistic estimate is 2 hours and your pessimistic estimate is 8 hours, the standard deviation is `(8 - 2) / 6 = 1 hour`. That 1 hour represents the typical margin of uncertainty for this task.

**A small σ signals confidence.** Your best and worst cases are close together — you know this task well. **A large σ is a warning sign** that the task is unpredictable, poorly scoped, or has hidden dependencies worth surfacing before committing to a deadline.

Think of it like a weather forecast: "22–24°C tomorrow" is a tight, confident range. "10–35°C" means even the forecast model doesn't trust itself — and you shouldn't either.

---

### Variance (`σ²`)

Variance is standard deviation *squared* — and it's the key to understanding uncertainty at the project level, not just the task level.

You can't simply add standard deviations across tasks — the math doesn't work that way. But variances *can* be added directly. That's the core reason this metric exists.

For example, if two tasks each have σ = 2h, their variances are both 4. The combined project variance is 4 + 4 = **8**, which gives a combined standard deviation of √8 ≈ **2.83h** — not 4h. Adding σ directly would overstate your uncertainty.

**Higher variance means lower confidence** — not just in a single task, but in the project as a whole. As variance accumulates across tasks, the realistic delivery window widens. A project full of high-variance tasks is one where a fixed deadline is a gamble, not a commitment.

---

### Expected Duration (E)

The single number the system uses for planning — derived from your three-point input, not a simple average of the three.

It gives four times as much weight to the Most Likely estimate, because that's your most informed data point:

If O = 2h, M = 5h, P = 14h:
- Simple average = (2 + 5 + 14) / 3 = **7 hours**
- PERT expected = (2 + 4×5 + 14) / 6 = **6 hours**

The PERT formula anchors the estimate around what you actually believe will happen, while still factoring in the extremes.

---

### Confidence Intervals & Completion Probability

Given a target deadline, the app calculates the *probability* that the project will finish in time — using the project's total expected duration and accumulated variance.

| Range | Interpretation |
|---|---|
| E ± 1σ | ~68% chance of finishing within this window |
| E ± 2σ | ~95% chance of finishing within this window |
| E ± 3σ | ~99.7% chance of finishing within this window |

> **Rule of thumb:** If your target deadline falls within `E + 1σ`, you're in good shape. If it falls below `E`, you're already cutting it close. If it falls below `O`, the estimate needs revisiting.

---

## Features

### Developer Entry Interface

- **Transparent Entry:** Developers see task descriptions, input fields for `[O]`, `[M]`, and `[P]`, and all PERT calculations in real-time.
- **Real-Time Computation:** All calculations update instantly as developers type:
  - Task-level: `expected_duration`, `standard_deviation`, `variance`
  - Project-level: Total expected hours, total variance
  - Probability analysis: Completion probability based on target
- **Immediate Feedback:** Developers can self-correct unrealistic estimates with live calculations visible.

---

## Tech Stack

- **Frontend Framework:** Vue 3 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **UI Components:** Reka UI (Shadcn Vue)
- **Icons:** Lucide Vue Next

---

## How It Works

1. **Define Tasks:** Break down your project into manageable tasks.
2. **Input Estimates:** For each task, provide three-point estimates:
   - **Optimistic (O):** Best case — no friction, everything works.
   - **Most Likely (M):** Realistic, most common outcome.
   - **Pessimistic (P):** Worst case — expect the unexpected.
3. **Automatic Calculation:** The system computes:
   - **Expected Duration:** `E = (O + 4M + P) / 6` — your weighted "best single number."
   - **Standard Deviation:** `σ = (P - O) / 6` — how uncertain this task is.
   - **Variance:** `σ²` — uncertainty in a form that can be summed across tasks.
4. **Analyze Results:** Review project-level statistics and confidence intervals.
5. **Make Informed Decisions:** Use data-driven insights for project planning and quoting.

---

## Project Goal

To eliminate **"Estimation Debt"** — the accumulated cost of guesses that were too optimistic — by applying a disciplined, mathematical approach to quoting that accounts for the inherent uncertainty of software development, while providing full transparency and real-time feedback to developers.

---

## Glossary

| Term | Short Definition |
|---|---|
| **PERT** | Program Evaluation and Review Technique — a three-point estimation method. |
| **Optimistic (O)** | Best-case duration estimate. |
| **Most Likely (M)** | Most realistic duration estimate. |
| **Pessimistic (P)** | Worst-case duration estimate. |
| **Expected Duration (E)** | Weighted average of O, M, P. The number you plan with. |
| **Standard Deviation (σ)** | How spread out your estimates are. Measures uncertainty per task. |
| **Variance (σ²)** | σ squared. Used to aggregate uncertainty across multiple tasks. |
| **Confidence Interval** | A range within which the actual outcome is likely to fall. |
| **Completion Probability** | The statistical chance of finishing before a target deadline. |