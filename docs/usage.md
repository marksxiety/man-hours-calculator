# Usage Guide

This guide explains how to use the Man-Hours Calculator to create accurate project estimates using the PERT methodology.

## Overview

The application provides an intuitive interface for:
- Adding tasks with three-point estimates
- Viewing real-time PERT calculations
- Analyzing project-level statistics
- Exporting results to Excel

---

## Adding Tasks

### Step 1: Navigate to the Add Task Form

The main screen displays a form where you can enter task details.

### Step 2: Fill in Task Information

| Field | Description | Required |
|-------|-------------|----------|
| **Milestone** | The project milestone this task belongs to (e.g., "Planning") | No |
| **Retain Milestone** | Checkbox to keep the milestone value for the next task | No |
| **Task Name** | A concise name for the task (e.g., "User Authentication") | Yes |
| **Description** | Detailed description of what needs to be done | No |
| **Optimistic (O)** | Best-case estimate in hours | Yes |
| **Most Likely (M)** | Most realistic estimate in hours | Yes |
| **Pessimistic (P)** | Worst-case estimate in hours | Yes |

### Step 3: Input Your Three-Point Estimates

For each task, provide three time estimates:

#### Optimistic (O)
**"Best case scenario"** — Everything goes perfectly:
- No unexpected bugs
- No dependencies blocking progress
- All requirements are clear from the start

> Example: If you've done this task before and it typically takes 2 hours, your optimistic might be **1.5 hours**.

#### Most Likely (M)
**"Realistic scenario"** — Normal conditions:
- Minor issues may arise but are manageable
- Typical level of complexity for your team
- Based on past experience with similar tasks

> Example: Given the complexity and your past experience, you expect this to take about **4 hours**.

#### Pessimistic (P)
**"Worst case scenario"** — Murphy's Law strikes:
- Unexpected technical challenges
- Dependencies on external systems
- Requirements changes or clarifications
- Integration issues

> Example: If there are unclear requirements or you're working with unfamiliar technology, this could take **10 hours**.

### Step 4: Review Real-Time Calculations

As you type, the system automatically calculates:

- **Expected Time (E):** The weighted average `(O + 4M + P) / 6`
- **Standard Deviation (σ):** Uncertainty measure `(P - O) / 6`
- **Variance (σ²):** Aggregated uncertainty `σ²`

These values update instantly, allowing you to adjust your estimates if the calculations seem off.

### Step 5: Add the Task

Click the **"Add Task"** button. The task will appear in the task list below. If you enabled "Retain Milestone", the milestone value will be preserved for the next task.

---

## Managing Tasks

### Viewing Task List

All added tasks are displayed in a table with:
- Task details (name, milestone, description)
- Your three-point estimates
- Calculated PERT values

### Editing Estimates

You can update any task's estimates directly in the table:
- Click on an estimate field (O, M, P) to edit it
- The recalculations happen automatically
- Changes are saved to local storage

### Editing Task Details

To edit task name, milestone, or description:
1. Click the pencil icon next to any task
2. Modify the fields in the edit dialog
3. Click "Save Changes"

### Reordering Tasks

Tasks can be reordered by dragging them using the grip handle (drag icon) on the left side of each row.

### Deleting Tasks

Click the delete (X) button next to any task to remove it. You can choose to suppress the confirmation dialog for faster workflow.

---

## Setting Desired Completion Time

### Why Set a Desired Completion Time?

The desired completion time represents your project deadline or client commitment. Setting it allows the system to:

1. Calculate the **Z-Score** — how many standard deviations your target is from the expected duration
2. Compute **On-Time Probability** — the statistical chance of finishing on time

### How to Set Your Desired Completion Time

1. Find the "Desired Completion Time (D)" field in the Analysis section
2. Enter your deadline in hours
3. The probability analysis updates automatically

> **Note:** You must set a Desired Completion Time (D) before you can export results to Excel.

### Interpreting the Results

| Probability Range | Interpretation |
|------------------|----------------|
| **90-100%** | Highly confident — you have plenty of buffer |
| **75-90%** | Good confidence — reasonable buffer |
| **50-75%** | Moderate confidence — some risk |
| **25-50%** | Low confidence — significant risk |
| **0-25%** | Very low confidence — deadline is unrealistic |

**Z-Score Interpretation:**
- **Positive Z**: Your desired time is above the expected duration (good)
- **Zero Z**: Your desired time equals the expected duration (50% probability)
- **Negative Z**: Your desired time is below the expected duration (high risk)

---

## Analyzing Project Statistics

### Key Metrics

The dashboard displays project-level statistics:

#### Total Expected Time
Sum of all task expected times. This is your "best single number" for the project.

#### Total Variance
Sum of all task variances. This represents the accumulated uncertainty across all tasks.

#### Z-Score
```
Z = (Target Duration - Total Expected Time) / √Total Variance
```
- **Positive Z**: Your target is above the expected duration (good)
- **Zero Z**: Your target equals the expected duration (50% probability)
- **Negative Z**: Your target is below the expected duration (high risk)

#### Completion Probability
The statistical likelihood of finishing before your target deadline.

---

## Organizing by Milestones

Tasks can be labeled with milestones to help organize your project. Each task displays its associated milestone (or "—" if none is specified). Use the "Retain Milestone" checkbox to quickly add multiple tasks to the same milestone. This helps you:

- See which phases have the most uncertainty
- Identify high-risk milestones
- Allocate resources more effectively

---

## Exporting Results

### Export to Excel

Click the **"Export"** button to download a spreadsheet containing:

- All task details and estimates
- Calculated PERT values
- Project-level summary statistics
- On-Time probability analysis

The Excel file includes two worksheets:
1. **Task Breakdown** — Individual task details
2. **PERT Analysis** — Project-level metrics and probability

**Note:** You must set a Desired Completion Time (D) before exporting, as it's required for the probability calculations in the export.

The file is formatted for presentation and can be shared with stakeholders.

---

## Best Practices

### 1. Be Realistic, Not Optimistic

- Don't let pressure to meet deadlines skew your optimistic estimate
- Your pessimistic should truly be a worst-case, not a "somewhat bad" case
- If you're uncertain, widen your range — the math will handle it

### 2. Break Down Large Tasks

- Large tasks inherently have higher variance
- Break them into smaller, more predictable subtasks
- This improves accuracy and makes bottlenecks easier to identify

### 3. Use Historical Data

- If you've done similar work before, reference it
- Track how long past tasks actually took vs. what you estimated
- Use this to calibrate your future estimates

### 4. Review and Adjust

- Periodically compare estimates to actuals
- If you consistently underestimate, adjust your approach
- The tool is only as good as the data you provide

### 5. Communicate Uncertainty

- Share the probability metrics with stakeholders
- Explain what the ranges mean in business terms
- Use the data to negotiate realistic deadlines

---

## Common Mistakes to Avoid

### Narrowing the Range Too Much

**Bad:** O=4h, M=5h, P=6h (σ=0.33h)
**Better:** O=2h, M=5h, P=10h (σ=1.33h)

If you truly can't provide a meaningful range, the task is likely not well-understood. Take time to scope it better.

### Using Simple Averages

Don't try to "do the math yourself." The weighted PERT formula `(O + 4M + P) / 6` is specifically designed to give more weight to the most likely outcome.

### Ignoring Dependencies

Tasks that depend on other tasks or external systems should have wider ranges. Account for this in your pessimistic estimate.

### Forgetting Non-Development Work

Your estimates should include:
- Coding time
- Testing and debugging
- Code review
- Documentation
- Deployment
- Meetings and communication

---

## Tips for Different Scenarios

### Familiar Task
- Narrow range between estimates
- High confidence in all three numbers
- Low standard deviation

### Unfamiliar Technology
- Wide range, especially on pessimistic side
- Higher standard deviation
- Consider research spikes

### High-Risk Integration
- Very wide pessimistic estimate
- Potential for external blockers
- Account for communication delays

### Well-Defined Requirement
- Clear optimistic case
- Realistic most-likely estimate
- Pessimistic accounts for minor unknowns only

---

## Getting Help

If you're unsure about your estimates:
1. Ask a colleague for a second opinion
2. Reference similar past projects
3. Do a quick proof-of-concept spike
4. Break the task down further

The goal is accuracy, not speed. A good estimate now saves headaches later.
