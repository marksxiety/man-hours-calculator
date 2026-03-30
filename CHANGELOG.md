# Changelog

## [1.2.1] - 2026-03-30

### Refactoring
- Extract HelpTooltip component for reusable icon-based help tooltips in Demo
- Extract AnalysisMetricCard component for metric display with optional highlight
- Extract ConfirmDialog component for destructive action confirmations with optional checkbox
- Extract ProjectCard component with pin toggle, rename, delete, and drag handle support
- Extract InfoDialog component with PERT steps, formulas, and FAQ content
- Replace inline project card HTML in ProjectsList with reusable ProjectCard component
- Replace inline HoverCard tooltips and metric cards in Demo with extracted components
- Replace inline info dialog with InfoDialog component
- Modularize Excel export into @/utils/excel with buildFilename, buildSheetContents, and index modules
- Replace inline ExcelJS workbook construction in Demo with @/utils/excel module
- Remove unused monolithic exportToExcel.ts replaced by modular excel/ utils

---

## [1.2.0] - 2026-03-28

### Features
- Add multi-project support with project list store, save dialog, auto-save, and localStorage persistence
- Add ProjectsList page with project cards, rename, and delete dialogs
- Add /projects route and update /demo to accept project id parameter
- Add pin/unpin with visual indicator, 6-project pin limit, and drag-and-drop reordering for pinned projects
- Add reset confirmation dialog with option to disable warning
- Redesign project cards with compact stats layout and title attributes on action buttons

### Styling
- Format template indentation and replace arbitrary max-width with Tailwind utility

### Tests
- Update projectStore tests to use exportState and loadFromProject

---

## [1.1.1] - 2026-03-28

### Fixes
- Fix Checkbox components not persisting state due to mismatched bindings between component (`model-value`) and consumers (`checked`)
- Align all Checkbox usages to use `model-value`/`update:model-value` with proper type coercion
- Replace toggle functions with Vue `watch` to auto-persist `retainMilestone` and `deleteWarning` state changes to localStorage

### Refactoring
- Remove `toggleRetainMilestone` and `toggleDeleteWarning` functions in favor of direct state assignment with reactive `watch`

### Tests
- Update project store tests to use direct assignment instead of removed toggle function

---

## [1.1.0] - 2026-03-26

### Features
- Add delete confirmation dialog with option to disable warning
- Add deleteWarning state with toggle function and localStorage persistence
- Add drag and drop task reordering with VueDraggable, switch to grid layout, and auto-save on changes
- Expose saveToStorage function from projectStore for auto-save on task list changes
- Add task edit dialog with Pencil icon and update actions column width to w-20
- Implement milestone grouping in task table and add retain checkbox
- Add description input, display, and export with HoverCard truncation
- Add description field to NewTask interface
- Integrate Pinia state management
- Implement Pinia store with localStorage persistence for project state
- Add Toaster component for toast notifications
- Add milestone field to NewTask interface
- Add NewTask, PERTTaskResult, StoredState, and Analysis type interfaces

### Fixes
- Validate undefined values in editTaskForm to prevent saving with empty estimates
- Add ScrollArea to info dialog for proper content scrolling
- Add targetDuration validation in exportToExcel
- Fix Toaster component indentation
- Remove unused DialogFooter import

### Refactoring
- Allow to add values with decimal and remove the auto round-off
- Refactor Demo component to use Pinia store and localStorage persistence
- Split types into separate module files
- Convert GitHub link to icon-only Button component
- Remove formula footnote from Excel task sheet
- Replace Alert component with toast notifications in addTask

### Styling
- Improve the UI by adding specific design for mobile, tablet, and desktop view
- Adjust the z-index of the toast in able to stand-out in dialog component
- Add text selection styling
- Update info dialog icon and button hover colors

### Tests
- Add unit tests for project store

### Chores
- Add nul to gitignore to exclude temporary files
- Install vue-draggable-plus library
- Install pinia for state management
- Install textarea component
- Install checkbox component
- Remove unused components
- Refactor README to concise format, move detailed guides to docs directory
- Add comprehensive usage guide covering PERT methodology and app features
- Install vue-sonner in dependencies
- Install sonner for toast

---

## [1.0.1] - 2026-03-16

### Features
- Add dialog for usage (steps), formulas, and FAQs
- Implement the hover-card info on each input fields
- Implement alert message if complete or adding task

### Improvements
- Replace value of the o, m, and p if the value is null to 0 to avoid issue
- Implement value of null initially and on reset to avoid default values of 0.0 that add another action from the user to clear it before adding another
- Add null value support for the input value
- Add color scheme for the .dark class in able to adapt the browser's scrollbar in light or dark mode

### Refactoring
- Use native table instead of shadcn to avoid issues when using scroll-area

### Fixes
- Redirect all paths to index.html for SPA routing
- Remove unused DialogFooter import
- Remove unused table component directory

### Tests
- Add null value handling tests for expected time calculation
- Add null value handling tests for standard deviation calculation

### Chores
- Install dialog for info
- Install hover card for input's info
- Install alert component

---

## [1.0.0] - 2026-03-15

### Features
- Add inline editing for optimistic, mostLikely, and pessimistic values in task table
- Add reset page state button and function to clear tasks and reset inputs
- Add remove row in task list
- Integrate Z-score and probability calculations in AddTask and update default desired time
- Add probability calculation utility using polynomial approximation of cumulative distribution function
- Add Z-score calculation utility for deadline probability analysis
- Display calculated totals in table footer and update AddTask to compute total expected time and variance
- Add total variance and expected time calculation utilities
- Replace hardcoded task values with PERT calculation utilities in AddTask function
- Add variance calculation utility
- Add expected time calculation utility using PERT formula
- Add PERT calculation constants
- Implement adding of task with default computed values
- Add interface for task with exptected, std, and variance
- Add download button for exporting in excel and separator for the tasks and input/analysis
- Implement go to home router
- Create a centralized types for interfaces
- Implement router in able to redirect the current displayed page to other
- Wrap the router pages in proper main element with scroll-area
- Add appearance composable for theme management
- Add appearance and theme types
- Add theme toggle button to App component
- Add page transition animations
- Implement static content for the demo calculation page
- Create a landing-page for the app
- Implement export to excel the added tasks
- Add catch-all route for 404 handling
- Add 404 not found page
- Add GitHub link button and adjust layout
- Add scrollable table with card container
- Add grid background and page transition styles

### Fixes
- Fix code structure to pass the eslint test
- Use named import for iconify

### Refactoring
- Use Tailwind shorthand classes
- Use proper design and get necessary data such as the analysis part and the task list
- Rename variables and functions to follow camelCase naming convention and improve code organization
- Extract task reset logic from AddTask into separate resetTask function
- Refactor analysis from reactive to computed property for automatic recalculation
- Install iconfily to use for github icon
- Remove unused svgs

### Styling
- Improve Home page formatting
- Refactor Demo page layout and improve UI
- Update color scheme with purple-themed palette
- Fix table cell indentation
- Move the label into input to lessen the words that the user need before starting
- Update the page title and add info button
- Update font and width of the page to match in homepage
- Update the icon of the application

### Tests
- Add unit tests for calculateVariance utility
- Add unit tests for calculateTotals utility
- Add unit tests for calculateStandardDeviation utility
- Add unit tests for calculateProbability utility
- Add unit tests for calculateExpectedTime utility

### Chores
- Update lock file after dependency changes
- Add @vueuse/core and remove @tanstack/vue-table dependency
- Add default 0 value for z-score and probability
- Update the dependencies in added ui components
- Install input component for task
- Install the table to display the task list
- Install the number-filed to avoid using input type number (to utilize the shadcn)
- Install label for input
- Install separator to properly group the content of home page
- Install scroll-area to use it as overflow instead of default of browser
- Install badge component to highlight the PERT-based calculation
- Install vue-router
- Add MIT license
- Add GitHub icon asset
- Update TypeScript configuration
- Add vue-table in dependencies
- Install exceljs library for exporting data

### CI/CD
- Add GitHub Actions workflow for linting
- Add GitHub Actions workflow for build
- Add GitHub Actions workflow for tests
- Update Node.js version to 22
- Add GitHub Actions badges to README
- Add ESLint configuration
- Install lint and type checking for lints.yml

### Documentation
- Add GitHub Actions badges to README
- Update badges format and add lint badge
- Explain the data driven framework and how it works
